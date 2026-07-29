from pydantic import BaseModel
from typing import List, Optional, Literal


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class QueryRequest(BaseModel):
    repo_id: str
    question: str
    chat_history: Optional[List[ChatMessage]] = []