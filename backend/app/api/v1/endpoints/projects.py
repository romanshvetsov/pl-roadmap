from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models import User, Tenant, Project, Feature, Metric, Scenario
from app.schemas import (
    TenantCreate, TenantUpdate, Tenant as TenantSchema,
    ProjectCreate, ProjectUpdate, Project as ProjectSchema,
    FeatureCreate, FeatureUpdate, Feature as FeatureSchema,
    MetricCreate, MetricUpdate, Metric as MetricSchema,
    ScenarioCreate, ScenarioUpdate, Scenario as ScenarioSchema
)

router = APIRouter()

# Tenant endpoints
@router.get("/tenants/me", response_model=TenantSchema)
async def get_current_tenant(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tenant = db.query(Tenant).filter(Tenant.id == current_user.tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant

@router.put("/tenants/me", response_model=TenantSchema)
async def update_current_tenant(
    tenant_update: TenantUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tenant = db.query(Tenant).filter(Tenant.id == current_user.tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    
    if current_user.role not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    for field, value in tenant_update.dict(exclude_unset=True).items():
        setattr(tenant, field, value)
    
    db.commit()
    db.refresh(tenant)
    return tenant

# Project endpoints
@router.get("/projects", response_model=List[ProjectSchema])
async def get_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    projects = db.query(Project).filter(Project.tenant_id == current_user.tenant_id).all()
    return projects

@router.post("/projects", response_model=ProjectSchema)
async def create_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["owner", "admin", "editor"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_project = Project(
        **project.dict(),
        tenant_id=current_user.tenant_id,
        owner_id=current_user.id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/projects/{project_id}", response_model=ProjectSchema)
async def get_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/projects/{project_id}", response_model=ProjectSchema)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.role not in ["owner", "admin", "editor"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    for field, value in project_update.dict(exclude_unset=True).items():
        setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    return project

@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.role not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

# Feature endpoints
@router.get("/projects/{project_id}/features", response_model=List[FeatureSchema])
async def get_features(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify project belongs to user's tenant
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    features = db.query(Feature).filter(Feature.project_id == project_id).all()
    return features

@router.post("/projects/{project_id}/features", response_model=FeatureSchema)
async def create_feature(
    project_id: str,
    feature: FeatureCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify project belongs to user's tenant
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.role not in ["owner", "admin", "editor"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_feature = Feature(**feature.dict(), project_id=project_id)
    db.add(db_feature)
    db.commit()
    db.refresh(db_feature)
    return db_feature

# Metric endpoints
@router.get("/projects/{project_id}/metrics", response_model=List[MetricSchema])
async def get_metrics(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify project belongs to user's tenant
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    metrics = db.query(Metric).filter(Metric.project_id == project_id).all()
    return metrics

@router.post("/projects/{project_id}/metrics", response_model=MetricSchema)
async def create_metric(
    project_id: str,
    metric: MetricCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify project belongs to user's tenant
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.role not in ["owner", "admin", "editor"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_metric = Metric(**metric.dict(), project_id=project_id)
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric

# Scenario endpoints
@router.get("/projects/{project_id}/scenarios", response_model=List[ScenarioSchema])
async def get_scenarios(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify project belongs to user's tenant
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    scenarios = db.query(Scenario).filter(Scenario.project_id == project_id).all()
    return scenarios

@router.post("/projects/{project_id}/scenarios", response_model=ScenarioSchema)
async def create_scenario(
    project_id: str,
    scenario: ScenarioCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify project belongs to user's tenant
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.tenant_id == current_user.tenant_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.role not in ["owner", "admin", "editor"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_scenario = Scenario(**scenario.dict(), project_id=project_id)
    db.add(db_scenario)
    db.commit()
    db.refresh(db_scenario)
    return db_scenario

