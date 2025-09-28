#!/usr/bin/env bash

# Скрипт для запуска PL-Roadmap

echo "🚀 Запуск PL-Roadmap..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Пожалуйста, установите Docker и Docker Compose."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose."
    exit 1
fi

# Создаем .env файл если его нет
if [ ! -f backend/.env ]; then
    echo "📝 Создание файла конфигурации..."
    cp backend/env.example backend/.env
    echo "⚠️  Пожалуйста, отредактируйте backend/.env файл с вашими настройками"
fi

# Запускаем сервисы
echo "🐳 Запуск Docker контейнеров..."
docker-compose up -d

# Ждем пока база данных будет готова
echo "⏳ Ожидание готовности базы данных..."
sleep 10

# Инициализируем базу данных
echo "🗄️  Инициализация базы данных..."
docker-compose exec backend python init_db.py

echo "✅ PL-Roadmap запущен!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Для остановки используйте: docker-compose down"

