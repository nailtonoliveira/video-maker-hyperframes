"""Números reais de um episódio, a partir das séries mensais do Banco Central (SGS) salvas em dados/.

Copiado para <video>/dados/calculo.py pela etapa `dados` do pipeline: o vídeo fica reproduzível sozinho.
Uso:  python3 dados/calculo.py            → imprime a tabela de fatos e grava dados/fatos.json
Só stdlib. Lê dados/spec.json e dados/<serie>.json (ipca, cdi, selic).

spec.json:
{
  "inicio": "2010-01", "fim": "2025-12",                  # meses inclusive; o IPCA do período inteiro é sempre calculado
  "cenarios": [
    {"nome": "Ana", "tipo": "aporte", "valor": 200, "de": "2010-01", "ate": "2015-12", "rende": "cdi"},
    {"nome": "nota", "tipo": "parado", "valor": 100, "de": "2010-01"}
  ]
}
- tipo "aporte": `valor` no início de cada mês de `de` a `ate`; "parado": `valor` uma vez em `de`.
- rende: "cdi" | "selic" (100% da taxa, IR pela tabela regressiva por aporte, contado até `fim`) | "nada" (dinheiro guardado).
Convenções: aporte no 1º dia do mês rende o mês inteiro; sem taxas de custódia; IR com mês = 30,4 dias.
"""
import json, pathlib

AQUI = pathlib.Path(__file__).resolve().parent


def mes(s):
    a, m = s.split("-")
    return int(a), int(m)


def chave(item):
    d, m, a = item["data"].split("/")
    return int(a), int(m)


def serie(nome, ini, fim):
    """Taxas mensais (fração) de ini a fim, na ordem; erro se faltar algum mês."""
    dados = {chave(x): float(x["valor"]) / 100 for x in json.loads((AQUI / f"{nome}.json").read_text())}
    out, (a, m) = [], ini
    while (a, m) <= fim:
        if (a, m) not in dados:
            raise SystemExit(f"{nome}: falta o mês {m:02d}/{a} em dados/{nome}.json")
        out.append(dados[(a, m)])
        a, m = (a + 1, 1) if m == 12 else (a, m + 1)
    return out


def idx(ini, a_m):
    return (a_m[0] - ini[0]) * 12 + a_m[1] - ini[1]


def ir_aliquota(meses):
    dias = meses * 30.4
    return .225 if dias <= 180 else .20 if dias <= 360 else .175 if dias <= 720 else .15


