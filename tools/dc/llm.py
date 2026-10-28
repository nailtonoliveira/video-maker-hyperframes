"""IA de texto: Gemini (padrão) ou Claude, sempre devolvendo JSON. No modo ensaio lê tools/fixtures/ensaio/<etapa>.json."""
import json, os, pathlib, re

from . import config


class LLMError(RuntimeError):
    pass


def extract_json(text):
    """Primeiro objeto/lista JSON do texto (aceita cercas ```json e texto em volta)."""
    t = text.strip()
    m = re.search(r"```(?:json)?\s*(.*?)```", t, re.S)
    if m:
        t = m.group(1).strip()
    starts = [i for i in (t.find("{"), t.find("[")) if i >= 0]
    if not starts:
        raise LLMError("resposta sem JSON")
    s = min(starts)
    e = max(t.rfind("}"), t.rfind("]"))
    return json.loads(t[s:e + 1])


class LLM:
    def __init__(self, niche_cfg, ensaio=False, log_dir=None):
        self.cfg = niche_cfg["llm"]
        self.ensaio = ensaio
        self.log_dir = pathlib.Path(log_dir) if log_dir else None
        self._gemini = self._claude = None

    # ---- público ----------------------------------------------------------------------------
    def json(self, etapa, prompt, criativo=True, pesquisa=False, validar=None):
        """Gera e devolve um JSON. `validar(dict)` levanta ValueError se faltar algo; tenta 2 vezes."""
        if self.ensaio:
            data = json.loads((config.FIXTURES / f"{etapa}.json").read_text(encoding="utf-8"))
            self._log(etapa, prompt, json.dumps(data, ensure_ascii=False, indent=2))
            return data
        modelo = self.cfg["modelo_criativo" if criativo else "modelo_rapido"]
        ultimo = None
        for tentativa in range(2):
            p = prompt if not ultimo else f"{prompt}\n\nA resposta anterior foi inválida ({ultimo}). Devolva somente o JSON pedido."
            texto = self._gerar(p, modelo, pesquisa and self.cfg.get("pesquisa", True))
            self._log(etapa if not tentativa else f"{etapa}-2", p, texto)
            try:
                data = extract_json(texto)
                if validar:
                    validar(data)
                return data
            except (ValueError, LLMError) as e:
                ultimo = str(e)[:200]
        raise LLMError(f"{etapa}: a IA não devolveu um JSON válido ({ultimo})")

    def embeddings(self, textos):
        """Vetores para comparar temas; None se indisponível (ensaio, provedor sem embeddings, sem chave)."""
        if self.ensaio or not textos or not os.environ.get("GEMINI_API_KEY"):
            return None
        try:
            r = self._gemini_client().models.embed_content(model=self.cfg["modelo_embeddings"], contents=textos)
            return [e.values for e in r.embeddings]
        except Exception as e:  # embeddings são um extra: sem eles, fica só a comparação por texto
            print(f"  (embeddings indisponíveis: {str(e)[:120]})")
            return None

    # ---- provedores -------------------------------------------------------------------------
    def _gerar(self, prompt, modelo, pesquisa):
        prov = self.cfg["provedor"]
        if prov == "gemini":
            return self._gerar_gemini(prompt, modelo, pesquisa)
        if prov == "claude":
            return self._gerar_claude(prompt, modelo)
        if prov == "antigravity":
            return self._gerar_antigravity(prompt, modelo, pesquisa)
        raise LLMError(f"provedor desconhecido: {prov}")

    def _gerar_antigravity(self, prompt, modelo, pesquisa):
        """Antigravity CLI (`agy -p`) com o login da assinatura Google AI Pro: sem custo de API."""
        import shutil, subprocess, tempfile
        exe = shutil.which("agy")
        if not exe:
            raise LLMError("Antigravity CLI (agy) não encontrado no PATH")
        regra = ("Para checar os fatos, use só a busca na web (search_web) e a leitura de páginas. "
                 if pesquisa else "Não use ferramentas nem pesquise na web: responda direto. ")
        regra += ("Não rode comandos de terminal, não abra o navegador e não crie arquivos: "
                  "a sua resposta final é o único resultado. Os links de fonte podem ficar como a busca os devolver.")
        # Sem chaves de API no ambiente: o agy deve usar o login da assinatura, não cobrança por chave.
        env = {k: v for k, v in os.environ.items() if k not in ("GEMINI_API_KEY", "GOOGLE_API_KEY")}
        aviso = ""
        for tentativa in range(2):
            # Pasta vazia como workspace: o agy não lê AGENTS.md/CLAUDE.md do projeto nem mexe em nada dele.
            with tempfile.TemporaryDirectory(prefix="agy-") as tmp:
                try:
                    r = subprocess.run(
                        [exe, "-p", f"{regra}{aviso}\n\n{prompt}", "--model", modelo, "--output-format", "json",
                         "--disable-slash-commands", "--print-timeout", "900s"],
                        cwd=tmp, env=env, capture_output=True, text=True, timeout=960)
                except subprocess.TimeoutExpired:
                    raise LLMError(f"Antigravity ({modelo}) passou de 15 min sem responder")
            try:
                out = json.loads(r.stdout.strip().splitlines()[-1])
            except (ValueError, IndexError):
                raise LLMError(f"Antigravity saiu com código {r.returncode}: {(r.stderr or r.stdout).strip()[:400]}")
            texto = (out.get("response") or "").strip()
            if out.get("status") == "SUCCESS" and texto:
                return self._resolver_links(texto)
            negadas = [d.get("tool_name") or d.get("name") or str(d)[:60] for d in out.get("denied_actions") or []]
            if negadas and not tentativa:
                print(f"  Antigravity tentou usar {', '.join(map(str, negadas))} (negado); tentando de novo…", flush=True)
                aviso = " Na tentativa anterior você tentou uma ferramenta proibida e ficou sem resposta."
                continue
            raise LLMError(f"Antigravity ({modelo}) terminou sem resposta: status {out.get('status')}"
                           + (f", ações negadas: {negadas}" if negadas else "")
                           + (f" ({r.stderr.strip()[:200]})" if r.stderr.strip() else ""))

    @staticmethod
    def _resolver_links(texto):
        """Troca os links de redirecionamento da busca do Google pela URL de destino (fica no roteiro como fonte)."""
        import urllib.error, urllib.request

        class SemRedirecionar(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, *a, **k):
                return None

        abrir = urllib.request.build_opener(SemRedirecionar).open
        cache = {}

        def destino(m):
            url = m.group(0)
            if url not in cache:
                cache[url] = url
                try:
                    abrir(urllib.request.Request(url, method="HEAD"), timeout=10)
                except urllib.error.HTTPError as e:
                    cache[url] = e.headers.get("Location") or url
                except Exception:
                    pass
            return cache[url]

        return re.sub(r"https://vertexaisearch\.cloud\.google\.com/grounding-api-redirect/[A-Za-z0-9_\-=%]+", destino, texto)

    def _gemini_client(self):
        if not self._gemini:
            key = os.environ.get("GEMINI_API_KEY")
            if not key:
                raise LLMError("GEMINI_API_KEY vazia no .env")
            from google import genai
            from google.genai import types
            # Sem as novas tentativas silenciosas do SDK: _gerar_gemini repete e avisa no terminal.
            self._gemini = genai.Client(api_key=key, http_options=types.HttpOptions(
                retry_options=types.HttpRetryOptions(attempts=1)))
        return self._gemini

    def _gerar_gemini(self, prompt, modelo, pesquisa):
        import time
        from google.genai import errors, types
        # A busca do Google não combina com resposta forçada em JSON: com busca, o JSON vem no texto.
        cfg = types.GenerateContentConfig(
            tools=[types.Tool(google_search=types.GoogleSearch())] if pesquisa else None,
            response_mime_type=None if pesquisa else "application/json",
        )
        esperas = [15, 30, 60, 120]  # para 500/503 (modelo sobrecarregado), que costuma passar sozinho
        while True:
            try:
                r = self._gemini_client().models.generate_content(model=modelo, contents=prompt, config=cfg)
                break
            except errors.APIError as e:
                msg = (e.message or "").strip()
                if e.code in (500, 503) and esperas:
                    s = esperas.pop(0)
                    print(f"  Gemini {e.code} ({modelo} sobrecarregado); tentando de novo em {s}s…", flush=True)
                    time.sleep(s)
                    continue
                if e.code == 429:
                    dica = ("Com a busca do Google ligada, isso costuma ser falta de cota de busca na sua conta: "
                            "ative o faturamento em https://ai.studio/projects ou desligue a busca com "
                            "\"pesquisa\": false em niche.json → \"llm\"." if pesquisa else
                            "Veja o uso em https://ai.dev/rate-limit; se for limite por minuto, espere e rode de novo.")
                    raise LLMError(f"Gemini 429, cota esgotada ({modelo}). {dica}")
                if e.code == 402:
                    raise LLMError("Gemini 402: créditos pré-pagos esgotados. Recarregue em https://ai.studio/projects")
                if e.code == 404:
                    raise LLMError(f"Gemini 404: modelo {modelo} indisponível para esta chave. Troque em niche.json → \"llm\". ({msg[:150]})")
                if e.code in (500, 503):
                    raise LLMError(f"Gemini {e.code}: {modelo} continua sobrecarregado. Tente mais tarde ou use outro modelo em niche.json.")
                raise LLMError(f"Gemini {e.code}: {msg[:300]}")
        if not r.text:
            raise LLMError(f"Gemini sem texto na resposta ({getattr(r, 'prompt_feedback', None)})")
        return r.text

    def _gerar_claude(self, prompt, modelo):
        import anthropic
        if not self._claude:
            self._claude = anthropic.Anthropic()
        if not modelo.startswith("claude-"):
            modelo = "claude-opus-5-5"
        try:
            with self._claude.beta.messages.stream(
                model=modelo,
                max_tokens=64000,
                output_config={"effort": "high"},
                betas=["server-side-fallback-2026-07-01"],
                fallbacks="default",
                messages=[{"role": "user", "content": prompt}],
            ) as stream:
                msg = stream.get_final_message()
        except anthropic.AuthenticationError:
            raise LLMError("ANTHROPIC_API_KEY inválida ou vazia no .env")
        except anthropic.RateLimitError as e:
            raise LLMError(f"limite da API do Claude atingido: {e.message}")
        except anthropic.APIStatusError as e:
            raise LLMError(f"API do Claude ({e.status_code}): {e.message}")
        except anthropic.APIConnectionError:
            raise LLMError("sem conexão com a API do Claude")
        if msg.stop_reason == "refusal":
            raise LLMError("o Claude recusou o pedido")
        return "".join(b.text for b in msg.content if b.type == "text")

    def _log(self, etapa, prompt, resposta):
        if not self.log_dir:
            return
        self.log_dir.mkdir(parents=True, exist_ok=True)
        (self.log_dir / f"{etapa}.prompt.md").write_text(prompt, encoding="utf-8")
        (self.log_dir / f"{etapa}.resposta.txt").write_text(resposta, encoding="utf-8")
