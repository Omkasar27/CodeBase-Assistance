from fastapi import APIRouter, Depends
from app.core.security import verify_internal_api_key
from app.core.config import settings
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/", response_model=HealthResponse, dependencies=[Depends(verify_internal_api_key)])
async def get_health():
    return HealthResponse(
        status="ok",
        service="ai-codebase-assistant-ai-service",
        environment=settings.environment,
    )