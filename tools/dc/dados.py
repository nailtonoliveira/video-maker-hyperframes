"""Etapa `dados`: busca séries mensais do Banco Central (SGS) e calcula os fatos do episódio antes do roteiro.

Só roda em nichos com "dados" no niche.json; o tema do catálogo traz o "calculo" (spec do shared/calculo/calculo.py).
Tudo fica no vídeo: dados/<serie>.json, dados/spec.json, dados/calculo.py, dados/fatos.json.
"""
import datetime, json, re, shutil, subprocess, sys, unicodedata, urllib.request

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


def _fatos(vdir):
    f = vdir / "dados" / "fatos.json"
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else None


def valor_em(fatos, caminho):
    """Valor de fatos.json num caminho como 'cenarios[0].final_liquido_ir' ou 'ipca.por_ano_pct.2015'."""
    x = fatos
    for parte in re.findall(r"[^.\[\]\s]+", caminho):
        x = x[int(parte)] if isinstance(x, list) else x[parte]
    if isinstance(x, (dict, list)) or isinstance(x, bool):
        raise ValueError(f"'{caminho}' não é um número")
    return float(x)


def _sem_acento(s):
    return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if unicodedata.category(c) != "Mn")


# Proporções que a fala afirma ("o dobro", "triplicou", "a metade") → fator. Só passam declaradas em `numeros`
# com origem "<caminho> / <caminho>" e com a razão calculada coerente com a palavra.
PROPORCOES = [(r"\bdobr\w*", 2.0), (r"\btripl\w*", 3.0), (r"\bquadrupl\w*|\bquadruplo\w*", 4.0), (r"\bmetade\b", 0.5)]
# Exagero e promessa: proibidos na série (não dá para conferir e soam como promessa de ganho).
EXAGEROS = r"\bfortunas?\b|\bmilionari\w*|\bricos?\b|\bricas?\b|\benriquec\w*|\bgarantid\w*|\bsem risco\b|\bdinheiro facil\b"
# Produto financeiro, banco ou corretora pelo nome.
PRODUTOS = (r"\btesouro (direto|selic|ipca|prefixado)\b|\bcdbs?\b|\blci\b|\blca\b|\bcaderneta\b|\bnubank\b|\bitau\b"
            r"|\bbradesco\b|\bsantander\b|\bbanco do brasil\b|\bbtg\b|\bxp\b|\bbitcoin\b|\bcripto\w*")


def _proporcao(texto):
    """[(trecho, fator, modo)] das proporções no texto; modo: 'quase' (< fator), 'mais' (> fator) ou 'igual'."""
    t = _sem_acento(texto)
    out = []
    for pad, fator in PROPORCOES:
        for m in re.finditer(pad, t):
            antes = t[max(0, m.start() - 22):m.start()]
            modo = "quase" if re.search(r"\b(quase|perto d\w|chegou? a)\b", antes) else \
                   "mais" if re.search(r"\bmais (d[eo] )?(que|do que)\b|\bpassou d\w\b", antes) else "igual"
            out.append((m.group(0), fator, modo))
    return out


def _cabe(razao, fator, modo):
    if modo == "quase":
        return fator * 0.88 <= razao < fator
    if modo == "mais":
        return razao > fator
    return abs(razao - fator) <= fator * 0.06


def conferir_texto(texto, onde="texto"):
    """Trava de palavras (vale para tema e roteiro): sem exagero e sem produto/banco pelo nome. → lista de erros."""
    t = _sem_acento(texto)
    erros = [f"{onde}: \"{m.group(0)}\" é exagero/promessa (proibido na série)" for m in re.finditer(EXAGEROS, t)]
    erros += [f"{onde}: \"{m.group(0)}\" é nome de produto, banco ou corretora (proibido)" for m in re.finditer(PRODUTOS, t)]
    return erros


