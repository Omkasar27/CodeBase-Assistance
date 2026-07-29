import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.core.security import verify_internal_api_key
from app.schemas.query import QueryRequest
from app.services.retrieval_service import retrieve_relevant_chunks
from app.services.prompt_service import build_messages
from app.services.llm_service import stream_completion

router = APIRouter()


def sse_event(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


@router.post("/", dependencies=[Depends(verify_internal_api_key)])
async def query_repo(payload: QueryRequest):
    def generate():
        chunks = retrieve_relevant_chunks(payload.repo_id, payload.question)

        sources = [{"file_path": chunk["file_path"]} for chunk in chunks]
        yield sse_event("sources", {"sources": sources})

        messages = build_messages(payload.question, chunks, payload.chat_history)

        try:
            for token in stream_completion(messages):
                yield sse_event("chunk", {"content": token})
        except Exception as e:
            print(f"LLM streaming error: {e}")
            yield sse_event("error", {"message": "Failed to generate a response."})
            return

        yield sse_event("done", {})

    return StreamingResponse(generate(), media_type="text/event-stream")