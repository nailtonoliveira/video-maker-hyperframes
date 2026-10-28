"""Pipeline de produção dos Shorts: tema → roteiro → voz → tempos → legendas → cenas → render → metadados → publicar.

Use pelo atalho da raiz:  ./pipeline <comando> ...   (./pipeline -h para a lista)
"""
import argparse, json, os, pathlib, re, shutil, subprocess, sys, unicodedata

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from dc import config, stages, tts  # noqa: E402
from dc.catalog import Catalogo, agora  # noqa: E402
from dc.llm import LLM, LLMError  # noqa: E402

say = stages.say


def resolver_video(arg):
    """Aceita caminho (relativo à pasta atual ou à raiz) ou atalho <nicho>/<NNN>."""
    for base in (pathlib.Path.cwd(), config.ROOT):
        p = (base / arg).resolve()
        if (p / "pipeline.json").exists():
            return p
    m = re.fullmatch(r"([\w-]+)/(\d{1,3})", arg)
    if m:
        hits = sorted((config.NICHES / m.group(1) / "videos").glob(f"{int(m.group(2)):03d}-*"))
        if hits:
            return hits[0]
    raise SystemExit(f"vídeo não encontrado: {arg}")


def slugify(s, maxlen=30):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s[:maxlen].rstrip("-") or "video"


# ---- temas ------------------------------------------------------------------------------------
def gerar_temas(nicho, n, ajustes="", ensaio=False):
    cfg = config.load_niche(nicho)
    cat = Catalogo(cfg["_dir"])
    llm = LLM(cfg, ensaio=ensaio, log_dir=cfg["_dir"] / ".pipeline")
    tpl = (cfg["_dir"] / "prompts" / "temas.md").read_text(encoding="utf-8")
    prompt = (tpl.replace("{{NICHE_MD}}", (cfg["_dir"] / "NICHE.md").read_text(encoding="utf-8"))
                 .replace("{{EXISTENTES}}", cat.resumo_existentes()).replace("{{QUANTIDADE}}", str(n))
                 .replace("{{AJUSTES}}", stages.ajustes_txt(ajustes)))

    def validar(d):
        if not d.get("temas") or not all(t.get("titulo") for t in d["temas"]):
            raise ValueError("lista de temas vazia ou sem título")

    say(f"Pedindo {n} temas para '{nicho}'…")
    d = llm.json("temas", prompt, criativo=True, pesquisa=True, validar=validar)
    novos = []
    for t in d["temas"]:
        dup = cat.duplicado(t, llm)
        if dup:
            say(f"  ✗ repetido, ignorado: {t['titulo']}  (≈ {dup[0]['id']} {dup[0]['titulo']}: {dup[1]})")
            continue
        t["slug"] = slugify(t.get("slug") or t["titulo"])
        novo = cat.adicionar(t)
        cat.guardar_embedding(novo["id"], llm, novo)
        novos.append(novo)
    cat.salvar()
    return novos


def listar(temas):
    for t in temas:
        say(f"  {t['id']}  [{t['estado']}]  {t['titulo']}")
        if t.get("gancho"):
            say(f"        “{t['gancho']}”")


def cmd_temas(a):
    cfg = config.load_niche(a.nicho)
    if a.listar:
        cat = Catalogo(cfg["_dir"])
        listar(cat.temas if a.todos else cat.por_estado("sugerido"))
        return
    novos = gerar_temas(a.nicho, a.n, a.ajustes or "", a.ensaio)
    say(f"\n{len(novos)} temas novos no catálogo (niches/{a.nicho}/catalogo.json):")
    listar(novos)
    say(f"\nProduzir um: ./pipeline novo {a.nicho} <ID>    Descartar: ./pipeline descartar {a.nicho} <ID> ...")


