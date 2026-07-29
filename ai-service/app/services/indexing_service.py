from app.services.chunking_service import chunk_file
from app.services.embedding_service import generate_embeddings
from app.services.vectorstore_service import reset_collection, add_chunks_to_collection
from app.schemas.indexing import FileItem


def index_repository(repo_id: str, files: list[FileItem]) -> dict:
    all_chunks = []

    for file in files:
        file_chunks = chunk_file(file.path, file.content)
        all_chunks.extend(file_chunks)

    if not all_chunks:
        return {
            "status": "completed",
            "files_indexed": 0,
            "chunks_indexed": 0,
        }

    texts = [chunk["text"] for chunk in all_chunks]
    embeddings = generate_embeddings(texts)

    reset_collection(repo_id)
    add_chunks_to_collection(repo_id, all_chunks, embeddings)

    return {
        "status": "completed",
        "files_indexed": len(files),
        "chunks_indexed": len(all_chunks),
    }