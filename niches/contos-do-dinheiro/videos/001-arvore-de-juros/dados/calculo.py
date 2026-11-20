"""Recalcula os números do episódio a partir do CDI mensal do Banco Central (SGS 4391, dados/cdi.json).
Aporte de R$ 200 no início de cada mês; IR pela tabela regressiva por aporte, contado até dez/2025."""
import json, pathlib
cdi = [float(x["valor"]) / 100 for x in json.loads((pathlib.Path(__file__).parent / "cdi.json").read_text())]

def liquido(m0, m1, aporte=200):
    total = investido = 0
    for k in range(m0, m1 + 1):
        v = aporte
        for r in cdi[k:]:
            v *= 1 + r
        dias = (len(cdi) - k) * 30.4
        ir = .225 if dias <= 180 else .20 if dias <= 360 else .175 if dias <= 720 else .15
        total += aporte + (v - aporte) * (1 - ir)
        investido += aporte
    return investido, round(total)

def bruto_por_ano(m0, m1, aporte=200):
    v, out = 0, {}
    for k, r in enumerate(cdi):
        if m0 <= k <= m1:
            v += aporte
        v *= 1 + r
        if k % 12 == 11:
            out[2010 + k // 12] = round(v)
    return out

if __name__ == "__main__":
    print("Ana  ", liquido(0, 71), bruto_por_ano(0, 71))
    print("Bruno", liquido(72, 191), bruto_por_ano(72, 191))
