from fastapi import APIRouter, Depends
from app.core.security import verify_internal_api_key
from app.schemas.insight import SummaryRequest, SummaryResponse
from app.services.summary_service import generate_repository_summary
from app.schemas.insight import (
    SummaryRequest, SummaryResponse, ArchitectureRequest, ArchitectureResponse,
)
from app.services.architecture_service import generate_architecture_overview
router = APIRouter()
from app.schemas.insight import ApiRoutesRequest, ApiRoutesResponse
from app.services.api_route_service import generate_route_descriptions
from app.schemas.insight import RoadmapRequest, RoadmapResponse
from app.services.roadmap_service import generate_learning_roadmap

@router.post(
    "/summary",
    response_model=SummaryResponse,
    dependencies=[Depends(verify_internal_api_key)],
)
async def create_summary(payload: SummaryRequest):
    summary = generate_repository_summary(
        payload.repo_name,
        payload.description,
        payload.readme_content,
        payload.tech_stack.dict(),
    )
    return SummaryResponse(summary=summary)

@router.post(
    "/architecture",
    response_model=ArchitectureResponse,
    dependencies=[Depends(verify_internal_api_key)],
)
async def create_architecture(payload: ArchitectureRequest):
    result = generate_architecture_overview(
        payload.repo_name,
        payload.tech_stack.dict(),
        payload.entry_points,
        [m.dict() for m in payload.modules],
    )
    return ArchitectureResponse(**result)

@router.post(
    "/api-routes",
    response_model=ApiRoutesResponse,
    dependencies=[Depends(verify_internal_api_key)],
)
async def create_api_route_descriptions(payload: ApiRoutesRequest):
    descriptions = generate_route_descriptions(
        payload.repo_name, [r.dict() for r in payload.routes]
    )
    return ApiRoutesResponse(descriptions=descriptions)

@router.post(
    "/roadmap",
    response_model=RoadmapResponse,
    dependencies=[Depends(verify_internal_api_key)],
)
async def create_roadmap(payload: RoadmapRequest):
    roadmap = generate_learning_roadmap(
        payload.repo_name,
        payload.summary,
        payload.tech_stack.dict(),
        [m.dict() for m in payload.modules],
        payload.api_route_count,
        payload.entry_points,
    )
    return RoadmapResponse(roadmap=roadmap)