from fastapi import APIRouter, Depends
from app.core.security import verify_internal_api_key
from app.schemas.indexing import IndexRequest, IndexResponse
from app.services.indexing_service import index_repository

router = APIRouter()


@router.post("/index", response_model=IndexResponse, dependencies=[Depends(verify_internal_api_key)])
async def index_repo(payload: IndexRequest):
    result = index_repository(payload.repo_id, payload.files)
    return IndexResponse(**result)