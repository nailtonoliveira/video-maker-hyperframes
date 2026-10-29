"""Gera a trilha procedural de um vídeo (ambiente, música e efeitos) a partir de assets/episode/trilha.json.

Determinística: ruídos do ffmpeg com semente fixa e síntese em numpy. Tempos absolutos, em segundos do vídeo.
Uso:  tools/.venv/bin/python shared/trilha/trilha.py <pasta-do-video>
Esquema do JSON: ver README.md. Importável: gerar(spec, duracao, saida).
"""
import math
import pathlib
import re
import subprocess
import sys
import wave

import numpy as np

SR = 48000
PICOS = {"ambiente": 0.7, "musica": 0.7, "efeitos": 0.85}

# Acorde do drone em lá menor (freq, amplitude, período do LFO, fase) e brilho; os outros tons transpõem em semitons.
DRONE = [(55, 1.0, 9.0, 0.0), (55.2, 0.6, 7.0, 1.0), (82.41, 0.55, 11.0, 2.0), (110, 0.35, 6.0, 0.0), (130.81, 0.3, 8.0, 0.5)]
BRILHO = [(164.81, 0.25, 6.5, 0.0), (220, 0.18, 5.0, 1.5)]
TONS = {"la_menor": 0, "re_menor": 5, "mi_menor": 7}


class Ctx:
    """Duração e eixo de tempo compartilhados pelas funções de síntese."""

    def __init__(self, duracao):
        self.L = float(duracao)
        self.N = int(SR * self.L)
        self.T = np.arange(self.N) / SR


def ff_noise(c, cor, seed, filt):
    """Ruído colorido do ffmpeg (semente fixa) passando por uma cadeia de filtros, normalizado a RMS 1."""
    cmd = ["ffmpeg", "-v", "error", "-f", "lavfi", "-i", f"anoisesrc=c={cor}:seed={seed}:d={c.L}:r={SR}:a=0.5,{filt}",
           "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"]
    x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).astype(np.float64)
    x = np.pad(x, (0, max(0, c.N - len(x))))[:c.N]
    return x / (np.sqrt(np.mean(x ** 2)) + 1e-9)


def env(c, segments):
    """Envelope por trechos: [a, b, nível[, subida, descida]] com rampas lineares."""
    e = np.zeros(c.N)
    for s in segments or []:
        a, b, lvl = s[:3]
        up = s[3] if len(s) > 3 else 0.08
        down = s[4] if len(s) > 4 else 0.08
        k = np.clip((c.T - a) / up, 0, 1) * np.clip((b - c.T) / down, 0, 1)
        e = np.maximum(e, lvl * k)
    return e


def one_shot(dur, fn):
    t = np.arange(int(SR * dur)) / SR
    return fn(t)


def place(c, track, at, x, gain=1.0):
    """Soma x na faixa a partir de `at` s; o que passa do fim é cortado, antes do início é ignorado."""
    i = int(at * SR)
    if i < 0 or i >= c.N:
        return
    n = min(len(x), c.N - i)
    track[i:i + n] += gain * x[:n]


def write(path, x, peak):
    """Grava WAV 48 kHz estéreo 16 bits normalizado ao pico; com sinal nulo grava zeros. Devolve o RMS em dBFS."""
    m = np.max(np.abs(x)) if len(x) else 0.0
    x = x / m * peak if m > 0 else np.zeros_like(x)
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    st = np.repeat(pcm[:, None], 2, axis=1)
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(st.tobytes())
    return 20 * math.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)


