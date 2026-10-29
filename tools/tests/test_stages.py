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
    def _json(self):
        ep = self.dir / "assets" / "episode"
        ep.mkdir()
        (ep / "trilha.json").write_text(TRILHA_TEMPLATE.read_text(encoding="utf-8"), encoding="utf-8")

    def test_trilha_sem_json_nao_faz_nada(self):
        v = self.video(trilha=True)
        self.assertEqual(stages.etapa_trilha(v), "sem trilha.json: nada a gerar")
        self.assertEqual(sorted(p.name for p in (self.dir / "assets").iterdir()), [])

    def test_trilha_desligada_no_nicho_nao_faz_nada(self):
        self._json()
        for cfg in ({}, {"trilha": False}):
            v = self.video(**cfg)
            self.assertEqual(stages.etapa_trilha(v), "trilha desligada no niche.json: nada a gerar")
            self.assertEqual(list(self.dir.rglob("*.wav")), [])

    @unittest.skipUnless(importlib.util.find_spec("numpy"), "precisa de numpy")
    def test_trilha_com_json_gera_wavs(self):
        self._json()
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

    def test_render_normaliza_antes_de_registrar(self):
        v = self.video(audio_lufs=-14)
        self._mock_render(v)
        v.catalogo = mock.Mock()

        def norm(mp4, lufs):
            self.assertNotIn("render", v.state)
            v.catalogo.assert_not_called()
            raise RuntimeError("ffmpeg falhou")

        mock.patch.object(audio, "normalizar", side_effect=norm).start()
        with self.assertRaises(RuntimeError):
            stages.etapa_render(v)
        self.assertNotIn("render", v.state)
        v.catalogo.assert_not_called()


class LoopDur(Base):
    """Depois das cenas: LOOP do scene.js e DUR do world.html têm que bater com a duração da voz (index.html: 3 s)."""

    def _3d(self, loop, dur):
        (self.dir / "assets" / "episode").mkdir(parents=True, exist_ok=True)
        (self.dir / "assets" / "episode" / "scene.js").write_text(
            f"const LOOP = {loop};\nconst T = {{}};\n", encoding="utf-8")
        (self.dir / "compositions").mkdir(exist_ok=True)
        (self.dir / "compositions" / "world.html").write_text(
            f"<script>\n      const DUR = {dur};\n</script>\n", encoding="utf-8")

    def _cenas(self):
        v = self.video()
        v.ensaio = True
        mock.patch.object(stages, "_check_e_snapshot", return_value=(True, "check: 0 erros, 0 avisos")).start()
        return stages.etapa_cenas(v)

    def test_bate_sem_aviso(self):
        self._3d(3, 3.004)
        self.assertNotIn("LOOP/DUR", self._cenas())

    def test_diferente_avisa(self):
        self._3d(12, 3)
        out = self._cenas()
        self.assertIn("⚠ LOOP/DUR (12/3) ≠ duração da voz (3) — ajuste scene.js e world.html", out)
        self._3d(3, 12)
        self.assertIn("⚠ LOOP/DUR (3/12) ≠ duração da voz (3)", self._cenas())

    def test_video_2d_sem_aviso(self):
        self.assertNotIn("LOOP/DUR", self._cenas())


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
