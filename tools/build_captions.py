"""Gera <video>/compositions/captions.html a partir de <video>/assets/voice.json (timestamps por palavra).

Uso:  tools/.venv/bin/python tools/build_captions.py niches/<nicho>/videos/<NNN-slug>

A duração vem do data-duration da composição raiz (index.html). Ajustes por vídeo ficam em
<video>/captions.json (opcional): correções da transcrição e estilo da legenda. Chaves ausentes usam DEFAULTS.
"""
import argparse, json, html, pathlib, re, sys

DEFAULTS = {
    "fixes": {},          # erros de transcrição: {"Ao": "Aos"}
    "fixes_idx": {},      # correção por índice de palavra (gerada pelo pipeline): {"23": "Aos"}
    "style": "terminal",  # "terminal" (padrão) ou "label-tag" (etiquetas recortadas 3D/papel)
    "font_family": "var(--font-mono)",
    "max_words": 3,
    "max_chars": 24,
    "pause": 0.15,        # pausa (s) que quebra um grupo
    "left": 130,
    "width": 820,
    "bottom": 610,        # base da legenda a 1920 - 610 = 1310 px
    "font_size": 52,
    "active": "#00ff9d",  # palavra falada
    "ink": "#e6edf3",
    "tag_bg": "#c85a32",
    "tag_active_bg": "#ffd43b",
    "tag_active_ink": "#141414",
}

ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
ap.add_argument("video", help="pasta do vídeo (projeto HyperFrames)")
VIDEO = pathlib.Path(ap.parse_args().video).resolve()

index = (VIDEO / "index.html").read_text(encoding="utf-8")
m = re.search(r'data-composition-id="main"[^>]*?data-duration="([\d.]+)"', index, re.S)
if not m:
    sys.exit("index.html: composição raiz 'main' sem data-duration")
DURATION = float(m.group(1))

cfg = dict(DEFAULTS)
cfg_file = VIDEO / "captions.json"
if cfg_file.exists():
    cfg.update(json.loads(cfg_file.read_text(encoding="utf-8")))
FIXES, FIXES_IDX = cfg["fixes"], cfg["fixes_idx"]

data = json.loads((VIDEO / "assets" / "voice.json").read_text(encoding="utf-8"))

words = []
for seg in data["segmentos"]:
    for w in seg["palavras"]:
        raw = w["palavra"].strip()
        txt = raw if raw.endswith("...") else raw.rstrip(",.")
        txt = FIXES_IDX.get(str(len(words)), FIXES.get(txt, txt))
        words.append({"text": txt, "raw": raw, "start": w["inicio"], "end": w["fim"]})

MAX_WORDS, MAX_CHARS, PAUSE = cfg["max_words"], cfg["max_chars"], cfg["pause"]
groups, cur = [], []
for i, w in enumerate(words):
    if cur and (len(cur) >= MAX_WORDS or len(" ".join(x["text"] for x in cur + [w])) > MAX_CHARS):
        groups.append(cur); cur = []
    cur.append(w)
    nxt = words[i + 1] if i + 1 < len(words) else None
    if re.search(r"[,.]$", w["raw"]) or (nxt and nxt["start"] - w["end"] >= PAUSE):
        groups.append(cur); cur = []
if cur:
    groups.append(cur)

spans = []
for gi, g in enumerate(groups):
    if g[0]["start"] >= DURATION - 0.15:
        break
    start = max(0.15, g[0]["start"] - 0.04)
    nxt = groups[gi + 1][0]["start"] - 0.04 if gi + 1 < len(groups) else DURATION
    end = min(max(g[-1]["end"] + 0.35, g[-1]["end"]), nxt, round(DURATION - 0.02, 3))
    if end <= start:
        continue
    spans.append({"id": f"cap-{gi}", "start": round(start, 3), "end": round(end, 3), "words": g})

markup, script = [], []
for s in spans:
    ws = " ".join(f'<span class="cap-w" id="{s["id"]}-w{j}">{html.escape(w["text"])}</span>' for j, w in enumerate(s["words"]))
    markup.append(f'      <div class="cap-g" id="{s["id"]}"><span class="cap-t">{ws}</span></div>')
    script.append(
        "      G(%r, %s, %s, [%s]);" % (s["id"], s["start"], s["end"],
            ", ".join("[%s, %s]" % (w["start"], w["end"]) for w in s["words"]))
    )

