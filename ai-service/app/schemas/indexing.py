from pydantic import BaseModel
from typing import List


class FileItem(BaseModel):
    path: str
    content: str


class IndexRequest(BaseModel):
    repo_id: str
    files: List[FileItem]


class IndexResponse(BaseModel):
    status: str
    files_indexed: int
    chunks_indexed: int