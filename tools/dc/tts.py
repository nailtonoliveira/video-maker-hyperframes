"""Narração: ElevenLabs (API REST). No modo ensaio copia a voz do vídeo 001."""
import json, os, shutil, urllib.error, urllib.request

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
    audio = _request(f"{API}/text-to-speech/{voz['voice_id']}?output_format={voz['output_format']}", body)
    destino.write_bytes(audio)


def listar_vozes():
    data = json.loads(_request(f"{API}/voices"))
    return [(v["voice_id"], v["name"], v.get("category", ""), (v.get("labels") or {}).get("language", ""))
            for v in data.get("voices", [])]
