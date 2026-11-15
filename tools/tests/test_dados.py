import json, pathlib, sys, tempfile, unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))
from dc import dados  # noqa: E402

FATOS = {"periodo": {"inicio": "2014-01", "fim": "2023-12", "meses": 120},
         "ipca": {"acumulado_pct": 77.52, "por_ano_pct": {"2015": 10.67}},
         "cenarios": [{"nome": "Ana", "investido": 12000.0, "final_liquido_ir": 17732.53},
                      {"nome": "Bruno", "investido": 12000.0, "final_liquido_ir": 12000.0, "x": 23500.0}]}


def roteiro(fala, numeros):
    return {"cenas": [{"locucao": fala}], "numeros": numeros}


class Numeros(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.v = pathlib.Path(self.tmp.name)
        (self.v / "dados").mkdir()
        (self.v / "dados" / "fatos.json").write_text(json.dumps(FATOS))

    def tearDown(self):
        self.tmp.cleanup()

    def test_valor_em(self):
        self.assertEqual(dados.valor_em(FATOS, "cenarios[0].final_liquido_ir"), 17732.53)
        self.assertEqual(dados.valor_em(FATOS, "ipca.por_ano_pct.2015"), 10.67)

    def test_numero_do_fatos_passa(self):
        r = roteiro("Ana terminou com dezessete mil.", [{"dito": "dezessete mil", "valor": 17732.53, "origem": "x"}])
        self.assertEqual(dados.conferir_numeros(r, self.v), [])

    def test_proporcao_nao_declarada_barra(self):
        r = roteiro("Ana terminou com quase o dobro.", [{"dito": "dezessete mil", "valor": 17732.53}])
        self.assertIn("dobro", " ".join(dados.conferir_numeros(r, self.v)))

    def test_proporcao_falsa_barra(self):
        # 17732.53 / 12000 = 1.48: não é "quase o dobro"
        r = roteiro("Ana terminou com quase o dobro.",
                    [{"dito": "quase o dobro", "valor": 1.48, "origem": "cenarios[0].final_liquido_ir / cenarios[0].investido"}])
        erros = dados.conferir_numeros(r, self.v)
        self.assertEqual(len(erros), 1)
        self.assertIn("1.48", erros[0])

    def test_proporcao_verdadeira_passa(self):
        # 23500 / 12000 = 1.96: "quase o dobro"
        r = roteiro("Ele tinha quase o dobro.",
                    [{"dito": "quase o dobro", "valor": 1.96, "origem": "cenarios[1].x / cenarios[1].investido"}])
        self.assertEqual(dados.conferir_numeros(r, self.v), [])
        r["cenas"][0]["locucao"] = "Ele dobrou o dinheiro."  # 1.96 também passa como "dobrou" (±6%)
        r["numeros"][0]["dito"] = "dobrou"
        self.assertEqual(dados.conferir_numeros(r, self.v), [])

    def test_razao_declarada_errada_barra(self):
        r = roteiro("Nada demais.", [{"dito": "x", "valor": 2.5, "origem": "cenarios[0].final_liquido_ir / cenarios[0].investido"}])
        self.assertTrue(dados.conferir_numeros(r, self.v))

    def test_sem_fatos_nao_confere(self):
        self.assertEqual(dados.conferir_numeros(roteiro("o dobro", []), self.v / "nada"), [])


class Texto(unittest.TestCase):
    def test_exagero_e_produto(self):
        e = dados.conferir_texto("O réu engoliu uma fortuna aplicada no Tesouro Selic e no CDB.")
        self.assertEqual(len(e), 3)

    def test_texto_limpo(self):
        self.assertEqual(dados.conferir_texto("O dinheiro rendeu a Selic e o CDI; o outro ficou na gaveta."), [])


class Tema(unittest.TestCase):
    def tema(self, **kw):
        t = {"titulo": "O poço", "gancho": "Quem guardou pouco terminou com mais.", "resumo": "Ana guarda todo mês.",
             "calculo": {"inicio": "2014-01", "cenarios": [
                 {"nome": "Ana", "tipo": "aporte", "valor": 100, "de": "2014-01", "ate": "2023-12", "rende": "cdi"}]}}
        t.update(kw)
        return t

    def test_tema_bom(self):
        self.assertEqual(dados.conferir_tema(self.tema()), [])

    def test_gancho_com_proporcao_barra(self):
        self.assertTrue(dados.conferir_tema(self.tema(gancho="Ela acumulou quase o dobro do que colocou.")))

    def test_calculo_invalido_barra(self):
        t = self.tema()
        t["calculo"]["cenarios"][0]["rende"] = "poupanca"
        self.assertTrue(dados.conferir_tema(t))
        self.assertTrue(dados.conferir_tema(self.tema(calculo={"inicio": "1990-01", "cenarios": []})))
        t = self.tema()
        t["calculo"]["fim"] = "2020-12"  # ate (2023-12) passa do fim
        self.assertIn("fora do período", " ".join(dados.conferir_tema(t)))


if __name__ == "__main__":
    unittest.main()
