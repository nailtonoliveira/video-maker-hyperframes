"""Testes de tools/motor.py (unittest, sem dependências)."""
import json, pathlib, sys, tempfile, unittest

TOOLS = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOLS))
import motor  # noqa: E402

TEMA_TECH_LORE = json.loads((TOOLS.parent / "niches" / "tech-lore" / "tema.json").read_text(encoding="utf-8"))


class GerarTemaJs(unittest.TestCase):
    def test_gera_tema_js(self):
        txt = motor.gerar_tema_js(TEMA_TECH_LORE, "niches/tech-lore/tema.json")
        self.assertTrue(txt.startswith("// gerado por"))
        self.assertIn("export const TEMA = ", txt)
        self.assertIn('"alerta": "#ff3366"', txt)

    def test_cor_faltando(self):
        tema = json.loads(json.dumps(TEMA_TECH_LORE))
        del tema["cores"]["alerta"]
        with self.assertRaises(ValueError) as c:
            motor.gerar_tema_js(tema, "x")
        self.assertIn('falta a cor "alerta"', str(c.exception))

    def test_hex_invalido(self):
        tema = json.loads(json.dumps(TEMA_TECH_LORE))
        tema["cores"]["ok"] = "verde"
        with self.assertRaises(ValueError) as c:
            motor.gerar_tema_js(tema, "x")
        self.assertIn('cor "ok" inválida', str(c.exception))


class InstalarMotor(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.raiz = pathlib.Path(self._tmp.name)
        m = self.raiz / "shared" / "motor-3d"
        (m / "tests").mkdir(parents=True)
        (m / "VERSION").write_text("0.1.0\n", encoding="utf-8")
        (m / "util.js").write_text("export const a = 1;\n", encoding="utf-8")
        (m / "tests" / "x.test.js").write_text("//\n", encoding="utf-8")
        (m / "package.json").write_text("{}\n", encoding="utf-8")
        n = self.raiz / "niches" / "n"
        n.mkdir(parents=True)
        (n / "tema.json").write_text(json.dumps(TEMA_TECH_LORE), encoding="utf-8")
        self.video = n / "videos" / "001-v"
        self.video.mkdir(parents=True)

    def test_instala_motor_e_tema(self):
        versao = motor.instalar_motor(self.video, "n", raiz=self.raiz)
        self.assertEqual(versao, "0.1.0")
        self.assertTrue((self.video / "assets" / "motor" / "util.js").is_file())
        self.assertTrue((self.video / "assets" / "tema.js").is_file())
        self.assertFalse((self.video / "assets" / "motor" / "tests").exists())
        self.assertFalse((self.video / "assets" / "motor" / "package.json").exists())

    def test_reinstalar_remove_arquivos_velhos(self):
        motor.instalar_motor(self.video, "n", raiz=self.raiz)
        velho = self.video / "assets" / "motor" / "velho.js"
        velho.write_text("//\n", encoding="utf-8")
        motor.instalar_motor(self.video, "n", raiz=self.raiz)
        self.assertFalse(velho.exists())
        self.assertTrue((self.video / "assets" / "motor" / "util.js").is_file())

    def test_grava_versao_no_meta(self):
        meta = self.video / "meta.json"
        meta.write_text(json.dumps({"id": "n-001-v", "name": "n-001-v"}, indent=2) + "\n", encoding="utf-8")
        motor.instalar_motor(self.video, "n", raiz=self.raiz)
        txt = meta.read_text(encoding="utf-8")
        d = json.loads(txt)
        self.assertEqual(d["motor"], {"tipo": "3d", "versao": "0.1.0"})
        self.assertEqual(d["id"], "n-001-v")
        self.assertEqual(d["name"], "n-001-v")
        self.assertTrue(txt.endswith("\n"))
        self.assertIn('\n  "id"', txt)

    def test_sem_meta_nao_cria(self):
        motor.instalar_motor(self.video, "n", raiz=self.raiz)
        self.assertFalse((self.video / "meta.json").exists())


if __name__ == "__main__":
    unittest.main()
