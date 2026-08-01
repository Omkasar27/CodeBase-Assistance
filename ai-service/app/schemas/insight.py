from pydantic import BaseModel
from typing import List, Optional


class TechStack(BaseModel):
    languages: List[str] = []
    frameworks: List[str] = []
    packageManagers: List[str] = []


class SummaryRequest(BaseModel):
    repo_name: str
    description: Optional[str] = ""
    readme_content: Optional[str] = ""
    tech_stack: TechStack


class SummaryResponse(BaseModel):
    summary: str


class ModuleCandidate(BaseModel):
    name: str
    path: str
    files: List[str]


class ArchitectureRequest(BaseModel):
    repo_name: str
    tech_stack: TechStack
    entry_points: List[str]
    modules: List[ModuleCandidate]


class ModuleResult(BaseModel):
    name: str
    path: str
    purpose: str
    importantFiles: List[str]


class ArchitectureResponse(BaseModel):
    architecture_overview: str
    modules: List[ModuleResult]

class RouteInfo(BaseModel):
    method: str
    path: str
    controller: str


class ApiRoutesRequest(BaseModel):
    repo_name: str
    routes: List[RouteInfo]


class ApiRoutesResponse(BaseModel):
    descriptions: List[str]


class ModuleSummary(BaseModel):
    name: str
    path: str
    purpose: str


class RoadmapRequest(BaseModel):
    repo_name: str
    summary: Optional[str] = ""
    tech_stack: TechStack
    modules: List[ModuleSummary]
    api_route_count: int
    entry_points: List[str]


class RoadmapStep(BaseModel):
    order: int
    title: str
    description: str
    relatedModules: List[str] = []


class RoadmapResponse(BaseModel):
    roadmap: List[RoadmapStep]