"""Testes de tools/dc/config.py (só stdlib)."""
import os, pathlib, sys, unittest
from unittest import mock

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent.parent))
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


if __name__ == "__main__":
    unittest.main()