def calcular(spec):
    ini, fim = mes(spec["inicio"]), mes(spec["fim"])
    n = idx(ini, fim) + 1
    ipca = serie("ipca", ini, fim)
    fat_ipca = [1.0]
    for r in ipca:
        fat_ipca.append(fat_ipca[-1] * (1 + r))  # fat_ipca[k] = inflação acumulada do início até o começo do mês k
    anos = sorted({ini[0] + (ini[1] - 1 + k) // 12 for k in range(n)})
    fatos = {"periodo": {"inicio": spec["inicio"], "fim": spec["fim"], "meses": n},
             "ipca": {"acumulado_pct": round((fat_ipca[-1] - 1) * 100, 2), "fator": round(fat_ipca[-1], 4),
                      "media_mensal_pct": round(sum(ipca) / n * 100, 2),
                      "meses_com_alta": sum(r > 0 for r in ipca), "meses_com_deflacao": sum(r < 0 for r in ipca),
                      "por_ano_pct": {}, "poder_de_compra_de_100_fim_do_ano": {}, "preco_de_100_fim_do_ano": {}},
             "cenarios": []}
    for a in anos:
        ks = [k for k in range(n) if ini[0] + (ini[1] - 1 + k) // 12 == a]
        f = 1.0
        for k in ks:
            f *= 1 + ipca[k]
        if len(ks) < 12:  # ano incompleto (começo ou fim do período): não é "a inflação do ano"
            fatos["ipca"].setdefault("anos_parciais", {})[a] = {"meses": len(ks), "pct": round((f - 1) * 100, 2)}
        else:
            fatos["ipca"]["por_ano_pct"][a] = round((f - 1) * 100, 2)
        acum = fat_ipca[ks[-1] + 1]
        fatos["ipca"]["poder_de_compra_de_100_fim_do_ano"][a] = round(100 / acum, 2)
        fatos["ipca"]["preco_de_100_fim_do_ano"][a] = round(100 * acum, 2)

    for c in spec.get("cenarios", []):
        de = idx(ini, mes(c["de"]))
        ate = idx(ini, mes(c.get("ate", c["de"]))) if c["tipo"] == "aporte" else de
        if not (0 <= de <= ate < n):
            raise SystemExit(f"cenário {c['nome']}: meses fora do período {spec['inicio']}–{spec['fim']}")
        taxa = serie(c["rende"], ini, fim) if c.get("rende", "nada") != "nada" else [0.0] * n
        investido = bruto = liquido = real = 0.0
        por_ano = {}
        saldo = 0.0
        for k in range(n):
            if de <= k <= ate:
                saldo += c["valor"]
            saldo *= 1 + taxa[k]
            a = ini[0] + (ini[1] - 1 + k) // 12
            if (ini[1] - 1 + k) % 12 == 11 or k == n - 1:
                por_ano[a] = round(saldo, 2)
        for k in range(de, ate + 1):
            v = c["valor"]
            for r in taxa[k:]:
                v *= 1 + r
            investido += c["valor"]
            bruto += v
            ir = ir_aliquota(n - k) if c.get("rende", "nada") != "nada" else 0
            liq = c["valor"] + (v - c["valor"]) * (1 - ir)
            liquido += liq
            real += liq / (fat_ipca[-1] / fat_ipca[k])  # em reais da data de cada aporte
        fatos["cenarios"].append({
            "nome": c["nome"], "tipo": c["tipo"], "rende": c.get("rende", "nada"), "valor": c["valor"],
            "de": c["de"], "ate": c.get("ate", c["de"]), "aportes": ate - de + 1,
            "investido": round(investido, 2), "final_bruto": round(bruto, 2), "final_liquido_ir": round(liquido, 2),
            "final_em_reais_de_cada_aporte": round(real, 2),
            "poder_de_compra_em_reais_do_inicio": round(liquido / fat_ipca[-1], 2),
            "saldo_bruto_fim_do_ano": por_ano,
        })
    return fatos


def numeros(fatos):
    """Todos os valores numéricos dos fatos (para a trava do roteiro)."""
    out = []
    def walk(x):
        if isinstance(x, bool):
            return
        if isinstance(x, (int, float)):
            out.append(float(x))
        elif isinstance(x, dict):
            for v in x.values():
                walk(v)
        elif isinstance(x, list):
            for v in x:
                walk(v)
    walk(fatos)
    return out


if __name__ == "__main__":
    spec = json.loads((AQUI / "spec.json").read_text())
    f = calcular(spec)
    (AQUI / "fatos.json").write_text(json.dumps(f, ensure_ascii=False, indent=2) + "\n")
    p, i = f["periodo"], f["ipca"]
    print(f"Período {p['inicio']} a {p['fim']} ({p['meses']} meses)")
    print(f"IPCA acumulado: +{i['acumulado_pct']}% · média {i['media_mensal_pct']}%/mês · {i['meses_com_alta']} meses de alta, {i['meses_com_deflacao']} de deflação")
    print("IPCA por ano: " + ", ".join(f"{a} {v:+.2f}%" for a, v in i["por_ano_pct"].items())
          + "".join(f" · {a} parcial ({p['meses']} meses) {p['pct']:+.2f}%" for a, p in i.get("anos_parciais", {}).items()))
    print("R$ 100 do início, em poder de compra no fim de cada ano: " + ", ".join(f"{a} R$ {v:.2f}" for a, v in i["poder_de_compra_de_100_fim_do_ano"].items()))
    for c in f["cenarios"]:
        print(f"- {c['nome']}: {c['tipo']} R$ {c['valor']} ({c['aportes']}x, {c['de']}→{c['ate']}, rende {c['rende']}): investiu R$ {c['investido']:.2f}, "
              f"bruto R$ {c['final_bruto']:.2f}, líquido R$ {c['final_liquido_ir']:.2f}, em poder de compra do início R$ {c['poder_de_compra_em_reais_do_inicio']:.2f}")
