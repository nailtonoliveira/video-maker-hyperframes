"""Gera a trilha procedural do episódio Ariane 5 em assets/audio/ (ambiente, música e efeitos sintetizados).

Determinística: ruídos do ffmpeg com semente fixa e síntese em numpy. Os tempos são os mesmos de episode/ariane5.js.
Uso:  tools/.venv/bin/python niches/tech-lore/lab/kit-3d/episode/ariane5_audio.py
"""
import math
import pathlib
import subprocess
import wave

import numpy as np

SR = 48000
L = 48.28
N = int(SR * L)
T = np.arange(N) / SR
OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "audio"


def ff_noise(color, seed, filt):
    """Ruído colorido do ffmpeg (semente fixa) passando por uma cadeia de filtros."""
    cmd = ["ffmpeg", "-v", "error", "-f", "lavfi", "-i", f"anoisesrc=c={color}:seed={seed}:d={L}:r={SR}:a=0.5,{filt}",
           "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"]
    x = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).astype(np.float64)
    x = np.pad(x, (0, max(0, N - len(x))))[:N]
    return x / (np.sqrt(np.mean(x ** 2)) + 1e-9)


def env(segments):
    """Envelope por trechos: (a, b, nível[, subida, descida]) com rampas lineares."""
    e = np.zeros(N)
    for s in segments:
        a, b, lvl = s[:3]
        up = s[3] if len(s) > 3 else 0.08
        down = s[4] if len(s) > 4 else 0.08
        k = np.clip((T - a) / up, 0, 1) * np.clip((b - T) / down, 0, 1)
        e = np.maximum(e, lvl * k)
    return e


def one_shot(dur, fn):
    t = np.arange(int(SR * dur)) / SR
    return fn(t)


def place(track, at, x, gain=1.0):
    i = int(at * SR)
    if i >= N:
        return
    n = min(len(x), N - i)
    track[i:i + n] += gain * x[:n]


def jshash(i, k):
    """Mesmo hash do kit (kit/core.js): fract(sin(i·127.1 + k·311.7)·43758.5453)."""
    x = math.sin(i * 127.1 + k * 311.7) * 43758.5453
    return x - math.floor(x)


