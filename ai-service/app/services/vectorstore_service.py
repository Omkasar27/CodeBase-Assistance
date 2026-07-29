import chromadb
from chromadb.config import Settings as ChromaSettings
from app.core.config import settings

_client = None



def get_chroma_client():
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(
            path=settings.chroma_persist_directory,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
    return _client

def get_or_create_collection(repo_id: str):
    client = get_chroma_client()
    collection_name = f"repo_{repo_id}"
    return client.get_or_create_collection(name=collection_name)


def reset_collection(repo_id: str):
    client = get_chroma_client()
    collection_name = f"repo_{repo_id}"
    try:
        client.delete_collection(name=collection_name)
    except Exception:
        pass  # Collection didn't exist yet — nothing to delete
    return client.create_collection(name=collection_name)


def add_chunks_to_collection(repo_id: str, chunks: list[dict], embeddings: list[list[float]]):
    collection = get_or_create_collection(repo_id)

    ids = [f"{repo_id}_{i}" for i in range(len(chunks))]
    documents = [chunk["text"] for chunk in chunks]
    metadatas = [chunk["metadata"] for chunk in chunks]

    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )