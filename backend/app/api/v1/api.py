from fastapi import APIRouter
from app.api.v1.endpoints import auth, projects

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(projects.router, tags=["projects"])

