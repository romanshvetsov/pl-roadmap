#!/usr/bin/env python3
"""
Скрипт для создания демонстрационных данных PL-Roadmap
"""

import asyncio
import sys
import os
from datetime import datetime, timedelta
import uuid

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models import *

def create_demo_data():
    """Создание демонстрационных данных"""
    print("Создание демонстрационных данных...")
    
    # Создаем движок
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Создаем демо тенант
        demo_tenant = Tenant(
            id=uuid.uuid4(),
            name="Демо Компания",
            subdomain="demo-company",
            plan="pro",
            status="active",
            trial_ends_at=datetime.utcnow() + timedelta(days=30),
            settings={"theme": "light", "timezone": "UTC"}
        )
        db.add(demo_tenant)
        db.flush()
        
        # Создаем демо пользователей
        demo_users = [
            User(
                id=uuid.uuid4(),
                email="admin@demo.com",
                hashed_password="$pbkdf2-sha256$29000$KMWYEwIA4LxX6v3f2/sfgw$0AHrZ1QDmZsYt1k9Voq4N9hsHYY9wBzWOY5ylXaHuog",  # password: admin123
                first_name="Админ",
                last_name="Пользователь",
                role="owner",
                tenant_id=demo_tenant.id,
                is_active=True
            ),
            User(
                id=uuid.uuid4(),
                email="product@demo.com",
                hashed_password="$pbkdf2-sha256$29000$KMWYEwIA4LxX6v3f2/sfgw$0AHrZ1QDmZsYt1k9Voq4N9hsHYY9wBzWOY5ylXaHuog",  # password: admin123
                first_name="Продакт",
                last_name="Менеджер",
                role="editor",
                tenant_id=demo_tenant.id,
                is_active=True
            ),
            User(
                id=uuid.uuid4(),
                email="analyst@demo.com",
                hashed_password="$pbkdf2-sha256$29000$KMWYEwIA4LxX6v3f2/sfgw$0AHrZ1QDmZsYt1k9Voq4N9hsHYY9wBzWOY5ylXaHuog",  # password: admin123
                first_name="Аналитик",
                last_name="Данных",
                role="viewer",
                tenant_id=demo_tenant.id,
                is_active=True
            )
        ]
        
        for user in demo_users:
            db.add(user)
        db.flush()
        
        # Создаем демо проекты
        demo_projects = [
            Project(
                id=uuid.uuid4(),
                name="Мобильное приложение",
                description="Разработка мобильного приложения для iOS и Android",
                tenant_id=demo_tenant.id,
                owner_id=demo_users[0].id
            ),
            Project(
                id=uuid.uuid4(),
                name="Веб-платформа",
                description="Создание веб-платформы для управления бизнесом",
                tenant_id=demo_tenant.id,
                owner_id=demo_users[1].id
            ),
            Project(
                id=uuid.uuid4(),
                name="API сервис",
                description="Разработка REST API для интеграции с внешними системами",
                tenant_id=demo_tenant.id,
                owner_id=demo_users[0].id
            )
        ]
        
        for project in demo_projects:
            db.add(project)
        db.flush()
        
        # Создаем демо фичи для первого проекта
        demo_features = [
            Feature(
                id=uuid.uuid4(),
                name="Push уведомления",
                description="Реализация push уведомлений для мобильного приложения",
                project_id=demo_projects[0].id,
                priority=5,
                effort_estimate=8.0,
                impact_score=8.5,
                dependencies=[]
            ),
            Feature(
                id=uuid.uuid4(),
                name="Социальные функции",
                description="Добавление возможности делиться контентом и взаимодействовать с другими пользователями",
                project_id=demo_projects[0].id,
                priority=4,
                effort_estimate=12.0,
                impact_score=7.0,
                dependencies=[]
            ),
            Feature(
                id=uuid.uuid4(),
                name="Персонализация",
                description="Система рекомендаций и персонализированный контент",
                project_id=demo_projects[0].id,
                priority=3,
                effort_estimate=15.0,
                impact_score=9.0,
                dependencies=[]
            ),
            Feature(
                id=uuid.uuid4(),
                name="Геймификация",
                description="Добавление элементов игры для повышения вовлеченности",
                project_id=demo_projects[0].id,
                priority=2,
                effort_estimate=10.0,
                impact_score=6.5,
                dependencies=[]
            )
        ]
        
        for feature in demo_features:
            db.add(feature)
        db.flush()
        
        # Создаем демо метрики
        demo_metrics = [
            Metric(
                id=uuid.uuid4(),
                name="MAU",
                description="Monthly Active Users - месячные активные пользователи",
                project_id=demo_projects[0].id,
                metric_type="user_growth",
                current_value=12500,
                target_value=15000,
                unit="users"
            ),
            Metric(
                id=uuid.uuid4(),
                name="Retention",
                description="Процент пользователей, возвращающихся через месяц",
                project_id=demo_projects[0].id,
                metric_type="retention",
                current_value=68,
                target_value=75,
                unit="%"
            ),
            Metric(
                id=uuid.uuid4(),
                name="Conversion",
                description="Процент пользователей, совершающих целевое действие",
                project_id=demo_projects[0].id,
                metric_type="conversion",
                current_value=12.5,
                target_value=15,
                unit="%"
            ),
            Metric(
                id=uuid.uuid4(),
                name="ARPU",
                description="Average Revenue Per User - средний доход с пользователя",
                project_id=demo_projects[0].id,
                metric_type="revenue",
                current_value=45.2,
                target_value=50,
                unit="$"
            )
        ]
        
        for metric in demo_metrics:
            db.add(metric)
        db.flush()
        
        # Создаем связи между фичами и метриками
        metric_impacts = [
            MetricImpact(
                id=uuid.uuid4(),
                feature_id=demo_features[0].id,  # Push уведомления
                metric_id=demo_metrics[0].id,     # MAU
                impact_type="increase",
                impact_value=15.0,
                confidence=0.85
            ),
            MetricImpact(
                id=uuid.uuid4(),
                feature_id=demo_features[1].id,  # Социальные функции
                metric_id=demo_metrics[1].id,     # Retention
                impact_type="increase",
                impact_value=8.0,
                confidence=0.72
            ),
            MetricImpact(
                id=uuid.uuid4(),
                feature_id=demo_features[2].id,  # Персонализация
                metric_id=demo_metrics[2].id,     # Conversion
                impact_type="increase",
                impact_value=12.0,
                confidence=0.90
            ),
            MetricImpact(
                id=uuid.uuid4(),
                feature_id=demo_features[3].id,  # Геймификация
                metric_id=demo_metrics[3].id,     # ARPU
                impact_type="increase",
                impact_value=20.0,
                confidence=0.65
            )
        ]
        
        for impact in metric_impacts:
            db.add(impact)
        
        # Создаем финансовые связи
        financial_impacts = [
            FinancialImpact(
                id=uuid.uuid4(),
                metric_id=demo_metrics[0].id,  # MAU
                impact_type="revenue",
                impact_value=12500 * 45.2,  # MAU * ARPU
                calculation_method="MAU * ARPU"
            ),
            FinancialImpact(
                id=uuid.uuid4(),
                metric_id=demo_metrics[3].id,  # ARPU
                impact_type="revenue",
                impact_value=45.2,
                calculation_method="Direct ARPU value"
            )
        ]
        
        for impact in financial_impacts:
            db.add(impact)
        
        # Создаем демо сценарии
        demo_scenarios = [
            Scenario(
                id=uuid.uuid4(),
                name="Консервативный план",
                description="Реализация только высокоприоритетных фич",
                project_id=demo_projects[0].id,
                feature_selection=[str(demo_features[0].id), str(demo_features[1].id)],
                timeline_months=6,
                resource_allocation={"developers": 3, "designers": 1, "qa": 1},
                assumptions={"market_growth": 0.05, "competition": "medium"}
            ),
            Scenario(
                id=uuid.uuid4(),
                name="Агрессивный план",
                description="Реализация всех фич с максимальными ресурсами",
                project_id=demo_projects[0].id,
                feature_selection=[str(f.id) for f in demo_features],
                timeline_months=12,
                resource_allocation={"developers": 6, "designers": 2, "qa": 2},
                assumptions={"market_growth": 0.15, "competition": "low"}
            ),
            Scenario(
                id=uuid.uuid4(),
                name="Оптимизированный план",
                description="Баланс между скоростью и качеством",
                project_id=demo_projects[0].id,
                feature_selection=[str(demo_features[0].id), str(demo_features[2].id)],
                timeline_months=8,
                resource_allocation={"developers": 4, "designers": 1, "qa": 1},
                assumptions={"market_growth": 0.10, "competition": "medium"}
            )
        ]
        
        for scenario in demo_scenarios:
            db.add(scenario)
        db.flush()
        
        # Создаем расчеты для сценариев
        scenario_calculations = [
            ScenarioCalculation(
                id=uuid.uuid4(),
                scenario_id=demo_scenarios[0].id,
                calculation_type="pnl",
                result_value=125000,
                calculation_details={"revenue": 150000, "costs": 25000, "profit": 125000}
            ),
            ScenarioCalculation(
                id=uuid.uuid4(),
                scenario_id=demo_scenarios[1].id,
                calculation_type="pnl",
                result_value=200000,
                calculation_details={"revenue": 300000, "costs": 100000, "profit": 200000}
            ),
            ScenarioCalculation(
                id=uuid.uuid4(),
                scenario_id=demo_scenarios[2].id,
                calculation_type="pnl",
                result_value=175000,
                calculation_details={"revenue": 225000, "costs": 50000, "profit": 175000}
            )
        ]
        
        for calc in scenario_calculations:
            db.add(calc)
        
        # Сохраняем все изменения
        db.commit()
        
        print("✅ Демонстрационные данные созданы успешно!")
        print(f"Тенант: {demo_tenant.name} ({demo_tenant.subdomain})")
        print(f"Пользователи: {len(demo_users)}")
        print(f"Проекты: {len(demo_projects)}")
        print(f"Фичи: {len(demo_features)}")
        print(f"Метрики: {len(demo_metrics)}")
        print(f"Сценарии: {len(demo_scenarios)}")
        print("\nДемо аккаунты:")
        print("- admin@demo.com / admin123 (Владелец)")
        print("- product@demo.com / admin123 (Редактор)")
        print("- analyst@demo.com / admin123 (Наблюдатель)")
        
    except Exception as e:
        print(f"❌ Ошибка создания демо данных: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_data()