def write(name, x, peak=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    st = np.repeat(pcm[:, None], 2, axis=1)
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(st.tobytes())
    rms = 20 * math.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
    print(f"{name}: pico {peak:.2f}, rms {rms:.1f} dBFS")


rng = np.random.default_rng(501)

# ==================== ambiente ====================
roar = ff_noise("brown", 1, "lowpass=f=170,lowpass=f=170") + 0.35 * ff_noise("pink", 2, "bandpass=f=520:width_type=h:w=420")
wind = ff_noise("pink", 3, "lowpass=f=520,highpass=f=90")
hiss = ff_noise("white", 4, "highpass=f=5200")
hum = 0.5 * np.sin(2 * np.pi * 50 * T) + 0.25 * np.sin(2 * np.pi * 100 * T) + 0.12 * np.sin(2 * np.pi * 150 * T) + 0.05 * hiss
roar_env = env([
    (2.0, 5.34, 0.4, 0.05, 0.05), (5.34, 8.28, 0.22, 0.05, 0.3),          # gancho: estrondo distante
    (12.18, 14.66, 1.0, 0.7, 0.05), (14.66, 17.96, 0.85, 0.05, 0.08),     # ignição e subida
    (17.96, 21.5, 0.6, 0.05, 0.12),                                       # T+36, mergulho
    (35.94, 38.48, 1.0, 0.05, 0.05), (38.48, 39.09, 0.75, 0.05, 0.02),    # motores no ângulo máximo
])
wind_env = env([(2.0, 8.28, 0.3), (8.28, 12.18, 0.55), (12.18, 17.96, 0.25), (17.96, 21.5, 0.35), (38.48, 40.86, 0.35, 0.05, 0.4)])
hum_env = env([(0, 2.0, 0.4, 0.001, 0.05), (21.5, 35.94, 0.45, 0.25, 0.08), (40.86, L, 0.4, 0.2, 0.001)])
# tremor de alarme no zumbido depois da falha
alarm = 1 + 0.5 * np.where((T > 28.24) & (T < 35.94), np.sin(2 * np.pi * 2 * T), 0)
write("ambiente.wav", roar * roar_env + 0.6 * wind * wind_env + 0.55 * hum * hum_env * alarm, 0.7)

# ==================== música: drone em lá menor ====================
def voice(f, amp, lfo_period, phase=0.0):
    # dente-de-serra suave (4 harmônicos) com batimento lento; períodos dividem L (loop sem salto)
    p = L / max(1, round(L / lfo_period))
    a = amp * (0.75 + 0.25 * np.sin(2 * np.pi * T / p + phase))
    return a * sum(np.sin(2 * np.pi * f * k * T) / k for k in range(1, 5))

drone = voice(55, 1.0, 9.0) + voice(55.2, 0.6, 7.0, 1.0) + voice(82.41, 0.55, 11.0, 2.0) + voice(110, 0.35, 6.0) + voice(130.81, 0.3, 8.0, 0.5)
bright = voice(164.81, 0.25, 6.5) + voice(220, 0.18, 5.0, 1.5)
drone_env = env([(0, 8.28, 0.8, 0.001, 0.4), (8.28, 17.96, 0.55, 0.3, 0.3), (17.96, 36.0, 0.75, 0.2, 0.2), (36.0, 39.09, 0.9, 0.1, 0.03),
                 (42.9, L, 0.8, 3.0, 0.001)])
bright_env = env([(8.28, 17.96, 0.8, 0.8, 0.5)])
# batida a 120 bpm durante a falha, crescendo
tau = np.mod(T - 17.96, 0.5)
kick = np.sin(2 * np.pi * (45 * tau + 2 * (1 - np.exp(-tau * 30)))) * np.exp(-tau * 9)
tick_t = np.mod(T - 18.21, 0.5)
ticks = rng.standard_normal(N) * np.exp(-tick_t * 70) * 0.25
pulse_env = env([(17.96, 35.94, 1.0, 0.3, 0.1)]) * (0.55 + 0.45 * np.clip((T - 17.96) / 18, 0, 1))
# subida até a desintegração, depois silêncio
k = np.clip((T - 35.94) / (39.09 - 35.94), 0, 1)
riser = np.sin(2 * np.pi * np.cumsum(110 + 330 * k ** 2) / SR) * k ** 2 * env([(35.94, 39.09, 1.0, 0.1, 0.02)])
music = drone * drone_env + bright * bright_env + 1.4 * kick * pulse_env + ticks * pulse_env + 0.6 * riser
write("musica.wav", music, 0.7)

# ==================== efeitos sintetizados ====================
fx = np.zeros(N)
# trava da escotilha (20.30) e gaveta deslizando (20.55–21.0)
clank = one_shot(0.5, lambda t: sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in [(420, 1, 14), (1130, 0.6, 22), (2310, 0.4, 30), (95, 0.8, 18)]))
place(fx, 20.31, clank, 0.8)
slide_n = rng.standard_normal(int(SR * 0.45))
slide = np.convolve(slide_n, np.ones(40) / 40, mode="same") * np.sin(np.linspace(0, np.pi, len(slide_n)))
place(fx, 20.56, slide, 1.2)
# ignição: baque grave
thump = one_shot(1.2, lambda t: np.sin(2 * np.pi * (38 * t + 3 * (1 - np.exp(-t * 20)))) * np.exp(-t * 3.5))
place(fx, 12.2, thump, 1.0)
# rachadura do registrador (28.24): estalo + baque
crack = one_shot(0.35, lambda t: rng.standard_normal(len(t)) * np.exp(-t * 28)) + one_shot(0.35, lambda t: np.sin(2 * np.pi * 70 * t) * np.exp(-t * 10))
place(fx, 28.25, crack, 0.9)
# faíscas nos processadores que travam
def zap(seed):
    r = np.random.default_rng(seed)
    n = int(SR * 0.45)
    t = np.arange(n) / SR
    gate = (r.random(n // 240 + 1) > 0.55).repeat(240)[:n]
    hp = np.diff(r.standard_normal(n + 1))
    return hp * gate * np.exp(-t * 6) * 0.6 + np.sin(2 * np.pi * 120 * t) * np.exp(-t * 8) * 0.5
place(fx, 31.43, zap(7), 1.0)
place(fx, 32.83, zap(8), 1.0)
# um clique por bit que cai na placa (mesma física de kit/props.js: ejectAt 29.38)
click = one_shot(0.03, lambda t: np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 260) + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 180) * 0.5)
for i in range(16, 64):
    row, col = divmod(i, 16)
    vy = 4 + 4 * jshash(i, 1)
    land = 29.38 + (row - 1) * 0.06 + col * 0.004 + vy / 9
    place(fx, land, click, 0.25 + 0.2 * jshash(i, 40))
# clique de cada bit nascendo em onda (22.22, 0.012 s por célula), bem baixo
tick = one_shot(0.02, lambda t: np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 300))
for i in range(64):
    place(fx, 22.22 + i * 0.012 + 0.09, tick, 0.12)
write("efeitos.wav", fx, 0.85)
