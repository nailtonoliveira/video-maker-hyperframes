"""Cria um vídeo novo de um nicho: copia niches/<nicho>/template/ e shared/sfx/ para niches/<nicho>/videos/<NNN-slug>/.

Uso:  python3 tools/new_video.py tech-lore therac25
      → niches/tech-lore/videos/002-therac25/  (número = maior existente + 1)
"""
import argparse, datetime, json, pathlib, re, shutil, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from motor import instalar_do_nicho

ROOT = pathlib.Path(__file__).resolve().parent.parent

ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
ap.add_argument("nicho", help="pasta em niches/ (ex.: tech-lore)")
ap.add_argument("slug", help="nome curto do episódio, minúsculas e hífens (ex.: therac25)")
args = ap.parse_args()

if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", args.slug):
    sys.exit(f"slug inválido: {args.slug!r} (use minúsculas, números e hífens)")

niche = ROOT / "niches" / args.nicho
template = niche / "template"
if not template.is_dir():
    sys.exit(f"nicho sem template: {template.relative_to(ROOT)}  (crie com tools/new_niche.py)")

videos = niche / "videos"
videos.mkdir(exist_ok=True)
nums = [int(m.group(1)) for p in videos.iterdir() if (m := re.match(r"(\d{3})-", p.name))]
num = f"{max(nums, default=0) + 1:03d}"
if any(p.name.endswith("-" + args.slug) for p in videos.iterdir()):
    sys.exit(f"já existe um vídeo '{args.slug}' em {videos.relative_to(ROOT)}")

dest = videos / f"{num}-{args.slug}"
shutil.copytree(template, dest)
# SFX copiados (não referenciados): o HyperFrames só serve arquivos de dentro do projeto, e o vídeo fica congelado.
shutil.copytree(ROOT / "shared" / "sfx", dest / "assets" / "sfx", dirs_exist_ok=True)

vid = f"{args.nicho}-{num}-{args.slug}"
(dest / "meta.json").write_text(json.dumps({
    "id": vid,
    "name": vid,
    "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"),
}, indent=2) + "\n", encoding="utf-8")
pkg = json.loads((dest / "package.json").read_text(encoding="utf-8"))
pkg["name"] = vid
(dest / "package.json").write_text(json.dumps(pkg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

rel = dest.relative_to(ROOT)
print(f"Criado: {rel}")
if versao := instalar_do_nicho(dest, args.nicho):
    print(f"motor {json.loads((dest / 'meta.json').read_text(encoding='utf-8'))['motor']['tipo']} {versao}")
print(f"""
Próximos passos (a partir da raiz dark-channels/):
  1. Escreva o roteiro em {rel}/roteiro.md e gere a locução em {rel}/assets/voice.mp3
  2. tools/.venv/bin/python tools/transcribe.py {rel}/assets/voice.mp3
  3. python3 tools/set_duration.py {rel}
  4. Corrija erros da transcrição em {rel}/captions.json e rode:
     python3 tools/build_captions.py {rel}""")
if versao:
    print(f"""  5. SPEC.md, cena 3D em {rel}/assets/episode/scene.js (LOOP = duração da voz) e títulos em
     {rel}/compositions/world.html (DUR igual); trilha em assets/episode/trilha.json
  6. Antes do render: tools/.venv/bin/python shared/trilha/trilha.py {rel}
  7. Dentro da pasta: npm run check · npx hyperframes snapshot --describe false · npm run render""")
else:
    print("  5. SPEC.md, cenas em compositions/, depois dentro da pasta: npm run check · npx hyperframes snapshot · npm run render")
