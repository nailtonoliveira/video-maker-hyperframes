"""Testes de tools/dc/stages.py com um vídeo falso em diretório temporário (unittest)."""
import importlib.util, json, pathlib, sys, tempfile, unittest
from unittest import mock

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT))

if importlib.util.find_spec("num2words"):
    from tools.dc import audio, config, stages  # noqa: E402

TRILHA_TEMPLATE = ROOT / "niches" / "tech-lore" / "template" / "assets" / "episode" / "trilha.json"
INDEX = '<div data-composition-id="main" data-start="0" data-duration="3"></div>'


@unittest.skipUnless(importlib.util.find_spec("num2words"), "precisa de num2words (use tools/.venv)")
class Base(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.tmp = pathlib.Path(tmp.name)
        self.niches = self.tmp / "niches"
        self.niche = self.niches / "fake"
        (self.niche / "prompts").mkdir(parents=True)
        (self.niche / "NICHE.md").write_text("x", encoding="utf-8")
        self._cfg = {}
        self.dir = self.niche / "videos" / "001-x"
        (self.dir / "assets").mkdir(parents=True)
        (self.dir / "index.html").write_text(INDEX, encoding="utf-8")
        mock.patch.object(config, "NICHES", self.niches).start()
        self.addCleanup(mock.patch.stopall)

    def video(self, **niche):
        (self.niche / "niche.json").write_text(json.dumps(niche), encoding="utf-8")
        (self.dir / "pipeline.json").write_text(json.dumps({"id": "fake-001-x", "nicho": "fake", "etapas": {}}), encoding="utf-8")
        return stages.Video(self.dir)


class Trilha(Base):
    def test_trilha_sem_json_nao_faz_nada(self):
        v = self.video(trilha=True)
        self.assertEqual(stages.etapa_trilha(v), "sem trilha.json: nada a gerar")
        self.assertEqual(sorted(p.name for p in (self.dir / "assets").iterdir()), [])

    @unittest.skipUnless(importlib.util.find_spec("numpy"), "precisa de numpy")
    def test_trilha_com_json_gera_wavs(self):
        ep = self.dir / "assets" / "episode"
        ep.mkdir()
        (ep / "trilha.json").write_text(TRILHA_TEMPLATE.read_text(encoding="utf-8"), encoding="utf-8")
        v = self.video(trilha=True)
        out = stages.etapa_trilha(v)
        self.assertTrue(out)
        self.assertTrue(list(self.dir.rglob("*.wav")), out)


class Roteiro(unittest.TestCase):
    def setUp(self):
        if not importlib.util.find_spec("num2words"):
            self.skipTest("precisa de num2words")

    def cena(self, **kw):
        return {"n": 1, "locucao": "a", "ancoras": [], **kw}

    def test_validar_roteiro_mundo(self):
        base = {"titulo": "t", "titulo_tela": "T"}
        stages._validar_roteiro({**base, "cenas": [self.cena()]})  # sem mundos: aceita
        mundos = ["exterior", "mergulho"]
        stages._validar_roteiro({**base, "cenas": [self.cena(mundo="exterior")]}, mundos)
        with self.assertRaisesRegex(ValueError, "cena 1"):
            stages._validar_roteiro({**base, "cenas": [self.cena()]}, mundos)
        with self.assertRaisesRegex(ValueError, "cena 1"):
            stages._validar_roteiro({**base, "cenas": [self.cena(mundo="lua")]}, mundos)

    def test_roteiro_md_mostra_mundo(self):
        d = {"titulo": "t", "titulo_tela": "T", "cenas": [self.cena(mundo="placa")]}
        self.assertIn("**Mundo:** placa", stages.roteiro_md(d, 2.3))


class Render(Base):
    def _mock_render(self, v):
        (self.dir / "renders").mkdir()
        (self.dir / "renders" / "a.mp4").write_bytes(b"x")
        v.hf = mock.Mock(return_value=mock.Mock(returncode=0))
        mock.patch.object(stages, "ffprobe_dur", return_value=1.0).start()

    def test_render_sem_lufs_nao_normaliza(self):
        v = self.video()
        self._mock_render(v)
        norm = mock.patch.object(audio, "normalizar").start()
        out = stages.etapa_render(v)
        norm.assert_not_called()
        self.assertNotIn("LUFS", out)

    def test_render_com_lufs_normaliza(self):
        v = self.video(audio_lufs=-14)
        self._mock_render(v)
        norm = mock.patch.object(audio, "normalizar", return_value=(-20.0, -14.0)).start()
        out = stages.etapa_render(v)
        norm.assert_called_once()
        self.assertEqual(norm.call_args[0][1], -14)
        self.assertIn("áudio: -20.0 → -14.0 LUFS", out)


class Prompt(Base):
    def _prep(self, tpl, **niche):
        (self.niche / "prompts" / "hyperframes.md").write_text(tpl, encoding="utf-8")
        v = self.video(**niche)
        (self.dir / "roteiro.json").write_text(json.dumps({
            "titulo": "t", "titulo_tela": "T",
            "cenas": [{"n": 1, "nome": "A", "locucao": "um dois", "visual": "v", "mundo": "exterior",
                       "ancoras": [{"gatilho": "um", "visual": "x"}]}]}), encoding="utf-8")
        (self.dir / "assets" / "voice.json").write_text("[]", encoding="utf-8")
        mock.patch.object(stages.align, "scene_timeline", return_value=[
            {"n": 1, "nome": "A", "inicio": 0.0, "fim": 3.0, "ancoras": [{"t": 0.5, "gatilho": "um", "visual": "x"}]}]).start()
        return v

    TPL = "{{TITULO}}|{{TITULO_TELA}}|{{DURACAO}}|{{FRAMES}}|{{TIMELINE}}|{{FATOS}}"

    def test_prompt_sem_motor_nao_exige_marcador(self):
        v = self._prep(self.TPL)
        stages.etapa_prompt(v)
        txt = (self.dir / "hyperframes-prompt.md").read_text(encoding="utf-8")
        self.assertIn("- Mundo: exterior", txt)

    def test_prompt_com_motor_injeta_motor_e_kit(self):
        v = self._prep(self.TPL + "|{{MOTOR}}|{{KIT}}", motor="3d")
        (self.dir / "assets" / "motor").mkdir()
        (self.dir / "assets" / "motor" / "PROMPT.md").write_text("REGRAS-MOTOR", encoding="utf-8")
        stages.etapa_prompt(v)
        txt = (self.dir / "hyperframes-prompt.md").read_text(encoding="utf-8")
        self.assertIn("REGRAS-MOTOR", txt)
        self.assertTrue(txt.endswith("|REGRAS-MOTOR|"))  # sem KIT.md: vazio


if __name__ == "__main__":
    unittest.main()
