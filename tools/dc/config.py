"""Caminhos, .env, configuração do nicho e ambiente (Node 22, venv) para os subprocessos."""
import copy, json, os, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
TOOLS = ROOT / "tools"
NICHES = ROOT / "niches"
VENV_PY = TOOLS / ".venv" / "bin" / "python"
FIXTURES = TOOLS / "fixtures" / "ensaio"

DEFAULT_NICHE = {
    "nome": "",
    "idioma": "pt-BR",
    "duracao_alvo_s": 45,
    "palavras_por_segundo": 2.3,
    "llm": {
        "provedor": "gemini",                 # gemini (API) | claude (API) | antigravity (agy, assinatura Google)
        "modelo_criativo": "gemini-flash-latest", # temas e roteiro
        "modelo_rapido": "gemini-flash-latest",   # texto TTS e metadados
        "modelo_embeddings": "gemini-embedding-001",
        "pesquisa": True,                     # busca do Google para checar fatos (temas, roteiro)
    },
    "voz": {
        "motor": "elevenlabs",
        "voice_id": "",
        "model_id": "eleven_multilingual_v2",
        "output_format": "mp3_44100_128",
        "stability": 0.5,
        "similarity_boost": 0.75,
        "style": 0.0,
        "speed": 1.0,
        "use_speaker_boost": True,
        "regras_texto": "",
    },
    "whisper": {"modelo": "base"},
    "plataformas": ["youtube", "tiktok", "instagram", "facebook"],
    "claude_code": {
        "modelo": None,                       # None = o padrão do seu Claude Code
        "modo_permissao": "acceptEdits",
        "ferramentas": [
            "Read", "Write", "Edit", "Glob", "Grep", "Skill",
            "Bash(npx:*)", "Bash(npm:*)", "Bash(node:*)", "Bash(ffprobe:*)", "Bash(ffmpeg:*)",
            "Bash(python3:*)", "Bash(ls:*)", "Bash(cat:*)", "Bash(head:*)", "Bash(tail:*)",
            "Bash(grep:*)", "Bash(find:*)", "Bash(mkdir:*)", "Bash(cp:*)", "Bash(mv:*)", "Bash(wc:*)",
        ],
    },
    "aprovacoes": ["roteiro", "voz", "cenas", "metadados"],
}


def load_env():
    """Carrega ROOT/.env em os.environ sem sobrescrever o que já está definido."""
    env_file = ROOT / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        v = v.strip().strip('"').strip("'")
        if v:
            os.environ.setdefault(k.strip(), v)


def _merge(base, over):
    out = copy.deepcopy(base)
    for k, v in over.items():
        out[k] = _merge(out[k], v) if isinstance(v, dict) and isinstance(out.get(k), dict) else v
    return out


def niche_dir(nicho):
    d = NICHES / nicho
    if not d.is_dir():
        raise SystemExit(f"nicho não encontrado: niches/{nicho}")
    return d


def load_niche(nicho):
    d = niche_dir(nicho)
    f = d / "niche.json"
    cfg = _merge(DEFAULT_NICHE, json.loads(f.read_text(encoding="utf-8")) if f.exists() else {})
    cfg["_id"] = nicho
    cfg["_dir"] = d
    return cfg


def rel(p):
    try:
        return str(pathlib.Path(p).resolve().relative_to(ROOT))
    except ValueError:
        return str(p)


def node_bin():
    """Pasta bin do Node exigido pelo .nvmrc (via nvm), ou None se o Node do PATH já serve."""
    want = (ROOT / ".nvmrc").read_text().strip() if (ROOT / ".nvmrc").exists() else "22"
    versions = pathlib.Path.home() / ".nvm" / "versions" / "node"
    cands = sorted(versions.glob(f"v{want}.*"), key=lambda p: [int(x) for x in re.findall(r"\d+", p.name)])
    return cands[-1] / "bin" if cands else None


def sub_env(drop_anthropic_key=False):
    """Ambiente dos subprocessos: Node 22 na frente do PATH; opcionalmente sem a chave da API do Claude."""
    env = dict(os.environ)
    nb = node_bin()
    if nb:
        env["PATH"] = f"{nb}:{env.get('PATH', '')}"
    if drop_anthropic_key:
        env.pop("ANTHROPIC_API_KEY", None)
    return env
