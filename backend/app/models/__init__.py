from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey, Integer, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class Tenant(Base):
    __tablename__ = "tenants"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    subdomain = Column(String(100), unique=True, nullable=False)
    plan = Column(String(50), default="trial")  # trial, basic, pro, enterprise
    status = Column(String(50), default="active")  # active, suspended, cancelled
    trial_ends_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    settings = Column(JSON, default={})
    
    # Relationships
    users = relationship("User", back_populates="tenant")
    projects = relationship("Project", back_populates="tenant")

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    role = Column(String(50), default="viewer")  # owner, admin, editor, viewer
    is_active = Column(Boolean, default=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tenant = relationship("Tenant", back_populates="users")
    projects = relationship("Project", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    tenant = relationship("Tenant", back_populates="projects")
    owner = relationship("User", back_populates="projects")
    features = relationship("Feature", back_populates="project")
    metrics = relationship("Metric", back_populates="project")
    scenarios = relationship("Scenario", back_populates="project")

class Feature(Base):
    __tablename__ = "features"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    priority = Column(Integer, default=1)  # 1-5 scale
    effort_estimate = Column(Float)  # in story points or hours
    impact_score = Column(Float)  # 1-10 scale
    dependencies = Column(JSON, default=[])  # list of feature IDs
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="features")
    metric_impacts = relationship("MetricImpact", back_populates="feature")

class Metric(Base):
    __tablename__ = "metrics"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    metric_type = Column(String(50))  # user_growth, retention, conversion, revenue
    current_value = Column(Float)
    target_value = Column(Float)
    unit = Column(String(50))  # users, %, $, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="metrics")
    metric_impacts = relationship("MetricImpact", back_populates="metric")
    financial_impacts = relationship("FinancialImpact", back_populates="metric")

class MetricImpact(Base):
    __tablename__ = "metric_impacts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    feature_id = Column(UUID(as_uuid=True), ForeignKey("features.id"), nullable=False)
    metric_id = Column(UUID(as_uuid=True), ForeignKey("metrics.id"), nullable=False)
    impact_type = Column(String(50))  # increase, decrease, neutral
    impact_value = Column(Float)  # percentage or absolute value
    confidence = Column(Float, default=0.5)  # 0-1 confidence level
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    feature = relationship("Feature", back_populates="metric_impacts")
    metric = relationship("Metric", back_populates="metric_impacts")

class FinancialImpact(Base):
    __tablename__ = "financial_impacts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_id = Column(UUID(as_uuid=True), ForeignKey("metrics.id"), nullable=False)
    impact_type = Column(String(50))  # revenue, cost, profit
    impact_value = Column(Float)  # monetary value
    calculation_method = Column(String(100))  # formula or description
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    metric = relationship("Metric", back_populates="financial_impacts")

class Scenario(Base):
    __tablename__ = "scenarios"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    feature_selection = Column(JSON, default=[])  # selected feature IDs
    timeline_months = Column(Integer, default=12)
    resource_allocation = Column(JSON, default={})  # team size, budget allocation
    assumptions = Column(JSON, default={})  # market conditions, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    project = relationship("Project", back_populates="scenarios")
    calculations = relationship("ScenarioCalculation", back_populates="scenario")

class ScenarioCalculation(Base):
    __tablename__ = "scenario_calculations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scenario_id = Column(UUID(as_uuid=True), ForeignKey("scenarios.id"), nullable=False)
    calculation_type = Column(String(50))  # pnl, roi, payback_period
    result_value = Column(Float)
    calculation_details = Column(JSON, default={})
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    scenario = relationship("Scenario", back_populates="calculations")