def cmd_descartar(a):
    cat = Catalogo(config.load_niche(a.nicho)["_dir"])
    for tid in a.ids:
        t = cat.mudar(tid, "descartado")
        say(f"  descartado: {t['id']} {t['titulo']}")
    cat.salvar()


# ---- vídeo novo -------------------------------------------------------------------------------
def escolher_tema(a, cfg, cat):
    if a.tema:
        t = cat.adicionar({"titulo": a.tema, "slug": slugify(a.tema)}, estado="sugerido")
        cat.salvar()
        return t
    if a.id:
        t = cat.get(a.id)
        if t["estado"] != "sugerido":
            raise SystemExit(f"{t['id']} está '{t['estado']}', não 'sugerido'")
        return t
    sug = cat.por_estado("sugerido")
    if not sug:
        say("Nenhum tema sugerido no catálogo; gerando…")
        sug = gerar_temas(a.nicho, 10, ensaio=a.ensaio)
        cat.__init__(cfg["_dir"])
    if a.auto or not sys.stdin.isatty():
        return sug[0]
    listar(sug)
    while True:
        r = input("\nQual tema produzir? (ID, ou Enter para o primeiro): ").strip() or sug[0]["id"]
        try:
            t = cat.get(r)
            if t["estado"] == "sugerido":
                return t
        except SystemExit as e:
            say(str(e))


def cmd_novo(a):
    cfg = config.load_niche(a.nicho)
    cat = Catalogo(cfg["_dir"])
    t = escolher_tema(a, cfg, cat)
    videos = cfg["_dir"] / "videos"
    slug, k = t["slug"], 2
    while videos.exists() and any(p.name.endswith("-" + slug) for p in videos.iterdir()):
        slug, k = f"{t['slug']}-{k}", k + 1
    r = subprocess.run([sys.executable, str(config.TOOLS / "new_video.py"), a.nicho, slug], capture_output=True, text=True)
    if r.returncode:
        raise SystemExit(r.stderr or r.stdout)
    vdir = config.ROOT / re.search(r"Criado: (\S+)", r.stdout).group(1)
    tema = {k: v for k, v in t.items() if k not in ("estado", "criado_em", "atualizado_em")}
    state = {"id": json.loads((vdir / "meta.json").read_text())["id"], "nicho": a.nicho, "tema_id": t["id"],
             "tema": tema, "ensaio": a.ensaio, "criado_em": agora(), "etapas": {}}
    (vdir / "pipeline.json").write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    cat.__init__(cfg["_dir"])
    cat.mudar(t["id"], "em_producao", video=vdir.name)
    cat.salvar()
    say(f"Vídeo criado: {config.rel(vdir)}  (tema {t['id']}: {t['titulo']})" + ("  [ENSAIO]" if a.ensaio else ""))
    stages.rodar(stages.Video(vdir), auto=a.auto, ate=a.ate)


def cmd_rodar(a):
    v = stages.Video(resolver_video(a.video))
    if a.refazer:
        v.resetar_desde(a.refazer)
    stages.rodar(v, auto=a.auto, ate=a.ate, aprovar=a.aprovar)


# ---- acompanhamento ---------------------------------------------------------------------------
def cmd_status(a):
    nichos = [a.nicho] if a.nicho else sorted(p.name for p in config.NICHES.iterdir() if (p / "template").is_dir())
    for n in nichos:
        say(f"\n{n}")
        for vdir in sorted((config.NICHES / n / "videos").glob("*/")):
            sf = vdir / "pipeline.json"
            if not sf.exists():
                say(f"  {vdir.name:<32} (feito antes do pipeline)")
                continue
            st = json.loads(sf.read_text(encoding="utf-8"))
            et = st["etapas"]
            atual = next((e for e in stages.ETAPAS if et.get(e, {}).get("status") not in ("feito", "aprovado")), None)
            if atual is None:
                pubs = st.get("publicacoes", {})
                info = "pronto para publicar" + (f" · publicado: {', '.join(pubs)}" if pubs else "")
            else:
                info = f"{atual}: {et.get(atual, {}).get('status', 'pendente')}"
            say(f"  {vdir.name:<32} {info}" + ("  [ENSAIO]" if st.get("ensaio") else ""))
        cat = Catalogo(config.NICHES / n)
        cont = {e: len(cat.por_estado(e)) for e in ("sugerido", "em_producao", "produzido", "pronto", "publicado", "descartado")}
        say("  catálogo: " + (" · ".join(f"{k} {c}" for k, c in cont.items() if c) or "vazio"))


