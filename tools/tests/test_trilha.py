"""Testes de shared/trilha/trilha.py (precisam de numpy e ffmpeg; sem numpy, são pulados)."""
import copy, importlib.util, pathlib, sys, tempfile, unittest, wave

RAIZ = pathlib.Path(__file__).resolve().parent.parent.parent
HAS_NUMPY = importlib.util.find_spec("numpy") is not None
if HAS_NUMPY:
    sys.path.insert(0, str(RAIZ / "shared" / "trilha"))
    import trilha  # noqa: E402

DUR = 4.0
SPEC = {
    "semente": 501,
    "ambiente": {
        "ronco": {"env": [[0.5, 3.0, 0.5, 0.05, 0.05]]},
        "vento": {"env": [[0.0, 4.0, 0.3]]},
        "zumbido": {"env": [[0, 4.0, 0.4]], "alarme": [[1.0, 3.0]]},
    },
    "musica": {
        "tom": "la_menor",
        "drone": {"env": [[0, 4.0, 0.8, 0.1, 0.4]]},
        "brilho": {"env": [[1.0, 3.0, 0.8, 0.5, 0.5]]},
        "pulso": {"inicio": 1.0, "fim": 3.0, "bpm": 120},
        "subida": {"inicio": 2.5, "fim": 3.5},
    },
    "efeitos": [
        {"tipo": "trava", "t": 1.0, "ganho": 0.8},
        {"tipo": "clique", "tempos": [2.0, 2.05], "ganho": 0.3},
        {"tipo": "deslize", "t": 2.5},
    ],
}


def ler(p):
    with wave.open(str(p), "rb") as w:
        return w.getframerate(), w.getnchannels(), w.getsampwidth(), w.getnframes(), w.readframes(w.getnframes())


@unittest.skipUnless(HAS_NUMPY, "numpy ausente (use tools/.venv/bin/python)")
class Trilha(unittest.TestCase):
    def gerar(self, spec, dur=DUR):
        d = pathlib.Path(tempfile.mkdtemp())
        return trilha.gerar(spec, dur, d)

    def test_gera_tres_wavs(self):
        r = self.gerar(SPEC)
        self.assertEqual(set(r), {"ambiente", "musica", "efeitos"})
        for p in r.values():
            sr, ch, sw, n, _ = ler(p)
            self.assertEqual((sr, ch, sw), (48000, 2, 2))
            self.assertLessEqual(abs(n - int(48000 * DUR)), 1)

    def test_deterministico(self):
        a, b = self.gerar(SPEC), self.gerar(SPEC)
        for k in a:
            self.assertEqual(ler(a[k])[4], ler(b[k])[4], k)

    def test_eventos_depois_do_fim(self):
        spec = copy.deepcopy(SPEC)
        spec["efeitos"].append({"tipo": "baque", "t": 99, "ganho": 1.0})
        spec["efeitos"].append({"tipo": "tique", "tempos": [98, 99.5]})
        a, b = self.gerar(SPEC), self.gerar(spec)
        self.assertEqual(ler(a["efeitos"])[4], ler(b["efeitos"])[4])

    def test_silencio_sem_camadas(self):
        spec = copy.deepcopy(SPEC)
        spec["ambiente"] = {}
        r = self.gerar(spec)
        dados = ler(r["ambiente"])[4]
        self.assertEqual(dados, bytes(len(dados)))

    def test_tom_invalido(self):
        spec = copy.deepcopy(SPEC)
        spec["musica"]["tom"] = "do_maior"
        with self.assertRaises(ValueError) as c:
            self.gerar(spec)
        self.assertIn("tom", str(c.exception))

    def test_efeito_desconhecido(self):
        spec = copy.deepcopy(SPEC)
        spec["efeitos"] = [{"tipo": "buzina", "t": 1}]
        with self.assertRaises(ValueError) as c:
            self.gerar(spec)
        self.assertIn("tipo", str(c.exception))


if __name__ == "__main__":
    unittest.main()
