from app.services.embedding_service import generate_embeddings
from app.services.vectorstore_service import get_or_create_collection
from app.core.config import settings


def retrieve_relevant_chunks(repo_id: str, question: str) -> list[dict]:
    collection = get_or_create_collection(repo_id)

    if collection.count() == 0:
        return []

    question_embedding = generate_embeddings([question])[0]

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=min(settings.retrieval_top_k, collection.count()),
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    return [
        {"text": doc, "file_path": meta["file_path"]}
        for doc, meta in zip(documents, metadatas)
    ]