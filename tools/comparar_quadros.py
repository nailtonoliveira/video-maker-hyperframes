#!/usr/bin/env python3
"""Compara quadros PNG de dois diretórios por SSIM (usa o ffmpeg).

Uso:
    python3 tools/comparar_quadros.py <dir_ref> <dir_novo> [--min 0.995]

Para cada PNG do diretório de referência, compara com o PNG de mesmo nome no
diretório novo e imprime `<arquivo> SSIM=<x>`. Sai com código 1 se algum quadro
ficar abaixo do mínimo, estiver faltando em um dos lados, ou não puder ser
medido (ex.: tamanhos diferentes).
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path


def ssim(a: Path, b: Path):
    """Devolve o SSIM geral (All:) entre duas imagens, ou None se falhar."""
    r = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(a), "-i", str(b),
         "-lavfi", "ssim", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    m = re.search(r"All:([0-9.]+)", r.stderr)
    return float(m.group(1)) if r.returncode == 0 and m else None


def main() -> int:
    ap = argparse.ArgumentParser(description="SSIM entre quadros de referência")
    ap.add_argument("ref", type=Path, help="diretório de referência")
    ap.add_argument("novo", type=Path, help="diretório com os quadros novos")
    ap.add_argument("--min", type=float, default=0.995, dest="minimo",
                    help="SSIM mínimo aceito (padrão 0.995)")
    args = ap.parse_args()

    nomes = sorted({p.name for d in (args.ref, args.novo) for p in d.glob("*.png")})
    if not nomes:
        print("nenhum PNG encontrado", file=sys.stderr)
        return 1

    falhou = False
    for nome in nomes:
        a, b = args.ref / nome, args.novo / nome
        if not a.exists() or not b.exists():
            lado = "referência" if not a.exists() else "novo"
            print(f"{nome} FALTA no diretório {lado}")
            falhou = True
            continue
        s = ssim(a, b)
        if s is None:
            print(f"{nome} ERRO ao medir SSIM")
            falhou = True
            continue
        print(f"{nome} SSIM={s:.6f}")
        if s < args.minimo:
            falhou = True
    return 1 if falhou else 0


if __name__ == "__main__":
    sys.exit(main())