def cmd_publicado(a):
    v = stages.Video(resolver_video(a.video))
    if a.plataforma not in v.cfg["plataformas"]:
        raise SystemExit(f"plataforma fora da lista do nicho: {v.cfg['plataformas']}")
    v.state.setdefault("publicacoes", {})[a.plataforma] = {"url": a.url or "", "em": agora()}
    v.salvar()
    pubs = v.state["publicacoes"]
    todas = all(p in pubs for p in v.cfg["plataformas"])
    v.catalogo("publicado" if todas else "pronto", publicacoes=pubs)
    say(f"{v.state['id']}: publicado em {', '.join(pubs)}" + ("" if todas else f" (faltam: {', '.join(p for p in v.cfg['plataformas'] if p not in pubs)})"))


# ---- ambiente ---------------------------------------------------------------------------------
def cmd_doctor(a):
    ok = lambda b: "✔" if b else "✗"
    say("Chaves no .env:")
    for k in ("GEMINI_API_KEY", "ELEVENLABS_API_KEY", "ANTHROPIC_API_KEY"):
        say(f"  {ok(bool(os.environ.get(k)))} {k}" + ("" if os.environ.get(k) or k != "ANTHROPIC_API_KEY" else "  (opcional)"))
    nb = config.node_bin()
    say("Ferramentas:")
    say(f"  {ok(nb)} Node {nb.parent.name if nb else '22 não encontrado (nvm install 22)'}")
    for exe in ("ffmpeg", "ffprobe", "claude", "agy"):
        say(f"  {ok(shutil.which(exe))} {exe}")
    try:
        import faster_whisper  # noqa: F401
        say("  ✔ faster-whisper")
    except ImportError:
        say("  ✗ faster-whisper (rode com ./pipeline, que usa tools/.venv)")
    for n in sorted(p.name for p in config.NICHES.iterdir() if (p / "template").is_dir()):
        cfg = config.load_niche(n)
        say(f"Nicho {n}:")
        say(f"  {ok(cfg['voz']['voice_id'])} voz.voice_id" + ("" if cfg["voz"]["voice_id"] else "  → ./pipeline vozes, e preencha niches/%s/niche.json" % n))
        for p in ("temas", "roteiro", "tts", "metadados", "hyperframes"):
            say(f"  {ok((cfg['_dir'] / 'prompts' / f'{p}.md').exists())} prompts/{p}.md")
        prov = cfg["llm"]["provedor"]
        say(f"  · texto: {prov}")
        if prov == "antigravity" and shutil.which("agy"):
            r = subprocess.run(["agy", "models"], capture_output=True, text=True, timeout=120)
            nomes = {l.split("\t")[0].strip() for l in r.stdout.splitlines() if "\t" in l}
            for k in ("modelo_criativo", "modelo_rapido"):
                say(f"  {ok(cfg['llm'][k] in nomes)} {k}: {cfg['llm'][k]}" + ("" if cfg["llm"][k] in nomes else "  → veja: agy models"))
        # Os embeddings (temas repetidos) usam a API do Gemini com qualquer provedor de texto.
        if os.environ.get("GEMINI_API_KEY"):
            try:
                from google import genai
                cliente = genai.Client(api_key=os.environ["GEMINI_API_KEY"])  # manter a referência: a listagem pagina
                nomes = {m.name.split("/")[-1] for m in cliente.models.list()}
                for k in (("modelo_criativo", "modelo_rapido") if prov == "gemini" else ()) + ("modelo_embeddings",):
                    say(f"  {ok(cfg['llm'][k] in nomes)} {k}: {cfg['llm'][k]}")
            except Exception as e:
                say(f"  ✗ Gemini: {str(e)[:150]}")