def conferir_numeros(roteiro, vdir, tolerancia=0.006):
    """Trava: cada número declarado em roteiro['numeros'] existe em dados/fatos.json (ou é a razão de dois deles),
    e toda proporção dita na locução ("o dobro", "a metade") está declarada e é verdadeira. → lista de erros."""
    fatos = _fatos(vdir)
    if fatos is None:
        return []
    sys.path.insert(0, str(CALCULO.parent))
    from calculo import numeros  # noqa: E402
    validos = numeros(fatos)
    erros = []
    decl = roteiro.get("numeros")
    if not decl:
        return ["o roteiro não declarou 'numeros' (cada número dito, com o valor de dados/fatos.json de onde saiu)"]
    razoes = []  # (dito, razão calculada) das proporções declaradas
    for n in decl:
        try:
            alvo = float(n["valor"])
        except (KeyError, TypeError, ValueError):
            erros.append(f"número sem 'valor': {n}")
            continue
        origem = str(n.get("origem", ""))
        if "/" in origem:
            try:
                a, b = (valor_em(fatos, x.strip()) for x in origem.split("/", 1))
                razao = a / b
            except (KeyError, IndexError, ValueError, ZeroDivisionError) as e:
                erros.append(f"\"{n.get('dito', '?')}\": origem '{origem}' não existe em dados/fatos.json ({e})")
                continue
            if abs(alvo - razao) > max(0.011, abs(razao) * tolerancia):
                erros.append(f"\"{n.get('dito', '?')}\": {origem} dá {razao:.3f}, não {alvo}")
            razoes.append((_sem_acento(str(n.get("dito", ""))), razao))
        elif not any(abs(alvo - x) <= max(0.011, abs(x) * tolerancia) for x in validos):
            erros.append(f"\"{n.get('dito', '?')}\" = {alvo} não está em dados/fatos.json")
    fala = " ".join(c.get("locucao", "") for c in roteiro.get("cenas", []))
    for trecho, fator, modo in _proporcao(fala):
        casadas = [r for d, r in razoes if trecho in d]
        if not casadas:
            erros.append(f"a locução diz \"{trecho}\" mas não declarou em 'numeros' de onde sai "
                         f"(origem \"<caminho> / <caminho>\" de dados/fatos.json)")
        elif not any(_cabe(r, fator, modo) for r in casadas):
            rs = ", ".join(f"{r:.2f}" for r in casadas)
            erros.append(f"a locução diz \"{trecho}\" ({'quase ' if modo == 'quase' else 'mais que ' if modo == 'mais' else ''}"
                         f"×{fator:g}) mas a razão declarada é {rs}: reescreva com a proporção verdadeira")
    return erros


MES = re.compile(r"^(\d{4})-(0[1-9]|1[0-2])$")


def conferir_tema(tema):
    """Trava do catálogo: o `calculo` roda no calculo.py e o texto não promete o que o cálculo não comprova. → erros."""
    erros = []
    texto = " ".join(str(tema.get(k, "")) for k in ("titulo", "gancho", "resumo", "ideia"))
    erros += conferir_texto(texto, "tema")
    erros += [f"tema: \"{p[0]}\" é proporção que o cálculo ainda não comprovou (deixe para o roteiro)" for p in _proporcao(texto)]
    c = tema.get("calculo")
    if not isinstance(c, dict):
        return erros + ["sem 'calculo'"]
    ini, fim = c.get("inicio", ""), c.get("fim")
    if not MES.match(str(ini)) or ini < "2000-01":
        erros.append(f"calculo.inicio inválido: {ini!r}")
    if fim is not None and (not MES.match(str(fim)) or fim <= str(ini)):
        erros.append(f"calculo.fim inválido: {fim!r}")
    cen = c.get("cenarios")
    if not isinstance(cen, list) or not 1 <= len(cen) <= 3:
        return erros + ["calculo.cenarios: de 1 a 3 cenários"]
    for s in cen:
        nome = s.get("nome", "?")
        if s.get("tipo") not in ("aporte", "parado"):
            erros.append(f"cenário {nome}: tipo tem que ser 'aporte' ou 'parado'")
        if s.get("rende", "nada") not in ("cdi", "selic", "nada"):
            erros.append(f"cenário {nome}: rende tem que ser 'cdi', 'selic' ou 'nada'")
        if not isinstance(s.get("valor"), (int, float)) or s["valor"] <= 0:
            erros.append(f"cenário {nome}: valor inválido")
        de, ate = str(s.get("de", "")), str(s.get("ate", s.get("de", "")))
        if not MES.match(de) or not MES.match(ate) or ate < de:
            erros.append(f"cenário {nome}: meses inválidos ({de} → {ate})")
        elif MES.match(str(ini)) and (de < ini or (fim and ate > fim)):
            erros.append(f"cenário {nome}: meses fora do período")
    return erros
