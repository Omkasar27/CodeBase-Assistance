from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    Language,
)

EXTENSION_LANGUAGE_MAP = {
    ".py": Language.PYTHON,
    ".js": Language.JS,
    ".jsx": Language.JS,
    ".ts": Language.TS,
    ".tsx": Language.TS,
    ".java": Language.JAVA,
    ".go": Language.GO,
    ".rb": Language.RUBY,
    ".php": Language.PHP,
    ".cpp": Language.CPP,
    ".c": Language.CPP,
    ".rs": Language.RUST,
    ".kt": Language.KOTLIN,
    ".md": Language.MARKDOWN,
}

CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


def get_splitter_for_file(path: str) -> RecursiveCharacterTextSplitter:
    extension = path[path.rfind("."):]
    language = EXTENSION_LANGUAGE_MAP.get(extension)

    if language:
        return RecursiveCharacterTextSplitter.from_language(
            language=language,
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
        )

    return RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )


def chunk_file(path: str, content: str) -> list[dict]:
    splitter = get_splitter_for_file(path)
    raw_chunks = splitter.split_text(content)

    return [
        {
            "text": chunk,
            "metadata": {
                "file_path": path,
                "chunk_index": i,
            },
        }
        for i, chunk in enumerate(raw_chunks)
    ]