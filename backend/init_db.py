#!/usr/bin/env python3
"""
Скрипт для инициализации базы данных PL-Roadmap
"""

import asyncio
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from app.core.config import settings
from app.core.database import Base
from app.models import *  # Import all models

def init_db():
    """Инициализация базы данных"""
    print("Создание таблиц в базе данных...")
    
    # Создаем движок
    engine = create_engine(settings.DATABASE_URL)
    
    # Создаем все таблицы
    Base.metadata.create_all(bind=engine)
    
    print("✅ Таблицы созданы успешно!")
    print(f"База данных: {settings.DATABASE_URL}")

if __name__ == "__main__":
    init_db()

