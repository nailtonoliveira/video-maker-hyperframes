"""Transcreve a locução com faster-whisper e grava <nome>.json (timestamps por palavra) e <nome>.srt ao lado do áudio.

Uso:  tools/.venv/bin/python tools/transcribe.py niches/<nicho>/videos/<NNN-slug>/assets/voice.mp3
"""
import argparse
import json
import subprocess
import numpy as np
from pathlib import Path
from faster_whisper import WhisperModel

def carregar_audio(caminho_arquivo, sr=16000):
    cmd = [
        "ffmpeg", "-nostdin", "-threads", "0",
        "-i", str(caminho_arquivo),
        "-f", "s16le", "-ac", "1", "-ar", str(sr), "-"
    ]
    processo = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, check=True)
    return np.frombuffer(processo.stdout, np.int16).flatten().astype(np.float32) / 32768.0

def segundos_para_srt(segundos: float) -> str:
    """Converte segundos para o formato padrão SRT: HH:MM:SS,mmm"""
    horas = int(segundos // 3600)
    minutos = int((segundos % 3600) // 60)
    segs = int(segundos % 60)
    milissegs = int(round((segundos - int(segundos)) * 1000))
    return f"{horas:02d}:{minutos:02d}:{segs:02d},{milissegs:03d}"

def salvar_arquivos(caminho_origem: Path, segmentos, info):
    dados_exportacao = {
        "idioma": info.language,
        "probabilidade": info.language_probability,
        "duracao": info.duration,
        "segmentos": []
    }

    linhas_srt = []

    for i, seg in enumerate(segmentos, start=1):
        # 1. Estrutura para JSON
        item_segmento = {
            "id": i,
            "inicio": round(seg.start, 3),
            "fim": round(seg.end, 3),
            "texto": seg.text.strip(),
            "palavras": [
                {
                    "palavra": w.word.strip(),
                    "inicio": round(w.start, 3),
                    "fim": round(w.end, 3),
                    "probabilidade": round(w.probability, 3)
                }
                for w in (seg.words or [])
            ]
        }
        dados_exportacao["segmentos"].append(item_segmento)

        # 2. Estrutura para SRT
        inicio_srt = segundos_para_srt(seg.start)
        fim_srt = segundos_para_srt(seg.end)
        linhas_srt.append(f"{i}\n{inicio_srt} --> {fim_srt}\n{seg.text.strip()}\n")

    # Salva ao lado do áudio, nunca no diretório atual
    arquivo_json = caminho_origem.with_suffix(".json")
    with open(arquivo_json, "w", encoding="utf-8") as f:
        json.dump(dados_exportacao, f, ensure_ascii=False, indent=2)
    print(f"Salvo: {arquivo_json}")

    arquivo_srt = caminho_origem.with_suffix(".srt")
    with open(arquivo_srt, "w", encoding="utf-8") as f:
        f.write("\n".join(linhas_srt))
    print(f"Salvo: {arquivo_srt}")
    print(f"Duração: {info.duration:.2f} s  (use como data-duration no index.html)")

def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("audio", help="arquivo de áudio (ex.: .../assets/voice.mp3)")
    ap.add_argument("--modelo", default="base", help="modelo whisper (tiny, base, small, medium...)")
    ap.add_argument("--idioma", default="pt")
    args = ap.parse_args()

    arquivo_audio = Path(args.audio).resolve()
    model = WhisperModel(args.modelo, device="cpu", compute_type="int8")
    audio_data = carregar_audio(arquivo_audio)

    print(f"Processando {arquivo_audio}...")
    segments_generator, info = model.transcribe(audio_data, word_timestamps=True, language=args.idioma)

    # Converte o gerador em lista para podermos iterar e salvar
    segmentos = list(segments_generator)

    salvar_arquivos(arquivo_audio, segmentos, info)

if __name__ == "__main__":
    main()
