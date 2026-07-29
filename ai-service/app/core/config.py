from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    host: str = "0.0.0.0"
    port: int = 8000
    environment: str = "development"
    internal_api_key: str

    embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    chroma_persist_directory: str = "./chroma_data"

    groq_api_key: str
    groq_model: str = "llama-3.3-70b-versatile"
    retrieval_top_k: int = 5

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)


settings = Settings()