"""Etapa `dados`: busca séries mensais do Banco Central (SGS) e calcula os fatos do episódio antes do roteiro.

Só roda em nichos com "dados" no niche.json; o tema do catálogo traz o "calculo" (spec do shared/calculo/calculo.py).
Tudo fica no vídeo: dados/<serie>.json, dados/spec.json, dados/calculo.py, dados/fatos.json.
"""
import datetime, json, shutil, subprocess, sys, urllib.request

from . import config

SGS = {"ipca": 433, "cdi": 4391, "selic": 4390}
API = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.{id}/dados?formato=json&dataInicial={a}&dataFinal={b}"
CALCULO = config.ROOT / "shared" / "calculo" / "calculo.py"


def baixar(nome, ano0, ano1):
    """Série mensal inteira de ano0 a ano1, em janelas de até 10 anos (limite da API)."""
    out = []
    a = ano0
    while a <= ano1:
        b = min(a + 9, ano1)
        url = API.format(id=SGS[nome], a=f"01/01/{a}", b=f"31/12/{b}")
        req = urllib.request.Request(url, headers={"User-Agent": "dark-channels/1.0", "Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=60) as r:
            out += json.loads(r.read())
        a = b + 1
    return out


def ultimo_mes_completo(series):
    """Último mês presente em todas as séries e já encerrado (o mês corrente nunca entra)."""
    hoje = datetime.date.today()
    corrente = (hoje.year, hoje.month)
    fins = []
    for dados in series.values():
        meses = [(int(x["data"][6:]), int(x["data"][3:5])) for x in dados]
        fins.append(max(m for m in meses if m < corrente))
    return min(fins)


def preparar(vdir, calculo, ensaio=False):
    """Baixa as séries usadas, completa o spec (fim padrão = último mês fechado) e roda o cálculo. → texto-resumo."""
    if not calculo or not calculo.get("inicio"):
        raise SystemExit("o tema não tem 'calculo' (spec dos números reais). Gere temas com o prompt do nicho "
                         "ou edite o tema no catalogo.json / pipeline.json → tema.calculo")
    d = vdir / "dados"
    d.mkdir(exist_ok=True)
    usadas = {"ipca"} | {c.get("rende") for c in calculo.get("cenarios", []) if c.get("rende") not in (None, "nada")}
    fora = usadas - set(SGS)
    if fora:
        raise SystemExit(f"séries sem suporte: {fora} (use {sorted(SGS)})")
    ano0 = int(calculo["inicio"][:4])
    series = {n: baixar(n, ano0, datetime.date.today().year) for n in sorted(usadas)}
    spec = dict(calculo)
    if not spec.get("fim"):
        a, m = ultimo_mes_completo(series)
        spec["fim"] = f"{a}-{m:02d}"
    for n, dados in series.items():
        (d / f"{n}.json").write_text(json.dumps(dados, ensure_ascii=False) + "\n", encoding="utf-8")
    (d / "spec.json").write_text(json.dumps(spec, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    shutil.copyfile(CALCULO, d / "calculo.py")
    r = subprocess.run([sys.executable, "-I", str(d / "calculo.py")], cwd=vdir, capture_output=True, text=True)
    if r.returncode:
        raise SystemExit(f"calculo.py falhou:\n{r.stdout}\n{r.stderr}")
    fontes = ", ".join(f"{n.upper()} (SGS {SGS[n]})" for n in sorted(usadas))
    return f"Banco Central: {fontes}\n" + r.stdout.strip()


def fatos_para_prompt(vdir):
    """Os fatos calculados, em texto, para o prompt do roteiro (vazio se o vídeo não tem dados)."""
    f = vdir / "dados" / "fatos.json"
    if not f.exists():
        return ""
    return ("Fonte: Banco Central (SGS) e IBGE (IPCA). Calculado por dados/calculo.py; use SÓ estes números.\n"
            "```json\n" + f.read_text(encoding="utf-8").strip() + "\n```")


def conferir_numeros(roteiro, vdir, tolerancia=0.006):
    """Trava: cada número declarado em roteiro['numeros'] tem que existir em dados/fatos.json. → lista de erros."""
    f = vdir / "dados" / "fatos.json"
    if not f.exists():
        return []
    sys.path.insert(0, str(CALCULO.parent))
    from calculo import numeros  # noqa: E402
    validos = numeros(json.loads(f.read_text(encoding="utf-8")))
    erros = []
    decl = roteiro.get("numeros")
    if not decl:
        return ["o roteiro não declarou 'numeros' (cada número dito, com o valor de dados/fatos.json de onde saiu)"]
    for n in decl:
        try:
            alvo = float(n["valor"])
        except (KeyError, TypeError, ValueError):
            erros.append(f"número sem 'valor': {n}")
            continue
        if not any(abs(alvo - x) <= max(0.011, abs(x) * tolerancia) for x in validos):
            erros.append(f"\"{n.get('dito', '?')}\" = {alvo} não está em dados/fatos.json")
    return erros