if cfg["style"] == "label-tag":
    out = f"""<template>
  <style>
    #root {{
      position: absolute;
      inset: 0;
      font-family: {cfg["font_family"]};
    }}
    .cap-g {{
      position: absolute;
      left: {cfg["left"]}px;
      width: {cfg["width"]}px;
      bottom: {cfg["bottom"]}px;
      text-align: center;
      overflow: visible;
      visibility: hidden;
      opacity: 0;
    }}
    .cap-t {{
      display: inline-flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 12px;
    }}
    .cap-w {{
      display: inline-block;
      font-size: {cfg["font_size"]}px;
      font-weight: 900;
      line-height: 1.1;
      color: {cfg["ink"]};
      background: {cfg["tag_bg"]};
      padding: 10px 22px 12px;
      border-radius: 6px;
      border: 3px solid #141414;
      box-shadow: 0 6px 0 #141414, 0 10px 20px rgba(0, 0, 0, 0.45);
    }}
  </style>
  <!-- Gerado por tools/build_captions.py a partir de assets/voice.json; edite captions.json e rode de novo. -->
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
{chr(10).join(markup)}
  </div>
  <script>
    (function () {{
      const tl = gsap.timeline({{ paused: true }});
      const TAG_BG = "{cfg["tag_bg"]}", INK = "{cfg["ink"]}";
      const ACT_BG = "{cfg["tag_active_bg"]}", ACT_INK = "{cfg["tag_active_ink"]}";
      const ROTS = [-1.6, 1.3, -1.1, 1.5];
      function G(id, start, end, ws) {{
        const g = "#" + id;
        tl.set(g, {{ visibility: "visible" }}, start);
        tl.fromTo(g, {{ opacity: 0, y: 14 }}, {{ opacity: 1, y: 0, duration: 0.12, ease: "back.out(1.8)" }}, start);
        ws.forEach(([s, e], j) => {{
          const w = g + "-w" + j;
          const rot = ROTS[j % ROTS.length];
          const off = j + 1 < ws.length ? ws[j + 1][0] : end;
          const tOn = Math.max(s, start);
          const tOff = Math.min(off, end);
          tl.set(w, {{ rotation: rot, scale: 1, backgroundColor: TAG_BG, color: INK }}, start);
          tl.set(w, {{ backgroundColor: ACT_BG, color: ACT_INK }}, tOn);
          tl.fromTo(w, {{ scale: 1.14, rotation: rot * -0.8 }}, {{ scale: 1.04, rotation: rot, duration: 0.16, ease: "back.out(2)" }}, tOn);
          tl.set(w, {{ scale: 1, rotation: rot, backgroundColor: TAG_BG, color: INK }}, tOff);
        }});
        tl.to(g, {{ opacity: 0, duration: 0.08, ease: "power2.in" }}, end - 0.08);
        tl.set(g, {{ opacity: 0, visibility: "hidden" }}, end);
      }}
{chr(10).join(script)}
      window.__timelines["captions"] = tl;
    }})();
  </script>
</template>
"""
else:
    out = f"""<template>
  <style>
    #root {{
      position: absolute;
      inset: 0;
      font-family: {cfg["font_family"]};
    }}
    .cap-g {{
      position: absolute;
      left: {cfg["left"]}px;
      width: {cfg["width"]}px;
      bottom: {cfg["bottom"]}px;
      text-align: center;
      overflow: visible;
      visibility: hidden;
      opacity: 0;
    }}
    .cap-t {{
      font-size: {cfg["font_size"]}px;
      font-weight: 700;
      line-height: 1.32;
      color: var(--ink);
      background: rgba(8, 10, 15, 0.82);
      padding: 4px 16px;
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
    }}
  </style>
  <!-- Gerado por tools/build_captions.py a partir de assets/voice.json; edite captions.json e rode de novo. -->
  <div id="root" data-composition-id="captions" data-width="1080" data-height="1920">
{chr(10).join(markup)}
  </div>
  <script>
    (function () {{
      const tl = gsap.timeline({{ paused: true }});
      const MINT = "{cfg["active"]}", INK = "{cfg["ink"]}";
      // Um grupo por vez: abre no início da 1ª palavra, palavra ativa em destaque, kill duro no fim.
      function G(id, start, end, ws) {{
        const g = "#" + id;
        tl.set(g, {{ visibility: "visible" }}, start);
        tl.fromTo(g, {{ opacity: 0, filter: "blur(6px)" }}, {{ opacity: 1, filter: "blur(0px)", duration: 0.1, ease: "power2.out" }}, start);
        ws.forEach(([s, e], j) => {{
          const w = g + "-w" + j;
          const off = j + 1 < ws.length ? ws[j + 1][0] : end;
          tl.set(w, {{ color: MINT }}, Math.max(s, start));
          tl.set(w, {{ color: INK }}, Math.min(off, end));
        }});
        tl.to(g, {{ opacity: 0, duration: 0.1, ease: "power2.in" }}, end - 0.1);
        tl.set(g, {{ opacity: 0, visibility: "hidden" }}, end);
      }}
{chr(10).join(script)}
      window.__timelines["captions"] = tl;
    }})();
  </script>
</template>
"""
(VIDEO / "compositions" / "captions.html").write_text(out, encoding="utf-8")
print(len(spans), "grupos ·", f"duração {DURATION}s")
for s in spans:
    print(f'{s["start"]:6.2f}-{s["end"]:6.2f}  ' + " ".join(w["text"] for w in s["words"]))
