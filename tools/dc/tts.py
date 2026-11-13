"""Narração: ElevenLabs (API REST). No modo ensaio copia a voz do vídeo 001."""
import json, os, re, shutil, subprocess, urllib.error, urllib.request

from . import config

API = "https://api.elevenlabs.io/v1"
ENSAIO_VOZ = config.NICHES / "tech-lore" / "videos" / "001-ariane5" / "assets" / "voice.mp3"


def _key():
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        raise SystemExit("ELEVENLABS_API_KEY vazia no .env")
    return key


def _request(url, body=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"xi-api-key": _key(), "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        raise SystemExit(f"ElevenLabs {e.code}: {e.read().decode(errors='replace')[:400]}")


def gerar(texto, voz, destino, ensaio=False):
    if ensaio:
        shutil.copyfile(ENSAIO_VOZ, destino)
        return
    if voz["motor"] != "elevenlabs":
        raise SystemExit(f"motor de voz não suportado na v1: {voz['motor']}")
    if not voz.get("voice_id"):
        raise SystemExit("voice_id vazio no niche.json → \"voz\". Liste as vozes com: ./pipeline vozes")
    body = {
        "text": texto,
        "model_id": voz["model_id"],
        "voice_settings": {k: voz[k] for k in ("stability", "similarity_boost", "style", "speed", "use_speaker_boost")},
    }
    if voz.get("seed") is not None:
        body["seed"] = voz["seed"]  # mesma semente = entonação mais parecida entre episódios
    audio = _request(f"{API}/text-to-speech/{voz['voice_id']}?output_format={voz['output_format']}", body)
    destino.write_bytes(audio)
    acelerar(destino, voz.get("acelerar") or 1.0)


def acelerar(arquivo, fator):
    """Acelera a narração sem mudar o tom (ffmpeg atempo). O `speed` da API só vai até 1.2; isto vale para qualquer
    modelo e roda ANTES do Whisper, então tempos e legendas já saem no ritmo final."""
    if abs(fator - 1.0) < 1e-3:
        return
    if not 0.5 <= fator <= 2.0:
        raise SystemExit(f"voz.acelerar fora de 0.5–2.0: {fator}")
    tmp = arquivo.with_name(arquivo.stem + ".tmp" + arquivo.suffix)
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(arquivo), "-af", f"atempo={fator}",
                        "-c:a", "libmp3lame", "-b:a", "128k", str(tmp)], capture_output=True, text=True)
    if r.returncode:
        tmp.unlink(missing_ok=True)
        raise SystemExit(f"ffmpeg atempo falhou: {r.stderr[-400:]}")
    os.replace(tmp, arquivo)


# ==== audio tags (Eleven v3) =======================================================================
TAG_RE = re.compile(r"\[([^\[\]]*)\]")


def _so_letras(s):
    return re.sub(r"[^a-z' ]", "", s.lower()).strip()


def aceita_tags(voz):
    return voz.get("model_id", "").startswith("eleven_v3")


def tags(texto):
    return [t.strip() for t in TAG_RE.findall(texto)]


def validar_tags(texto, voz, max_por_frase=0.5):
    """Erros de marcação no texto TTS: tags num modelo que as lê em voz alta, tags fora do padrão, excesso de tags."""
    ts = tags(texto)
    if not ts:
        return []
    if not aceita_tags(voz):
        return [f"o modelo {voz.get('model_id')} lê colchetes em voz alta; remova: {ts[:5]}"]
    erros = [f"tag inválida (use 1–4 palavras em inglês, minúsculas): [{t}]"
             for t in ts if not re.fullmatch(r"[a-z][a-z ,'-]{0,38}", t) or len(t.split()) > 4]
    frases = max(1, len(re.findall(r"[.!?…]+", TAG_RE.sub("", texto))))
    if len(ts) / frases > max_por_frase:
        erros.append(f"{len(ts)} tags para {frases} frases: no máximo 1 tag a cada {round(1 / max_por_frase)} frases")
    return erros


def tags_vazadas(texto, palavras_ditas):
    """Tags que o modelo leu em voz alta (aparecem na transcrição do Whisper)."""
    ditas = " " + " ".join(_so_letras(p) for p in palavras_ditas) + " "
    return sorted({t for t in tags(texto) if _so_letras(t) and f" {_so_letras(t)} " in ditas})


def listar_vozes():
    data = json.loads(_request(f"{API}/voices"))
    return [(v["voice_id"], v["name"], v.get("category", ""), (v.get("labels") or {}).get("language", ""))
            for v in data.get("voices", [])]
