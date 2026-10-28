"""Catálogo de temas por nicho (niches/<nicho>/catalogo.json): o que já foi sugerido, produzido, publicado ou descartado.

Estados: sugerido → em_producao → produzido → pronto → publicado; ou descartado.
"""
import datetime, difflib, json, math

from . import align

ESTADOS = ("sugerido", "em_producao", "produzido", "pronto", "publicado", "descartado")


def agora():
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


class Catalogo:
    def __init__(self, niche_dir):
        self.dir = niche_dir
        self.file = niche_dir / "catalogo.json"
        self.data = json.loads(self.file.read_text(encoding="utf-8")) if self.file.exists() else {"temas": []}
        self.emb_file = niche_dir / ".embeddings.json"
        self._emb = json.loads(self.emb_file.read_text()) if self.emb_file.exists() else {}

    @property
    def temas(self):
        return self.data["temas"]

    def salvar(self):
        self.file.write_text(json.dumps(self.data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if self._emb:
            self.emb_file.write_text(json.dumps(self._emb))

    def get(self, tid):
        t = next((t for t in self.temas if t["id"] == tid.upper()), None)
        if not t:
            raise SystemExit(f"tema não encontrado: {tid}")
        return t

    def por_estado(self, *estados):
        return [t for t in self.temas if t["estado"] in estados]

    def novo_id(self):
        n = max((int(t["id"][1:]) for t in self.temas), default=0) + 1
        return f"T{n:03d}"

    def adicionar(self, tema, estado="sugerido"):
        t = {"id": self.novo_id(), "estado": estado, "criado_em": agora(), **tema}
        self.temas.append(t)
        return t

    def mudar(self, tid, estado, **extra):
        assert estado in ESTADOS, estado
        t = self.get(tid)
        t["estado"] = estado
        t["atualizado_em"] = agora()
        t.update(extra)
        return t

    def resumo_existentes(self):
        if not self.temas:
            return "(nenhum ainda)"
        return "\n".join(f"- [{t['estado']}] {t['titulo']}" for t in self.temas)

    # ---- repetição --------------------------------------------------------------------------
    @staticmethod
    def _texto(t):
        return f"{t['titulo']}. {t.get('resumo', '')}"

    def duplicado(self, cand, llm=None, lim_texto=0.72, lim_emb=0.86):
        """Tema existente parecido demais com `cand` (por texto e, se houver, por significado). → (tema, motivo) ou None."""
        a = " ".join(align.norm_tokens(cand["titulo"]))
        for t in self.temas:
            r = difflib.SequenceMatcher(None, a, " ".join(align.norm_tokens(t["titulo"]))).ratio()
            if r >= lim_texto:
                return t, f"título {r:.0%} igual"
        if not llm or not self.temas:
            return None
        faltam = [t for t in self.temas if t["id"] not in self._emb]
        if faltam:
            vecs = llm.embeddings([self._texto(t) for t in faltam])
            if vecs is None:
                return None
            for t, v in zip(faltam, vecs):
                self._emb[t["id"]] = v
        v = llm.embeddings([self._texto(cand)])
        if not v:
            return None
        best = max(((self._cos(v[0], self._emb[t["id"]]), t) for t in self.temas if t["id"] in self._emb),
                   key=lambda x: x[0], default=(0, None))
        return (best[1], f"significado {best[0]:.0%} parecido") if best[0] >= lim_emb else None

    def guardar_embedding(self, tid, llm, tema):
        v = llm.embeddings([self._texto(tema)]) if llm else None
        if v:
            self._emb[tid] = v[0]

    @staticmethod
    def _cos(a, b):
        dot = sum(x * y for x, y in zip(a, b))
        return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)) or 1)
