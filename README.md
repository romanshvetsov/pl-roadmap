# PL-Roadmap - SaaS для продуктового планирования

Современный SaaS сервис для связывания продуктовых метрик с финансовыми показателями P&L.

## Возможности

- 🎯 **Управление роадмапом** - создание и планирование фич
- 📊 **Продуктовые метрики** - связь фич с ключевыми показателями
- 💰 **Финансовое моделирование** - расчет P&L на основе метрик
- 🔄 **Сценарии и оптимизация** - поиск оптимальных решений
- 👥 **Мультитенантность** - изолированные рабочие пространства
- 💳 **Гибкие тарифы** - от триала до Enterprise
- 🔐 **Корпоративная аутентификация** - SAML, OAuth2, SSO

## Технологический стек

### Backend
- **FastAPI** - высокопроизводительный API
- **PostgreSQL** - основная база данных
- **Redis** - кэширование и сессии
- **Celery** - асинхронные задачи
- **SQLAlchemy** - ORM

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

## Быстрый старт

```bash
# Клонирование репозитория
git clone <repository-url>
cd pl-roadmap2

# Запуск через Docker Compose
docker-compose up -d

# Или локальная разработка
cd backend && pip install -r requirements.txt
cd ../frontend && npm install
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
│   └── requirements.txt
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Утилиты
│   └── package.json
├── docker-compose.yml      # Docker конфигурация
└── README.md
```

## Лицензия

MIT License

