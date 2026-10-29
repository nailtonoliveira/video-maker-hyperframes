"""Normalização de volume do MP4 renderizado (ffmpeg loudnorm, 2 passadas). Só stdlib + ffmpeg."""
import json, os, re, subprocess
from pathlib import Path

TP, LRA = -1.5, 11


def _rodar(cmd):
    try:
        return subprocess.run(cmd, capture_output=True, text=True, check=True)
    except (OSError, subprocess.CalledProcessError) as e:
        fim = (getattr(e, "stderr", None) or str(e))[-600:]
        raise RuntimeError(f"ffmpeg falhou: {fim}") from e


def _medir(mp4, filtro, ffmpeg_bin):
    r = _rodar([ffmpeg_bin, "-hide_banner", "-nostats", "-i", str(mp4), "-vn", "-af", filtro, "-f", "null", "-"])
    blocos = re.findall(r"\{[^{}]*\}", r.stderr)
    if not blocos:
        raise RuntimeError("ffmpeg falhou: loudnorm não devolveu medição: " + r.stderr[-600:])
    return json.loads(blocos[-1])


def medir_lufs(mp4: Path, ffmpeg_bin: str = "ffmpeg") -> float:
    """Loudness integrado (LUFS) do áudio do arquivo."""
    return float(_medir(mp4, "loudnorm=print_format=json", ffmpeg_bin)["input_i"])


def normalizar(mp4: Path, lufs: float, ffmpeg_bin: str = "ffmpeg") -> tuple[float, float]:
    """Normaliza o áudio para `lufs` (loudnorm 2 passadas), copiando o vídeo. Devolve (antes, depois).
    Escreve num temporário ao lado e troca com os.replace; se falhar, o original fica intacto."""
    mp4 = Path(mp4)
    alvo = f"loudnorm=I={lufs}:TP={TP}:LRA={LRA}"
    m = _medir(mp4, alvo + ":print_format=json", ffmpeg_bin)
    antes = float(m["input_i"])
    filtro = (f"{alvo}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
              f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    tmp = mp4.with_name(mp4.stem + ".norm.tmp" + mp4.suffix)
    try:
        _rodar([ffmpeg_bin, "-hide_banner", "-y", "-i", str(mp4), "-map", "0:v", "-map", "0:a",
                "-c:v", "copy", "-af", filtro, "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
                "-movflags", "+faststart", str(tmp)])
        depois = medir_lufs(tmp, ffmpeg_bin)
        os.replace(tmp, mp4)
    finally:
        tmp.unlink(missing_ok=True)
    return antes, depois
