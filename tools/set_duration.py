"""Ajusta a duração do vídeo à locução: data-duration da raiz e de quem cobre o vídeo inteiro, e DUR do bg.html.

Uso:  python3 tools/set_duration.py niches/<nicho>/videos/<NNN-slug>          # lê assets/voice.json
      python3 tools/set_duration.py niches/<nicho>/videos/<NNN-slug> 47.5     # valor explícito
"""
import argparse, json, math, pathlib, re, sys

ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
ap.add_argument("video", help="pasta do vídeo (projeto HyperFrames)")
ap.add_argument("segundos", nargs="?", type=float, help="padrão: duração de assets/voice.json, arredondada para cima")
args = ap.parse_args()
VIDEO = pathlib.Path(args.video).resolve()

if args.segundos is None:
    voice = VIDEO / "assets" / "voice.json"
    if not voice.exists():
        sys.exit("sem assets/voice.json: rode tools/transcribe.py antes ou passe os segundos")
    new = math.ceil(json.loads(voice.read_text(encoding="utf-8"))["duracao"] * 100) / 100
else:
    new = round(args.segundos, 2)
new_s = f"{new:g}"

index_file = VIDEO / "index.html"
index = index_file.read_text(encoding="utf-8")
m = re.search(r'data-composition-id="main"[^>]*?data-duration="([\d.]+)"', index, re.S)
if not m:
    sys.exit("index.html: composição raiz 'main' sem data-duration")
old_s = m.group(1)

# Tudo que começa em 0 e dura o vídeo inteiro (raiz, bg, captions...) acompanha a raiz.
pat = re.compile(r'(data-start="0"\s+data-duration=")' + re.escape(old_s) + '"')
index, n = pat.subn(lambda mm: mm.group(1) + new_s + '"', index)
index_file.write_text(index, encoding="utf-8")
print(f"index.html: {old_s} → {new_s} s ({n} elementos)")

bg_file = VIDEO / "compositions" / "bg.html"
if bg_file.exists():
    bg, k = re.subn(r"const DUR = [\d.]+;", f"const DUR = {new_s};", bg_file.read_text(encoding="utf-8"))
    bg_file.write_text(bg, encoding="utf-8")
    print(f"bg.html: DUR = {new_s}" if k else "bg.html: sem 'const DUR', ajuste a grade à mão")

print("Confira se a última cena termina em", new_s, "s (data-start + data-duration).")
