from fastembed import TextEmbedding
from app.core.config import settings

_model = None


def get_embedding_model() -> TextEmbedding:
    global _model
    if _model is None:
        _model = TextEmbedding(model_name=settings.embedding_model_name)
    return _model


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    model = get_embedding_model()
    embeddings = list(model.embed(texts))
    return [emb.tolist() for emb in embeddings]