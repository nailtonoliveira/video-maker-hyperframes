"""Cria um nicho novo copiando o template e o NICHE.md de um nicho existente (padrão: tech-lore).

Uso:  python3 tools/new_niche.py historia-sombria
      python3 tools/new_niche.py misterios --from tech-lore
Depois: reescreva niches/<nicho>/NICHE.md, escolha a voz em niche.json e adapte template/ e prompts/.
"""
import argparse, json, pathlib, re, shutil, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
ap.add_argument("nicho", help="nome da pasta do nicho novo (minúsculas e hífens)")
ap.add_argument("--from", dest="base", default="tech-lore", help="nicho de partida (padrão: tech-lore)")
args = ap.parse_args()

if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", args.nicho):
    sys.exit(f"nome inválido: {args.nicho!r} (use minúsculas, números e hífens)")

base = ROOT / "niches" / args.base
dest = ROOT / "niches" / args.nicho
if dest.exists():
    sys.exit(f"já existe: {dest.relative_to(ROOT)}")
if not (base / "template").is_dir():
    sys.exit(f"nicho de partida sem template: {base.relative_to(ROOT)}")

shutil.copytree(base / "template", dest / "template")
kit3d_shared = ROOT / "shared" / "kit3d"
if kit3d_shared.is_dir() and (dest / "template" / "assets" / "kit3d.js").exists():
    shutil.copytree(kit3d_shared, dest / "template" / "assets", dirs_exist_ok=True)
(dest / "videos").mkdir()
# Prompts e configuração do pipeline: começam iguais aos do nicho de partida; a voz fica vazia para ser escolhida.
if (base / "prompts").is_dir():
    shutil.copytree(base / "prompts", dest / "prompts")
if (base / "niche.json").exists():
    cfg = json.loads((base / "niche.json").read_text(encoding="utf-8"))
    cfg["nome"] = args.nicho
    cfg.setdefault("voz", {})["voice_id"] = ""
    (dest / "niche.json").write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(dest / "NICHE.md").write_text(f"""# Nicho: {args.nicho}

Criado a partir de `{args.base}` (veja niches/{args.base}/NICHE.md como referência). Preencha:

## Formato
- Plataforma, proporção, duração, número de cenas, loop ou não, legenda.

## Roteiro
- Tom, estrutura do gancho, como fecha.

## Visual
- Fundo, paleta (com o papel de cada cor), fonte, tamanhos, área útil, movimento, proibições.
  Aplique em template/index.html (:root e data-composition-variables), template/compositions/bg.html
  e template/captions.json (cores e posição da legenda).

## Som
- Voz da série, SFX, música.

## Episódios
| Nº | Pasta | Tema | Estado |
| --- | --- | --- | --- |
""", encoding="utf-8")

pkg = dest / "template" / "package.json"
pkg.write_text(pkg.read_text(encoding="utf-8").replace(f'"{args.base}-video"', f'"{args.nicho}-video"'), encoding="utf-8")

print(f"Criado: {dest.relative_to(ROOT)}  (template copiado de {args.base})")
print(f"Primeiro vídeo: python3 tools/new_video.py {args.nicho} <slug>")