# ==================== ambiente ====================
def ambiente(c, spec, semente):
    cam = spec or {}
    out = np.zeros(c.N)
    s = semente * 10
    if "ronco" in cam:
        roar = ff_noise(c, "brown", s + 1, "lowpass=f=170,lowpass=f=170") + 0.35 * ff_noise(c, "pink", s + 2, "bandpass=f=520:width_type=h:w=420")
        out += roar * env(c, cam["ronco"].get("env"))
    if "vento" in cam:
        wind = ff_noise(c, "pink", s + 3, "lowpass=f=520,highpass=f=90")
        out += 0.6 * wind * env(c, cam["vento"].get("env"))
    if "zumbido" in cam:
        z = cam["zumbido"]
        hiss = ff_noise(c, "white", s + 4, "highpass=f=5200")
        T = c.T
        hum = 0.5 * np.sin(2 * np.pi * 50 * T) + 0.25 * np.sin(2 * np.pi * 100 * T) + 0.12 * np.sin(2 * np.pi * 150 * T) + 0.05 * hiss
        dentro = np.zeros(c.N, bool)
        for a, b in z.get("alarme", []):
            dentro |= (T > a) & (T < b)
        alarm = 1 + 0.5 * np.where(dentro, np.sin(2 * np.pi * 2 * T), 0)
        out += 0.55 * hum * env(c, z.get("env")) * alarm
    return out


# ==================== música ====================
def voz(c, f, amp, lfo_period, phase=0.0):
    """Dente-de-serra suave (4 harmônicos) com batimento lento; períodos dividem L (loop sem salto)."""
    p = c.L / max(1, round(c.L / lfo_period))
    a = amp * (0.75 + 0.25 * np.sin(2 * np.pi * c.T / p + phase))
    return a * sum(np.sin(2 * np.pi * f * k * c.T) / k for k in range(1, 5))


def musica(c, spec, semente):
    m = spec or {}
    tom = m.get("tom", "la_menor")
    if tom not in TONS:
        raise ValueError(f'tom "{tom}" desconhecido (disponíveis: {", ".join(TONS)})')
    r = 2 ** (TONS[tom] / 12)
    T = c.T
    out = np.zeros(c.N)
    if "drone" in m:
        out += sum(voz(c, f * r, a, p, ph) for f, a, p, ph in DRONE) * env(c, m["drone"].get("env"))
    if "brilho" in m:
        out += sum(voz(c, f * r, a, p, ph) for f, a, p, ph in BRILHO) * env(c, m["brilho"].get("env"))
    if "pulso" in m:
        p = m["pulso"]
        ini, fim = p["inicio"], p["fim"]
        per = 60.0 / p.get("bpm", 120)
        tau = np.mod(T - ini, per)
        kick = np.sin(2 * np.pi * (45 * tau + 2 * (1 - np.exp(-tau * 30)))) * np.exp(-tau * 9)
        tick_t = np.mod(T - (ini + per / 2), per)
        rng = np.random.default_rng(semente)
        ticks = rng.standard_normal(c.N) * np.exp(-tick_t * 70) * 0.25
        penv = env(c, [[ini, fim, 1.0, 0.3, 0.1]]) * (0.55 + 0.45 * np.clip((T - ini) / max(fim - ini, 1e-6), 0, 1))
        out += 1.4 * kick * penv + ticks * penv
    if "subida" in m:
        ini, fim = m["subida"]["inicio"], m["subida"]["fim"]
        k = np.clip((T - ini) / max(fim - ini, 1e-6), 0, 1)
        riser = np.sin(2 * np.pi * np.cumsum((110 + 330 * k ** 2) * r) / SR) * k ** 2 * env(c, [[ini, fim, 1.0, 0.1, 0.02]])
        out += 0.6 * riser
    return out


# ==================== efeitos ====================
def _trava(rng):
    return one_shot(0.5, lambda t: sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in [(420, 1, 14), (1130, 0.6, 22), (2310, 0.4, 30), (95, 0.8, 18)]))


def _deslize(rng):
    n = rng.standard_normal(int(SR * 0.45))
    return np.convolve(n, np.ones(40) / 40, mode="same") * np.sin(np.linspace(0, np.pi, len(n)))


