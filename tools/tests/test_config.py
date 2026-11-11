"""Testes de tools/dc/config.py e do comando novo-nicho de tools/pipeline.py (só stdlib)."""
import argparse, os, pathlib, sys, tempfile, unittest
from unittest import mock

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent.parent))
from tools import pipeline  # noqa: E402
from tools.dc import config  # noqa: E402

CHAVES = {"GEMINI_API_KEY": "g", "GOOGLE_API_KEY": "k", "ANTHROPIC_API_KEY": "a", "OUTRA": "x"}


class SubEnv(unittest.TestCase):
    def test_sem_chaves_do_gemini(self):
        # nem `claude -p` nem o CLI do hyperframes podem disparar a descrição paga de quadros pelo Gemini
        with mock.patch.dict(os.environ, CHAVES):
            for drop in (False, True):
                env = config.sub_env(drop_anthropic_key=drop)
                self.assertNotIn("GEMINI_API_KEY", env)
                self.assertNotIn("GOOGLE_API_KEY", env)
                self.assertEqual(env["OUTRA"], "x")
            self.assertEqual(config.sub_env()["ANTHROPIC_API_KEY"], "a")
            self.assertNotIn("ANTHROPIC_API_KEY", config.sub_env(drop_anthropic_key=True))
            self.assertEqual(os.environ["GEMINI_API_KEY"], "g")  # o processo do pipeline continua com a chave


class DesignBible(unittest.TestCase):
    def test_montar_prompt_biblia_preenche_marcadores(self):
        p = pipeline.montar_prompt_biblia("historia-sombria", "Mistérios históricos", "novo vilão")
        self.assertIn("- NICHE: historia-sombria", p)
        self.assertIn("- DESCRIPTION: Mistérios históricos", p)
        self.assertIn("- SPECIFIC REQUEST (optional): novo vilão", p)
        self.assertNotIn("{{", p)

    def test_cmd_novo_nicho_ensaio_salva_biblia(self):
        with tempfile.TemporaryDirectory() as tmp:
            t = pathlib.Path(tmp)
            with mock.patch.object(pipeline.config, "BIBLES", t / "bibles"), mock.patch.object(pipeline.config, "NICHES", t / "niches"):
                a = argparse.Namespace(
                    nicho="teste-nicho", descricao="Canal de testes", pedido="",
                    so_prompt=False, ensaio=True, criar=False, base="tech-lore", agente=None, modelo=None,
                )
                pipeline.cmd_novo_nicho(a)
                dest = t / "bibles" / "teste-nicho-design-bible.md"
                self.assertTrue(dest.exists())
                self.assertIn("Mode A (New Identity)", dest.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
