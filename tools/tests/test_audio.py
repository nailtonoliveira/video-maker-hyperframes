"""Testes de tools/dc/audio.py (unittest; precisa do binário ffmpeg)."""
import pathlib, subprocess, sys, tempfile, unittest

TOOLS = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(TOOLS.parent))
from tools.dc import audio  # noqa: E402


def _ff(*args):
    return subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", *args],
                          capture_output=True, text=True, check=True).stdout


def _hash_video(mp4):
    return _ff("-i", str(mp4), "-map", "0:v", "-c", "copy", "-f", "md5", "-")


def _duracao_video(mp4):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=duration", "-of", "default=nw=1:nk=1", str(mp4)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def _caixas(mp4):
    """Tipos das caixas de nível superior do MP4, em ordem."""
    out, dados, i = [], pathlib.Path(mp4).read_bytes(), 0
    while i + 8 <= len(dados):
        n, tipo = int.from_bytes(dados[i:i + 4], "big"), dados[i + 4:i + 8].decode("latin-1")
        if n == 1:
            n = int.from_bytes(dados[i + 8:i + 16], "big")
        out.append(tipo)
        if n < 8:
            break
        i += n
    return out


class Normalizar(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.mp4 = pathlib.Path(self._tmp.name) / "v.mp4"
        _ff("-f", "lavfi", "-i", "testsrc=size=320x240:rate=30",
            "-f", "lavfi", "-i", "sine=frequency=440",
            "-af", "volume=-30dB", "-t", "3", "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-shortest", str(self.mp4))

    def test_normaliza_para_alvo(self):
        antes, depois = audio.normalizar(self.mp4, -14)
        self.assertLess(antes, -20)
        self.assertAlmostEqual(depois, -14, delta=1)
        self.assertAlmostEqual(audio.medir_lufs(self.mp4), -14, delta=1)

    def test_normaliza_mantem_video(self):
        h, d = _hash_video(self.mp4), _duracao_video(self.mp4)
        audio.normalizar(self.mp4, -14)
        self.assertEqual(_hash_video(self.mp4), h)
        self.assertAlmostEqual(_duracao_video(self.mp4), d, delta=0.05)

    def test_faststart_moov_antes_de_mdat(self):
        audio.normalizar(self.mp4, -14)
        cx = _caixas(self.mp4)
        self.assertLess(cx.index("moov"), cx.index("mdat"), cx)

    def test_falha_preserva_original(self):
        antes = self.mp4.read_bytes()
        with self.assertRaises(RuntimeError):
            audio.normalizar(self.mp4, -14, ffmpeg_bin="/nao/existe/ffmpeg")
        self.assertEqual(self.mp4.read_bytes(), antes)
        self.assertEqual([p.name for p in self.mp4.parent.iterdir()], ["v.mp4"])


if __name__ == "__main__":
    unittest.main()
