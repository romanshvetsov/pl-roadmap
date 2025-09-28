from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# Base schemas
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseSchema):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: str = "viewer"

class UserCreate(UserBase):
    password: str
    tenant_id: Optional[UUID] = None

class UserUpdate(BaseSchema):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: UUID
    is_active: bool
    tenant_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

# Tenant schemas
class TenantBase(BaseSchema):
    name: str
    subdomain: str

class TenantCreate(TenantBase):
    pass

class TenantUpdate(BaseSchema):
    name: Optional[str] = None
    plan: Optional[str] = None
    status: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class Tenant(TenantBase):
    id: UUID
    plan: str
    status: str
    trial_ends_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    settings: Dict[str, Any]

# Project schemas
class ProjectBase(BaseSchema):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None

class Project(ProjectBase):
    id: UUID
    tenant_id: UUID
    owner_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

# Feature schemas
class FeatureBase(BaseSchema):
    name: str
    description: Optional[str] = None
    priority: int = 1
    effort_estimate: Optional[float] = None
    impact_score: Optional[float] = None
    dependencies: List[UUID] = []

class FeatureCreate(FeatureBase):
    project_id: UUID

class FeatureUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[int] = None
    effort_estimate: Optional[float] = None
    impact_score: Optional[float] = None
    dependencies: Optional[List[UUID]] = None

class Feature(FeatureBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

# Metric schemas
class MetricBase(BaseSchema):
    name: str
    description: Optional[str] = None
    metric_type: Optional[str] = None
    current_value: Optional[float] = None
    target_value: Optional[float] = None
    unit: Optional[str] = None

class MetricCreate(MetricBase):
    project_id: UUID

class MetricUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    metric_type: Optional[str] = None
    current_value: Optional[float] = None
    target_value: Optional[float] = None
    unit: Optional[str] = None

class Metric(MetricBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

# Metric Impact schemas
class MetricImpactBase(BaseSchema):
    impact_type: str
    impact_value: float
    confidence: float = 0.5

class MetricImpactCreate(MetricImpactBase):
    feature_id: UUID
    metric_id: UUID

class MetricImpact(MetricImpactBase):
    id: UUID
    feature_id: UUID
    metric_id: UUID
    created_at: datetime

# Scenario schemas
class ScenarioBase(BaseSchema):
    name: str
    description: Optional[str] = None
    feature_selection: List[UUID] = []
    timeline_months: int = 12
    resource_allocation: Dict[str, Any] = {}
    assumptions: Dict[str, Any] = {}

class ScenarioCreate(ScenarioBase):
    project_id: UUID

class ScenarioUpdate(BaseSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    feature_selection: Optional[List[UUID]] = None
    timeline_months: Optional[int] = None
    resource_allocation: Optional[Dict[str, Any]] = None
    assumptions: Optional[Dict[str, Any]] = None

class Scenario(ScenarioBase):
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

# Authentication schemas
class Token(BaseSchema):
    access_token: str
    token_type: str

class TokenData(BaseSchema):
    email: Optional[str] = None

class LoginRequest(BaseSchema):
    email: EmailStr
    password: str

class RegisterRequest(BaseSchema):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    tenant_name: Optional[str] = None