def _baque(rng):
    return one_shot(1.2, lambda t: np.sin(2 * np.pi * (38 * t + 3 * (1 - np.exp(-t * 20)))) * np.exp(-t * 3.5))


def _estalo(rng):
    return one_shot(0.35, lambda t: rng.standard_normal(len(t)) * np.exp(-t * 28)) + one_shot(0.35, lambda t: np.sin(2 * np.pi * 70 * t) * np.exp(-t * 10))


def _faisca(rng):
    n = int(SR * 0.45)
    t = np.arange(n) / SR
    gate = (rng.random(n // 240 + 1) > 0.55).repeat(240)[:n]
    hp = np.diff(rng.standard_normal(n + 1))
    return hp * gate * np.exp(-t * 6) * 0.6 + np.sin(2 * np.pi * 120 * t) * np.exp(-t * 8) * 0.5


def _clique(rng):
    return one_shot(0.03, lambda t: np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 260) + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 180) * 0.5)


def _tique(rng):
    return one_shot(0.02, lambda t: np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 300))


EFEITOS = {"trava": _trava, "deslize": _deslize, "baque": _baque, "estalo": _estalo,
           "faisca": _faisca, "clique": _clique, "tique": _tique}


def efeitos(c, lista, semente):
    fx = np.zeros(c.N)
    for idx, ev in enumerate(lista or []):
        tipo = ev.get("tipo")
        if tipo not in EFEITOS:
            raise ValueError(f'efeito {idx}: tipo "{tipo}" desconhecido (disponíveis: {", ".join(EFEITOS)})')
        tempos = ev["tempos"] if "tempos" in ev else [ev["t"]]
        g = ev.get("ganho", 1.0)
        ganhos = g if isinstance(g, list) else [g] * len(tempos)  # ganho pode ser uma lista, um por tempo
        rng = np.random.default_rng(semente + idx)
        for t, gi in zip(tempos, ganhos):
            place(c, fx, t, EFEITOS[tipo](rng), gi)
    return fx


def _gerar(spec, duracao, saida):
    c = Ctx(duracao)
    semente = int(spec.get("semente", 0))
    saida = pathlib.Path(saida)
    camadas = {"ambiente": ambiente(c, spec.get("ambiente"), semente),
               "musica": musica(c, spec.get("musica"), semente),
               "efeitos": efeitos(c, spec.get("efeitos"), semente)}
    res = {}
    for nome, x in camadas.items():
        p = saida / f"{nome}.wav"
        res[nome] = (p, write(p, x, PICOS[nome]))
    return res


def gerar(spec, duracao, saida):
    """Gera ambiente.wav, musica.wav e efeitos.wav em `saida`. Devolve {nome: caminho}."""
    return {k: v[0] for k, v in _gerar(spec, duracao, saida).items()}


def duracao_do_index(html):
    m = re.search(r'data-composition-id="main"[^>]*?data-duration="([\d.]+)"', html, re.S)
    if not m:
        raise ValueError("index.html sem raiz data-composition-id=\"main\" com data-duration")
    return float(m.group(1))


def main(argv):
    if len(argv) != 2:
        print("uso: trilha.py <pasta-do-video>", file=sys.stderr)
        return 1
    video = pathlib.Path(argv[1])
    js, idx = video / "assets" / "episode" / "trilha.json", video / "index.html"
    for p in (js, idx):
        if not p.is_file():
            print(f"trilha: falta {p}", file=sys.stderr)
            return 1
    import json
    try:
        dur = duracao_do_index(idx.read_text(encoding="utf-8"))
        res = _gerar(json.loads(js.read_text(encoding="utf-8")), dur, video / "assets" / "audio")
    except ValueError as e:
        print(f"trilha: {e}", file=sys.stderr)
        return 1
    for nome, (p, rms) in res.items():
        print(f"{p.name}: pico {PICOS[nome]:.2f}, rms {rms:.1f} dBFS")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
