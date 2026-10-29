"""Instala o motor compartilhado (shared/motor-<tipo>/) e o tema do nicho (assets/tema.js) numa pasta de vídeo.

Uso:  python3 tools/motor.py niches/tech-lore/lab/kit-3d --nicho tech-lore [--motor 3d]
      → <vídeo>/assets/motor/ (cópia limpa do motor), <vídeo>/assets/tema.js (de niches/<nicho>/tema.json)
        e "motor": {"tipo", "versao"} no meta.json do vídeo, se existir.
"""
import argparse, json, pathlib, re, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

PAPEIS = ("chao", "tinta", "secundaria", "ok", "alerta", "destaque", "ardosia", "morto")
IGNORAR = ("tests", "package.json", "node_modules")


def gerar_tema_js(tema: dict, origem: str) -> str:
    """Valida o tema e devolve o texto de tema.js. Levanta ValueError nomeando a chave com problema."""
    cores = tema.get("cores")
    if not isinstance(cores, dict):
        raise ValueError('tema.json: falta o bloco "cores"')
    for papel in PAPEIS:
        if papel not in cores:
            raise ValueError(f'tema.json: falta a cor "{papel}"')
        valor = cores[papel]
        if not isinstance(valor, str) or not re.fullmatch(r"#[0-9a-fA-F]{6}", valor):
            raise ValueError(f'tema.json: cor "{papel}" inválida: "{valor}" (use #rrggbb)')
    corpo = json.dumps(tema, indent=2, ensure_ascii=False)
    return f"// gerado por tools/motor.py a partir de {origem} — não edite\nexport const TEMA = {corpo};\n"


def instalar_motor(video: pathlib.Path, nicho: str, motor: str = "3d", *, raiz: pathlib.Path = ROOT) -> str:
    """Copia shared/motor-<motor>/ para <video>/assets/motor/ (apagando a cópia anterior), gera assets/tema.js
    e registra a versão no meta.json. Devolve a versão."""
    video = pathlib.Path(video)
    origem = raiz / "shared" / f"motor-{motor}"
    if not origem.is_dir():
        raise FileNotFoundError(f"motor inexistente: {origem}")
    arq_tema = raiz / "niches" / nicho / "tema.json"
    if not arq_tema.is_file():
        raise FileNotFoundError(f"nicho sem tema: {arq_tema}")
    versao = (origem / "VERSION").read_text(encoding="utf-8").strip()
    tema_js = gerar_tema_js(json.loads(arq_tema.read_text(encoding="utf-8")), arq_tema.relative_to(raiz).as_posix())

    destino = video / "assets" / "motor"
    if destino.exists():
        shutil.rmtree(destino)
    shutil.copytree(origem, destino, ignore=shutil.ignore_patterns(*IGNORAR))
    (video / "assets" / "tema.js").write_text(tema_js, encoding="utf-8")

    meta = video / "meta.json"
    if meta.is_file():
        dados = json.loads(meta.read_text(encoding="utf-8"))
        dados["motor"] = {"tipo": motor, "versao": versao}
        meta.write_text(json.dumps(dados, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return versao


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("video", help="pasta do vídeo (ex.: niches/tech-lore/videos/001-slug)")
    ap.add_argument("--nicho", required=True, help="pasta em niches/ com o tema.json (ex.: tech-lore)")
    ap.add_argument("--motor", default="3d", help="motor em shared/motor-<nome>/ (padrão: 3d)")
    args = ap.parse_args()
    pasta = pathlib.Path(args.video).resolve()
    if not pasta.is_dir():
        sys.exit(f"pasta de vídeo inexistente: {args.video}")
    try:
        versao = instalar_motor(pasta, args.nicho, args.motor)
    except (ValueError, FileNotFoundError) as e:
        sys.exit(str(e))
    try:
        rel = pasta.relative_to(ROOT)
    except ValueError:
        rel = pasta
    print(f"motor {args.motor} {versao} instalado em {rel}/assets/motor")
