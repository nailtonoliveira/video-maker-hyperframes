"""Recalcula os números do episódio 002 a partir do IPCA mensal do IBGE (via Banco Central, SGS 433, dados/ipca.json).
A nota é guardada no início de jan/2010 e medida no fim de dez/2025 (192 meses de IPCA)."""
import json, pathlib
ipca = json.loads((pathlib.Path(__file__).parent / "ipca.json").read_text())
assert ipca[0]["data"] == "01/01/2010" and ipca[-1]["data"] == "01/12/2025" and len(ipca) == 192

def fator(meses):
    f = 1.0
    for x in meses:
        f *= 1 + float(x["valor"]) / 100
    return f

F = fator(ipca)

def ano(a):
    return fator([x for x in ipca if x["data"].endswith(str(a))])

if __name__ == "__main__":
    print(f"IPCA acumulado jan/2010–dez/2025: +{(F - 1) * 100:.1f}%  (fator {F:.4f})")
    print(f"O que custava R$ 100 em jan/2010 custa R$ {100 * F:.2f} em dez/2025")
    print(f"Poder de compra da nota de R$ 100: R$ {100 / F:.2f} em dinheiro de jan/2010")
    for a in range(2010, 2026):
        print(f"  {a}: IPCA {(ano(a) - 1) * 100:+.2f}%   nota vale R$ {100 / fator([x for x in ipca if int(x['data'][-4:]) <= a]):.2f}")
    neg = [x["data"][3:] for x in ipca if float(x["valor"]) < 0]
    print(f"Meses com deflação: {len(neg)} de 192: {', '.join(neg)}")
    vals = [float(x["valor"]) for x in ipca]
    print(f"Mês médio: {sum(vals) / len(vals):.2f}%  · maior: {max(vals):.2f}%  · menor: {min(vals):.2f}%")
