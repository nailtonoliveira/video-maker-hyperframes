"""Liga o roteiro (texto) ao áudio (voice.json): início de cada cena, tempo de cada âncora e correções de legenda."""
import difflib, re, unicodedata

from num2words import num2words


def _fold(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def norm_tokens(text):
    """Texto → tokens comparáveis: minúsculas, sem acento/pontuação, números por extenso ("370" → trezentos e setenta)."""
    out = []
    for raw in re.findall(r"[\w$%]+(?:[.,]\d+)*", text):
        t = raw.replace("$", "")
        if re.fullmatch(r"\d+([.,]\d+)?", t):
            try:
                t = num2words(float(t.replace(",", ".")) if re.search(r"[.,]", t) else int(t), lang="pt_BR")
            except (OverflowError, ValueError):
                pass
        out.extend(w for w in re.findall(r"\w+", _fold(t)) if w)
    return out


def words_from_voice(voice):
    """Palavras do voice.json com tokens normalizados e o índice de cada token → palavra."""
    words = []
    for seg in voice["segmentos"]:
        for w in seg["palavras"]:
            words.append({"text": w["palavra"].strip(), "start": w["inicio"], "end": w["fim"]})
    toks, owner = [], []
    for i, w in enumerate(words):
        for t in norm_tokens(w["text"]):
            toks.append(t)
            owner.append(i)
    return words, toks, owner


def find_phrase(toks, phrase, start=0, min_ratio=0.6):
    """Melhor janela de `toks` (a partir de `start`) parecida com `phrase`. → (i, j, ratio) ou None."""
    target = norm_tokens(phrase)
    if not target:
        return None
    n = len(target)
    best = None
    for size in {max(1, n - 1), n, n + 1}:
        for i in range(start, max(start, len(toks) - size) + 1):
            r = difflib.SequenceMatcher(None, toks[i:i + size], target).ratio()
            if r > (best[2] if best else 0):
                best = (i, i + size, r)
            if r == 1.0:
                return best
    return best if best and best[2] >= min_ratio else None


def scene_timeline(roteiro, voice, duracao):
    """Para cada cena: início/fim no áudio e o tempo de cada âncora (None quando não encontrada)."""
    words, toks, owner = words_from_voice(voice)
    cenas, pos = [], 0
    for c in roteiro["cenas"]:
        head = " ".join(c["locucao"].split()[:5])
        m = find_phrase(toks, head, pos)
        start = words[owner[m[0]]]["start"] if m else None
        if m:
            pos = m[0]
        cenas.append({"n": c["n"], "nome": c.get("nome", ""), "inicio": start, "_pos": m[0] if m else pos, "ancoras": []})
    if cenas and cenas[0]["inicio"] is not None:
        cenas[0]["inicio"] = 0.0
    for k, c in enumerate(cenas):
        nxt = next((x["inicio"] for x in cenas[k + 1:] if x["inicio"] is not None), duracao)
        c["fim"] = nxt
        apos = c["_pos"]
        for a in roteiro["cenas"][k].get("ancoras", []):
            m = find_phrase(toks, a["gatilho"], apos)
            t = words[owner[m[0]]]["start"] if m else None
            if m:
                apos = m[0]
            c["ancoras"].append({"gatilho": a["gatilho"], "visual": a["visual"], "t": t})
        del c["_pos"]
    return cenas


def caption_fixes(roteiro, voice):
    """Correções por índice de palavra (transcrição → texto do roteiro) quando as duas palavras se alinham 1:1.

    Pega erros do Whisper ("Ao" → "Aos") e maiúsculas/acentos ("agência" → "Agência"), sem tocar em números.
    """
    words, _, _ = words_from_voice(voice)
    ref = [w for c in roteiro["cenas"] for w in c["locucao"].split()]
    clean = lambda s: s.strip(".,;:!?…\"“”'()").strip()
    a = [_fold(clean(w["text"])) for w in words]
    b = [_fold(clean(w)) for w in ref]
    fixes = {}
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op not in ("equal", "replace") or (i2 - i1) != (j2 - j1):
            continue
        for i, j in zip(range(i1, i2), range(j1, j2)):
            got, want = clean(words[i]["text"]), clean(ref[j])
            if not got or not want or got == want or got.endswith("..."):
                continue
            if re.search(r"\d", got + want):
                continue
            if op == "equal" or difflib.SequenceMatcher(None, a[i], b[j]).ratio() >= 0.6:
                fixes[str(i)] = want
    return fixes
