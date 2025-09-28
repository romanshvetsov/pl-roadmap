# PL-Roadmap - Инструкции по запуску

## Быстрый старт

### 1. Клонирование и настройка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd pl-roadmap2

# Сделайте скрипт запуска исполняемым
chmod +x start.sh
```

### 2. Настройка окружения

```bash
# Скопируйте файл конфигурации
cp backend/env.example backend/.env

# Отредактируйте настройки в backend/.env
# Особенно важно изменить SECRET_KEY на случайную строку
```

### 3. Запуск через Docker

```bash
# Запустите все сервисы
./start.sh

# Или вручную:
docker-compose up -d
```

### 4. Доступ к приложению

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432 (postgres/postgres)

## Локальная разработка

### Backend

```bash
cd backend

# Создайте виртуальное окружение
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate     # Windows

# Установите зависимости
pip install -r requirements.txt

# Настройте переменные окружения
cp env.example .env
# Отредактируйте .env файл

# Инициализируйте базу данных
python init_db.py

# Запустите сервер
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

# Установите зависимости
npm install

# Запустите сервер разработки
npm run dev
```

## Структура проекта

```
pl-roadmap2/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Конфигурация и безопасность
│   │   ├── models/         # SQLAlchemy модели
│   │   ├── schemas/        # Pydantic схемы
│   │   └── services/       # Бизнес логика
│   ├── alembic/            # Миграции БД
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Утилиты
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Docker конфигурация
└── start.sh               # Скрипт запуска
```

## Основные функции

### ✅ Реализовано

- **Аутентификация**: Регистрация, вход, JWT токены
- **Мультитенантность**: Изолированные рабочие пространства
- **Управление проектами**: Создание, редактирование, удаление
- **Управление командой**: Приглашение пользователей, роли
- **Аналитика**: Дашборд с метриками и графиками
- **Настройки**: Профиль, организация, уведомления
- **Биллинг**: Тарифные планы, история платежей
- **Современный UI**: Responsive дизайн с Tailwind CSS

### 🔄 В разработке

- **Фичи и метрики**: Связывание фич с продуктовыми метриками
- **Финансовое моделирование**: Расчет P&L на основе метрик
- **Сценарии**: Моделирование различных комбинаций
- **Оптимизация**: Алгоритмы поиска оптимальных решений
- **Интеграции**: Stripe, SendGrid, корпоративные системы

## API Endpoints

### Аутентификация
- `POST /api/v1/auth/register` - Регистрация
- `POST /api/v1/auth/login` - Вход
- `GET /api/v1/auth/me` - Текущий пользователь

### Проекты
- `GET /api/v1/projects` - Список проектов
- `POST /api/v1/projects` - Создание проекта
- `GET /api/v1/projects/{id}` - Получение проекта
- `PUT /api/v1/projects/{id}` - Обновление проекта
- `DELETE /api/v1/projects/{id}` - Удаление проекта

### Команда
- `GET /api/v1/users` - Список пользователей
- `POST /api/v1/users` - Приглашение пользователя
- `PUT /api/v1/users/{id}` - Обновление пользователя
- `DELETE /api/v1/users/{id}` - Удаление пользователя

### Организация
- `GET /api/v1/tenants/me` - Текущая организация
- `PUT /api/v1/tenants/me` - Обновление организации

## Технологический стек

### Backend
- **FastAPI** - высокопроизводительный API
- **PostgreSQL** - основная база данных
- **Redis** - кэширование и сессии
- **Celery** - асинхронные задачи
- **SQLAlchemy** - ORM
- **Alembic** - миграции БД

### Frontend
- **Next.js 14** - React фреймворк
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **React Query** - управление состоянием
- **Recharts** - графики и визуализация

### Инфраструктура
- **Docker** - контейнеризация
- **Stripe** - платежная система
- **SendGrid** - email уведомления

## Развертывание в продакшн

### 1. Подготовка сервера

```bash
# Установите Docker и Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установите Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Настройка окружения

```bash
# Скопируйте проект на сервер
scp -r pl-roadmap2/ user@server:/opt/

# Настройте переменные окружения
cd /opt/pl-roadmap2/backend
cp env.example .env
nano .env  # Отредактируйте настройки
```

### 3. Запуск

```bash
# Запустите приложение
cd /opt/pl-roadmap2
./start.sh

# Проверьте статус
docker-compose ps
```

### 4. Настройка домена

```nginx
# Nginx конфигурация
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Мониторинг и логи

```bash
# Просмотр логов
docker-compose logs -f backend
docker-compose logs -f frontend

# Мониторинг ресурсов
docker stats

# Бэкап базы данных
docker-compose exec postgres pg_dump -U postgres pl_roadmap > backup.sql
```

## Поддержка

Для получения поддержки:
1. Создайте issue в репозитории
2. Опишите проблему и шаги для воспроизведения
3. Приложите логи и конфигурацию

## Лицензия

MIT License - см. файл LICENSE для подробностей.

