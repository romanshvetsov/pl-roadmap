# Development Guide

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker and Docker Compose
- Git

### Local Development Setup

1. **Clone the repository:**
```bash
git clone https://github.com/romanshvetsov/pl-roadmap.git
cd pl-roadmap
```

2. **Set up backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. **Set up frontend:**
```bash
cd frontend
npm install
```

4. **Set up environment:**
```bash
cp backend/env.example backend/.env
# Edit .env with your local settings
```

5. **Start services:**
```bash
# Using Docker Compose (recommended)
docker-compose up -d

# Or run services individually
# Backend
cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd frontend && npm run dev
```

## Project Structure

```
pl-roadmap/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   └── v1/         # API version 1
│   │   │       ├── api.py  # Main API router
│   │   │       └── endpoints/  # Individual endpoint modules
│   │   ├── core/           # Core functionality
│   │   │   ├── config.py   # Configuration
│   │   │   ├── database.py # Database connection
│   │   │   └── security.py # Security utilities
│   │   ├── models/         # SQLAlchemy models
│   │   └── schemas/        # Pydantic schemas
│   ├── alembic/            # Database migrations
│   └── tests/              # Backend tests
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Next.js pages
│   │   ├── styles/         # CSS styles
│   │   └── lib/            # Utility functions
│   └── public/             # Static assets
└── docs/                   # Documentation
```

## Development Workflow

### 1. Feature Development

1. **Create a new branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes:**
   - Backend: Add/modify API endpoints in `backend/app/api/v1/endpoints/`
   - Frontend: Add/modify components in `frontend/src/components/`
   - Database: Create migrations in `backend/alembic/versions/`

3. **Test your changes:**
```bash
# Backend tests
cd backend && pytest

# Frontend tests
cd frontend && npm test
```

4. **Commit your changes:**
```bash
git add .
git commit -m "feat: add your feature description"
```

5. **Push and create PR:**
```bash
git push origin feature/your-feature-name
# Create Pull Request on GitHub
```

### 2. Database Migrations

1. **Create a new migration:**
```bash
docker-compose exec backend alembic revision --autogenerate -m "Description of changes"
```

2. **Apply migrations:**
```bash
docker-compose exec backend alembic upgrade head
```

3. **Rollback migration:**
```bash
docker-compose exec backend alembic downgrade -1
```

### 3. API Development

#### Adding New Endpoints

1. **Create endpoint file:**
```python
# backend/app/api/v1/endpoints/your_endpoint.py
from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models import User

router = APIRouter()

@router.get("/your-endpoint")
async def your_endpoint(current_user: User = Depends(get_current_user)):
    return {"message": "Hello from your endpoint"}
```

2. **Add to main API router:**
```python
# backend/app/api/v1/api.py
from app.api.v1.endpoints import your_endpoint

api_router.include_router(
    your_endpoint.router,
    prefix="/your-endpoint",
    tags=["your-endpoint"]
)
```

#### Adding New Models

1. **Create model:**
```python
# backend/app/models/your_model.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class YourModel(Base):
    __tablename__ = "your_table"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

2. **Add to models init:**
```python
# backend/app/models/__init__.py
from .your_model import YourModel
```

3. **Create migration:**
```bash
docker-compose exec backend alembic revision --autogenerate -m "Add YourModel"
```

### 4. Frontend Development

#### Adding New Pages

1. **Create page component:**
```typescript
// frontend/src/pages/your-page.tsx
import { NextPage } from 'next'
import Layout from '../components/Layout'

const YourPage: NextPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Your Page</h1>
        {/* Your page content */}
      </div>
    </Layout>
  )
}

export default YourPage
```

#### Adding New Components

1. **Create component:**
```typescript
// frontend/src/components/YourComponent.tsx
import React from 'react'

interface YourComponentProps {
  title: string
  children?: React.ReactNode
}

const YourComponent: React.FC<YourComponentProps> = ({ title, children }) => {
  return (
    <div className="your-component">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  )
}

export default YourComponent
```

## Testing

### Backend Testing

```bash
cd backend
pytest                    # Run all tests
pytest tests/test_auth.py # Run specific test file
pytest -v                # Verbose output
pytest --cov=app         # Coverage report
```

### Frontend Testing

```bash
cd frontend
npm test                 # Run all tests
npm test -- --watch     # Watch mode
npm run test:coverage   # Coverage report
```

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Maximum line length: 88 characters
- Use Black for formatting: `black .`
- Use isort for imports: `isort .`

### TypeScript (Frontend)
- Use ESLint and Prettier
- Follow React best practices
- Use functional components with hooks
- Maximum line length: 100 characters

## Debugging

### Backend Debugging

1. **Enable debug mode:**
```env
DEBUG=true
LOG_LEVEL=debug
```

2. **Use debugger:**
```python
import pdb; pdb.set_trace()
```

3. **Check logs:**
```bash
docker-compose logs backend
```

### Frontend Debugging

1. **Use React DevTools**
2. **Browser DevTools**
3. **Console logging:**
```typescript
console.log('Debug info:', data)
```

## Performance Optimization

### Backend
- Use database indexes
- Implement caching with Redis
- Use connection pooling
- Optimize database queries

### Frontend
- Use React.memo for expensive components
- Implement code splitting
- Use lazy loading
- Optimize bundle size

## Security Considerations

1. **Never commit secrets**
2. **Use environment variables**
3. **Validate all inputs**
4. **Implement rate limiting**
5. **Use HTTPS in production**
6. **Regular security updates**

## Troubleshooting

### Common Issues

1. **Port already in use:**
```bash
# Find process using port
lsof -i :8000
# Kill process
kill -9 PID
```

2. **Database connection issues:**
```bash
# Check database status
docker-compose ps postgres
# Check logs
docker-compose logs postgres
```

3. **Frontend build issues:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [React Documentation](https://reactjs.org/docs)