def cmd_vozes(a):
    for vid, nome, cat, lang in tts.listar_vozes():
        say(f"  {vid}  {nome:<28} {cat:<12} {lang}")


def main():
    config.load_env()
    ap = argparse.ArgumentParser(prog="./pipeline", description=__doc__.splitlines()[0])
    sp = ap.add_subparsers(dest="cmd", required=True)

    p = sp.add_parser("temas", help="sugere temas novos para um nicho (ou lista o catálogo)")
    p.add_argument("nicho")
    p.add_argument("-n", type=int, default=10, help="quantos temas pedir (padrão 10)")
    p.add_argument("--ajustes", help="orientação extra para a IA (ex.: 'só casos anteriores a 2000')")
    p.add_argument("--listar", action="store_true", help="só lista os sugeridos do catálogo")
    p.add_argument("--todos", action="store_true", help="com --listar: todos os estados")
    p.add_argument("--ensaio", action="store_true", help="usa respostas de exemplo, sem chamar APIs")
    p.set_defaults(fn=cmd_temas)

    p = sp.add_parser("descartar", help="descarta temas do catálogo (não voltam a ser sugeridos)")
    p.add_argument("nicho")
    p.add_argument("ids", nargs="+")
    p.set_defaults(fn=cmd_descartar)

    p = sp.add_parser("novo", help="cria um vídeo a partir de um tema e roda o pipeline")
    p.add_argument("nicho")
    p.add_argument("id", nargs="?", help="ID do tema no catálogo (ex.: T004); sem ID, você escolhe da lista")
    p.add_argument("--tema", help="tema livre, sem passar pelo catálogo de sugestões")
    p.add_argument("--auto", action="store_true", help="sem paradas para aprovação")
    p.add_argument("--ate", choices=stages.ETAPAS, help="para depois desta etapa")
    p.add_argument("--ensaio", action="store_true", help="usa respostas e voz de exemplo, sem chamar APIs pagas")
    p.set_defaults(fn=cmd_novo)

    p = sp.add_parser("rodar", help="continua (ou refaz) o pipeline de um vídeo")
    p.add_argument("video", help="pasta do vídeo ou atalho <nicho>/<NNN>")
    p.add_argument("--auto", action="store_true")
    p.add_argument("--aprovar", action="store_true", help="aprova a etapa que está aguardando e segue")
    p.add_argument("--refazer", choices=stages.ETAPAS, help="refaz desta etapa em diante")
    p.add_argument("--ate", choices=stages.ETAPAS)
    p.set_defaults(fn=cmd_rodar)

    p = sp.add_parser("status", help="situação dos vídeos e do catálogo")
    p.add_argument("nicho", nargs="?")
    p.set_defaults(fn=cmd_status)

    p = sp.add_parser("publicado", help="registra a publicação de um vídeo numa plataforma")
    p.add_argument("video")
    p.add_argument("plataforma")
    p.add_argument("url", nargs="?")
    p.set_defaults(fn=cmd_publicado)

    sp.add_parser("doctor", help="confere chaves, ferramentas e configuração").set_defaults(fn=cmd_doctor)
    sp.add_parser("vozes", help="lista as vozes da sua conta ElevenLabs").set_defaults(fn=cmd_vozes)

    a = ap.parse_args()
    try:
        a.fn(a)
    except KeyboardInterrupt:
        say("\ninterrompido; retome com ./pipeline rodar <vídeo>")
        sys.exit(130)
    except LLMError as e:
        say(f"\nerro da IA: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
