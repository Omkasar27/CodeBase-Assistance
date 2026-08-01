from fastapi import FastAPI
from app.api.routes import health, indexing, query, insight

app = FastAPI(
    title="AI Codebase Assistant - AI Service",
    description="Internal service for repository indexing and RAG-based Q&A",
    version="1.0.0",
)

app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(indexing.router, prefix="/indexing", tags=["Indexing"])
app.include_router(query.router, prefix="/query", tags=["Query"])
app.include_router(insight.router, prefix="/insights", tags=["Insights"])


@app.get("/")
async def root():
    return {"message": "AI Codebase Assistant - AI Service is running"}