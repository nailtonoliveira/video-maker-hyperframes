"""As etapas de um vídeo, em ordem. Cada uma lê e escreve só dentro da pasta do vídeo; o estado fica em pipeline.json."""
import json, math, os, pathlib, re, shutil, subprocess, sys

from . import align, audio, config, tts
from .catalog import Catalogo, agora
from .llm import LLM

ETAPAS = ["roteiro", "tts", "voz", "tempos", "legendas", "prompt", "cenas", "trilha", "render", "metadados", "publicar"]
COM_AJUSTES = {"roteiro", "tts", "cenas", "metadados"}  # etapas que aceitam "o que mudar" ao refazer


def say(msg=""):
    print(msg, flush=True)


class Video:
    def __init__(self, path):
        self.dir = pathlib.Path(path).resolve()
        self.state_file = self.dir / "pipeline.json"
        if not self.state_file.exists():
            raise SystemExit(f"sem pipeline.json em {config.rel(self.dir)} (vídeo não foi criado pelo pipeline)")
        self.state = json.loads(self.state_file.read_text(encoding="utf-8"))
        self.cfg = config.load_niche(self.state["nicho"])
        self.ensaio = self.state.get("ensaio", False)
        self.log_dir = self.dir / ".pipeline"
        self.llm = LLM(self.cfg, ensaio=self.ensaio, log_dir=self.log_dir)

    # ---- estado -------------------------------------------------------------------------------
    def salvar(self):
        self.state_file.write_text(json.dumps(self.state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    def status(self, etapa):
        return self.state["etapas"].get(etapa, {}).get("status", "pendente")

    def marcar(self, etapa, status, **extra):
        e = self.state["etapas"].setdefault(etapa, {})
        e.update(status=status, em=agora(), **extra)
        self.salvar()

    def resetar_desde(self, etapa):
        for e in ETAPAS[ETAPAS.index(etapa):]:
            self.state["etapas"].pop(e, None)
        self.salvar()

    def catalogo(self, estado, **extra):
        if self.state.get("tema_id"):
            cat = Catalogo(self.cfg["_dir"])
            cat.mudar(self.state["tema_id"], estado, video=self.dir.name, **extra)
            cat.salvar()

    # ---- utilidades ---------------------------------------------------------------------------
    def prompt(self, nome, **vars):
        tpl = (self.cfg["_dir"] / "prompts" / f"{nome}.md").read_text(encoding="utf-8")
        for k, val in vars.items():
            tpl = tpl.replace("{{" + k + "}}", str(val))
        falta = re.findall(r"\{\{(\w+)\}\}", tpl)
        if falta:
            raise SystemExit(f"prompts/{nome}.md: marcadores sem valor: {falta}")
        return tpl

    def niche_md(self):
        return (self.cfg["_dir"] / "NICHE.md").read_text(encoding="utf-8")

    def read_json(self, name):
        return json.loads((self.dir / name).read_text(encoding="utf-8"))

    def write_json(self, name, data):
        (self.dir / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    def duracao(self):
        m = re.search(r'data-composition-id="main"[^>]*?data-duration="([\d.]+)"',
                      (self.dir / "index.html").read_text(encoding="utf-8"), re.S)
        return float(m.group(1))

    def hf(self, *args, capture=True):
        """Roda o CLI do HyperFrames na versão fixada no package.json do vídeo, com Node 22."""
        pkg = json.loads((self.dir / "package.json").read_text(encoding="utf-8"))
        m = re.search(r"hyperframes@([\w.\-]+)", pkg["scripts"]["check"])
        cmd = ["npx", "--yes", f"hyperframes@{m.group(1) if m else 'latest'}", *args]
        return subprocess.run(cmd, cwd=self.dir, env=config.sub_env(), text=True,
                              capture_output=capture, timeout=1800)

    def py(self, script, *args):
        r = subprocess.run([str(config.VENV_PY), str(config.TOOLS / script), *map(str, args)],
                           cwd=config.ROOT, text=True, capture_output=True)
        if r.returncode:
            raise SystemExit(f"{script} falhou:\n{r.stdout}\n{r.stderr}")
        return r.stdout


def ajustes_txt(ajustes):
    return f"\n# Ajustes pedidos na revisão (prioridade máxima)\n{ajustes}\n" if ajustes else ""


def ffprobe_dur(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                       capture_output=True, text=True)
    return float(r.stdout.strip() or 0)


# ==== 1. roteiro ===================================================================================
def _validar_roteiro(d, mundos=None):
    if not d.get("titulo") or not d.get("titulo_tela") or not d.get("cenas"):
        raise ValueError("faltam titulo, titulo_tela ou cenas")
    for c in d["cenas"]:
        if not c.get("locucao") or not isinstance(c.get("ancoras"), list):
            raise ValueError(f"cena {c.get('n')} sem locucao/ancoras")
        if mundos and c.get("mundo") not in mundos:
            raise ValueError(f"cena {c.get('n')}: mundo {c.get('mundo')!r} fora de {list(mundos)}")


def roteiro_md(d, pps):
    n = sum(len(c["locucao"].split()) for c in d["cenas"])
    out = [f"# {d['titulo']}", "", f"**Título na tela (frame 0):** {d['titulo_tela']}  ", f"**Resumo:** {d.get('resumo', '')}  ",
           f"**Palavras:** {n} (≈ {n / pps:.0f} s de narração)", ""]
    for c in d["cenas"]:
        out += [f"## Cena {c['n']} — {c.get('nome', '')}", "", f"**Locução:** {c['locucao']}", "", f"**Visual:** {c.get('visual', '')}", ""]
        out += [f"**Mundo:** {c['mundo']}", ""] if c.get("mundo") else []
        out += ["**Âncoras:**"] + [f"- \"{a['gatilho']}\" → {a['visual']}" for a in c["ancoras"]] + [""]
    lp = d.get("loop", {})
    out += ["## Loop", "", f"> {lp.get('leitura_continua', '')}", "", "## Fatos", ""]
    out += [f"- {f['fato']} — *{f.get('fonte', '?')}* ({f.get('confianca', '?')})" for f in d.get("fatos", [])]
    return "\n".join(out) + "\n"


def etapa_roteiro(v, ajustes=""):
    t = v.state["tema"]
    dur, pps = v.cfg["duracao_alvo_s"], v.cfg["palavras_por_segundo"]
    tema = "\n".join(filter(None, [
        f"**Tema:** {t['titulo']}",
        f"**Gancho sugerido:** {t['gancho']}" if t.get("gancho") else "",
        f"**Resumo:** {t['resumo']}" if t.get("resumo") else "",
        "**Fatos-chave:** " + "; ".join(t["fatos_chave"]) if t.get("fatos_chave") else "",
        "**Fontes:** " + "; ".join(t["fontes"]) if t.get("fontes") else "",
    ]))
    p = v.prompt("roteiro", NICHE_MD=v.niche_md(), TEMA=tema, DURACAO=dur,
                 PALAVRAS_MIN=round(dur * pps * 0.9), PALAVRAS_MAX=round(dur * pps * 1.1), AJUSTES=ajustes_txt(ajustes))
    d = v.llm.json("roteiro", p, criativo=True, pesquisa=True, validar=lambda d: _validar_roteiro(d, v.cfg.get("mundos")))
    v.write_json("roteiro.json", d)
    md = roteiro_md(d, pps)
    (v.dir / "roteiro.md").write_text(md, encoding="utf-8")
    return md


# ==== 2. texto para TTS ============================================================================
def etapa_tts(v, ajustes=""):
    rot = v.read_json("roteiro.json")
    cenas = "\n".join(f"Cena {c['n']}: {c['locucao']}" for c in rot["cenas"])

    def validar(d):
        if [c.get("n") for c in d.get("cenas", [])] != [c["n"] for c in rot["cenas"]] or not all(c.get("texto") for c in d["cenas"]):
            raise ValueError("número de cenas diferente do roteiro ou texto vazio")

    p = v.prompt("tts", CENAS=cenas, REGRAS_MOTOR=v.cfg["voz"].get("regras_texto") or "sem regras extras", AJUSTES=ajustes_txt(ajustes))
    d = v.llm.json("tts", p, criativo=False, validar=validar)
    v.write_json("tts.json", d)
    texto = "\n".join(c["texto"] for c in d["cenas"])
    (v.dir / "tts.txt").write_text(texto + "\n", encoding="utf-8")
    return texto


# ==== 3. narração ==================================================================================
def etapa_voz(v, ajustes=""):
    texto = (v.dir / "tts.txt").read_text(encoding="utf-8").strip()
    dest = v.dir / "assets" / "voice.mp3"
    say(f"  gerando narração ({len(texto)} caracteres)…")
    tts.gerar(texto, v.cfg["voz"], dest, ensaio=v.ensaio)
    dur = ffprobe_dur(dest)
    return f"{config.rel(dest)} — {dur:.1f} s\nOuça antes de aprovar: xdg-open {config.rel(dest)}"


# ==== 4. tempos por palavra ========================================================================
def etapa_tempos(v, ajustes=""):
    out = v.py("transcribe.py", v.dir / "assets" / "voice.mp3", "--modelo", v.cfg["whisper"]["modelo"])
    return out.strip().splitlines()[-1]


# ==== 5. duração + legendas ========================================================================
def etapa_legendas(v, ajustes=""):
    out = [v.py("set_duration.py", v.dir).strip().splitlines()[0]]
    fixes = align.caption_fixes(v.read_json("roteiro.json"), v.read_json("assets/voice.json"))
    cap_file = v.dir / "captions.json"
    cap = json.loads(cap_file.read_text(encoding="utf-8")) if cap_file.exists() else {}
    cap["fixes_idx"] = fixes
    cap_file.write_text(json.dumps(cap, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    out.append(v.py("build_captions.py", v.dir).strip().splitlines()[0])
    if fixes:
        words, _, _ = align.words_from_voice(v.read_json("assets/voice.json"))
        out.append("correções da transcrição: " + ", ".join(f"{words[int(i)]['text']} → {w}" for i, w in fixes.items()))
    return "\n".join(out)


# ==== 6. prompt do HyperFrames =====================================================================
def etapa_prompt(v, ajustes=""):
    rot = v.read_json("roteiro.json")
    dur = v.duracao()
    tl = align.scene_timeline(rot, v.read_json("assets/voice.json"), dur)
    v.log_dir.mkdir(exist_ok=True)
    (v.log_dir / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=2), encoding="utf-8")
    fmt = lambda t: "?" if t is None else f"{t:.2f} s"
    linhas, faltando = [], 0
    for c, rc in zip(tl, rot["cenas"]):
        linhas += [f"**Cena {c['n']} — {c['nome']}** ({fmt(c['inicio'])} → {fmt(c['fim'])})",
                   f"- Locução: {rc['locucao']}", f"- Visual: {rc.get('visual', '')}"]
        if rc.get("mundo"):
            linhas.append(f"- Mundo: {rc['mundo']}")
        for a in c["ancoras"]:
            faltando += a["t"] is None
            linhas.append(f"  - {fmt(a['t'])} · \"{a['gatilho']}\" → {a['visual']}")
        linhas.append("")
    fatos = "\n".join(f"- {f['fato']} ({f.get('fonte', '')})" for f in rot.get("fatos", [])) or "- (nenhum)"
    lido = lambda rel: (v.dir / rel).read_text(encoding="utf-8") if (v.dir / rel).exists() else ""
    motor, kit = (lido("assets/motor/PROMPT.md"), lido("assets/kit/KIT.md")) if v.cfg.get("motor") else ("", "")
    p = v.prompt("hyperframes", MOTOR=motor, KIT=kit, TITULO=rot["titulo"], TITULO_TELA=rot["titulo_tela"], DURACAO=f"{dur:g}",
                 FRAMES=math.ceil(dur * 30), TIMELINE="\n".join(linhas).strip(), FATOS=fatos)
    (v.dir / "hyperframes-prompt.md").write_text(p, encoding="utf-8")
    total = sum(len(c["ancoras"]) for c in tl)
    return f"hyperframes-prompt.md — {len(tl)} cenas, {total - faltando}/{total} âncoras localizadas no áudio"


# ==== 7. cenas (Claude Code + HyperFrames) =========================================================
def _claude(v, prompt, rotulo):
    cc = v.cfg["claude_code"]
    cmd = ["claude", "-p", prompt, "--output-format", "stream-json", "--verbose",
           "--permission-mode", cc["modo_permissao"], "--allowedTools", *cc["ferramentas"]]
    if cc.get("modelo"):
        cmd += ["--model", cc["modelo"]]
    usa_api = os.environ.get("CLAUDE_CODE_USA_API_KEY", "0") == "1"
    v.log_dir.mkdir(exist_ok=True)
    log = v.log_dir / f"{rotulo}.jsonl"
    say(f"  Claude Code trabalhando em {config.rel(v.dir)} (log: {config.rel(log)}) — pode levar dezenas de minutos")
    final = {}
    with open(log, "w", encoding="utf-8") as fh, subprocess.Popen(
            cmd, cwd=v.dir, env=config.sub_env(drop_anthropic_key=not usa_api),
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True) as proc:
        for line in proc.stdout:
            fh.write(line)
            try:
                ev = json.loads(line)
            except ValueError:
                continue
            if ev.get("type") == "assistant":
                for b in ev.get("message", {}).get("content", []):
                    if b.get("type") == "tool_use":
                        inp = b.get("input", {})
                        alvo = inp.get("command") or inp.get("file_path") or inp.get("skill") or inp.get("pattern") or ""
                        say(f"    · {b['name']} {str(alvo).splitlines()[0][:90] if alvo else ''}")
            elif ev.get("type") == "result":
                final = ev
    if proc.returncode or final.get("is_error"):
        raise SystemExit(f"Claude Code terminou com erro (veja {config.rel(log)}): {str(final.get('result', ''))[:300]}")
    custo = final.get("total_cost_usd")
    return f"{final.get('num_turns', '?')} turnos" + (f", custo informado US$ {custo:.2f}" if custo and usa_api else "")


def _check_e_snapshot(v):
    r = v.hf("check", "--json")
    raw = r.stdout[r.stdout.find("{"):] if "{" in r.stdout else "{}"
    try:
        d = json.loads(raw)
    except ValueError:
        d = {}
    erros = sum(x.get("errorCount", 0) for x in d.values() if isinstance(x, dict))
    avisos = sum(x.get("warningCount", 0) for x in d.values() if isinstance(x, dict))
    dur = v.duracao()
    tl_file = v.log_dir / "timeline.json"
    pontos = [0.0] + ([round((c["inicio"] + c["fim"]) / 2, 2) for c in json.loads(tl_file.read_text()) if c["inicio"] is not None]
                      if tl_file.exists() else []) + [round(dur - 0.05, 2)]
    s = v.hf("snapshot", "--at", ",".join(f"{p:g}" for p in pontos))
    sheet = next((ln.strip().split(" ")[0] for ln in s.stdout.splitlines() if "contact-sheet" in ln), "?")
    return d.get("ok", False) and erros == 0, f"check: {erros} erros, {avisos} avisos · quadros: {config.rel(sheet) if sheet != '?' else sheet}"


def etapa_cenas(v, ajustes=""):
    if v.ensaio:
        info = "ensaio: Claude Code não foi chamado (cenas do template mantidas)"
    elif ajustes:
        info = _claude(v, f"/hyperframes Revise as cenas deste projeto HyperFrames (trabalhe só nesta pasta, modo sem paradas). "
                          f"Ajustes pedidos:\n{ajustes}\n\nDepois rode `npm run check`, corrija os erros, rode "
                          f"`npx hyperframes snapshot --review`, confira e atualize REVIEW.md. Não renderize.", "cenas-ajuste")
    else:
        info = _claude(v, (v.dir / "hyperframes-prompt.md").read_text(encoding="utf-8"), "cenas")
    ok, chk = _check_e_snapshot(v)
    if not ok:
        say(f"  ⚠ {chk}")
    return "\n".join([info, chk, "Preview para revisar: cd " + config.rel(v.dir) + " && npx hyperframes preview --background",
                      "(pare com: npx hyperframes preview --stop)"])


# ==== 7b. trilha sonora ============================================================================
def etapa_trilha(v, ajustes=""):
    if not (v.dir / "assets" / "episode" / "trilha.json").exists():
        return "sem trilha.json: nada a gerar"
    r = subprocess.run([str(config.VENV_PY), str(config.ROOT / "shared" / "trilha" / "trilha.py"), str(v.dir)],
                       cwd=config.ROOT, text=True, capture_output=True)
    if r.returncode:
        raise SystemExit(f"trilha.py falhou:\n{r.stdout}\n{r.stderr}")
    return r.stdout.strip()


# ==== 8. render ====================================================================================
def etapa_render(v, ajustes=""):
    say("  renderizando…")
    r = v.hf("render")
    if r.returncode:
        raise SystemExit(f"render falhou:\n{r.stdout[-2000:]}\n{r.stderr[-2000:]}")
    mp4 = max((v.dir / "renders").glob("*.mp4"), key=lambda p: p.stat().st_mtime)
    v.state["render"] = config.rel(mp4)
    v.catalogo("produzido")
    lufs = v.cfg.get("audio_lufs")
    if lufs is not None:
        antes, depois = audio.normalizar(mp4, lufs)
    resumo = f"{config.rel(mp4)} — {ffprobe_dur(mp4):.1f} s, {mp4.stat().st_size / 1e6:.1f} MB"
    return resumo + (f"\náudio: {antes:.1f} → {depois:.1f} LUFS" if lufs is not None else "")


# ==== 9. metadados =================================================================================
def etapa_metadados(v, ajustes=""):
    rot = v.read_json("roteiro.json")
    plats = v.cfg["plataformas"]
    resumo = "\n".join([f"Título: {rot['titulo']}", f"Resumo: {rot.get('resumo', '')}",
                        "Locução: " + " ".join(c["locucao"] for c in rot["cenas"]),
                        "Fatos: " + "; ".join(f"{f['fato']} ({f.get('fonte', '')})" for f in rot.get("fatos", []))])

    def validar(d):
        falta = [p for p in plats if p not in d]
        if falta:
            raise ValueError(f"faltam plataformas: {falta}")

    p = v.prompt("metadados", NICHE_MD=v.niche_md(), ROTEIRO=resumo, PLATAFORMAS=", ".join(plats), AJUSTES=ajustes_txt(ajustes))
    d = v.llm.json("metadados", p, criativo=False, validar=validar)
    pub = v.dir / "publicar"
    pub.mkdir(exist_ok=True)
    (pub / "metadados.json").write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    textos = []
    for plat in plats:
        m = d[plat]
        partes = []
        if m.get("titulo"):
            partes += ["TÍTULO", m["titulo"], ""]
        if m.get("descricao"):
            partes += ["DESCRIÇÃO", m["descricao"], ""]
        if m.get("legenda"):
            partes += ["LEGENDA", m["legenda"], ""]
        if m.get("hashtags"):
            partes += ["HASHTAGS", " ".join(m["hashtags"]), ""]
        if m.get("tags"):
            partes += ["TAGS", ", ".join(m["tags"]), ""]
        txt = "\n".join(partes).strip() + "\n"
        (pub / f"{plat}.txt").write_text(txt, encoding="utf-8")
        textos.append(f"── {plat} ──\n{txt}")
    return "\n".join(textos)


# ==== 10. pasta publicar ===========================================================================
CHECKLIST = """# Publicar: {titulo}

Vídeo: `{mp4}` · textos prontos em `<plataforma>.txt`

{itens}

Depois de publicar em cada rede, registre (guarda o link no catálogo):

    ./pipeline publicado {video} <plataforma> <link>

Lembretes:
- Marque o conteúdo como gerado/alterado com IA quando a plataforma pedir (voz sintética).
- Confira o título e a thumbnail (frame 0) no app antes de publicar.
"""


def etapa_publicar(v, ajustes=""):
    src = config.ROOT / v.state["render"]
    pub = v.dir / "publicar"
    pub.mkdir(exist_ok=True)
    dest = pub / f"{v.state['id']}.mp4"
    shutil.copyfile(src, dest)
    rot = v.read_json("roteiro.json")
    itens = "\n".join(f"- [ ] {p}" for p in v.cfg["plataformas"])
    (pub / "CHECKLIST.md").write_text(CHECKLIST.format(titulo=rot["titulo"], mp4=dest.name, itens=itens,
                                                       video=config.rel(v.dir)), encoding="utf-8")
    v.catalogo("pronto")
    return f"{config.rel(pub)}/ pronto: {dest.name}, textos por plataforma e CHECKLIST.md"


FUNCOES = {n: globals()[f"etapa_{n}"] for n in ETAPAS}


# ==== execução =====================================================================================
def _aprovar(v, etapa, resumo, auto):
    """Ponto de aprovação. → 'aprovado' | 'refazer:<ajustes>' | 'parar'."""
    if auto:
        linhas = resumo.rstrip().splitlines()
        say("  " + "\n  ".join(linhas[:8]) + (f"\n  … (+{len(linhas) - 8} linhas)" if len(linhas) > 8 else ""))
        say("  (aprovado automaticamente)")
        return "aprovado"
    say(f"\n┌─ Aprovação: {etapa} " + "─" * 40)
    say(resumo.rstrip())
    say("└" + "─" * 55)
    if not sys.stdin.isatty():
        say(f"Aguardando aprovação. Para aprovar e seguir: ./pipeline rodar {config.rel(v.dir)} --aprovar")
        return "parar"
    while True:
        r = input("Aprovar? [s]im / [r]efazer / [p]arar: ").strip().lower()
        if r in ("s", "sim", "y"):
            return "aprovado"
        if r in ("p", "parar", "q"):
            return "parar"
        if r in ("r", "refazer"):
            aj = input("O que mudar? (Enter = só gerar de novo): ").strip() if etapa in COM_AJUSTES else ""
            return f"refazer:{aj}"


def rodar(v, auto=False, ate=None, aprovar=False):
    gates = set(v.cfg["aprovacoes"])
    for etapa in ETAPAS:
        st = v.status(etapa)
        if st in ("feito", "aprovado"):
            continue
        ajustes = ""
        while True:
            if st != "aguardando":
                say(f"\n▶ {etapa}")
                try:
                    resumo = FUNCOES[etapa](v, ajustes) or ""
                except Exception as e:
                    v.marcar(etapa, "erro", erro=str(e)[:500])
                    raise
                if etapa not in gates:
                    v.marcar(etapa, "feito", resumo=resumo)
                    say("  " + resumo.replace("\n", "\n  "))
                    break
                v.marcar(etapa, "aguardando", resumo=resumo)
            else:
                resumo = v.state["etapas"][etapa].get("resumo", "")
            dec = "aprovado" if aprovar else _aprovar(v, etapa, resumo, auto)
            aprovar = False
            if dec == "aprovado":
                v.marcar(etapa, "aprovado", resumo=resumo)
                break
            if dec == "parar":
                return False
            ajustes, st = dec.split(":", 1)[1], "pendente"
            v.resetar_desde(etapa)
        if ate and etapa == ate:
            say(f"\nParado depois de '{ate}', como pedido.")
            return False
    say(f"\n✔ {v.state['id']} concluído. Arquivos para publicar em {config.rel(v.dir / 'publicar')}/")
    return True
