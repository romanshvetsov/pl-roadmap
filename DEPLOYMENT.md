# Deployment Guide

## Production Deployment

### Prerequisites
- Docker and Docker Compose installed
- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- Database backup strategy

### Environment Setup

1. **Create production environment file:**
```bash
cp backend/env.example backend/.env.production
```

2. **Update production configuration:**
```env
# Database
DATABASE_URL=postgresql://username:password@db-host:5432/pl_roadmap_prod

# Security
SECRET_KEY=your-super-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Redis
REDIS_URL=redis://redis-host:6379/0

# CORS
CORS_ORIGINS=["https://yourdomain.com"]

# Email (for production)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USERNAME=your-email@domain.com
SMTP_PASSWORD=your-email-password

# Stripe (for billing)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Docker Production Setup

1. **Create production docker-compose:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: pl_roadmap_prod
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/pl_roadmap_prod
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  frontend:
    build: ./frontend
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

2. **Create nginx configuration:**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:3000;
    }

    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### Deployment Steps

1. **Clone repository on production server:**
```bash
git clone https://github.com/romanshvetsov/pl-roadmap.git
cd pl-roadmap
```

2. **Set up environment:**
```bash
cp backend/env.example backend/.env.production
# Edit .env.production with production values
```

3. **Deploy with Docker Compose:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

4. **Initialize database:**
```bash
docker-compose -f docker-compose.prod.yml exec backend python init_db.py
```

5. **Set up SSL certificate:**
```bash
# Using Let's Encrypt
certbot --nginx -d yourdomain.com
```

### Monitoring and Maintenance

1. **Log monitoring:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

2. **Database backups:**
```bash
# Daily backup script
docker-compose exec postgres pg_dump -U postgres pl_roadmap_prod > backup_$(date +%Y%m%d).sql
```

3. **Health checks:**
```bash
curl https://yourdomain.com/health
curl https://yourdomain.com/api/v1/health
```

### Scaling

For high-traffic deployments:

1. **Horizontal scaling:**
```yaml
services:
  backend:
    deploy:
      replicas: 3
  
  frontend:
    deploy:
      replicas: 2
```

2. **Load balancer:**
```yaml
services:
  nginx:
    ports:
      - "80:80"
      - "443:443"
    deploy:
      replicas: 2
```

### Security Considerations

1. **Environment variables:** Never commit production secrets
2. **Database security:** Use strong passwords and network isolation
3. **SSL/TLS:** Always use HTTPS in production
4. **Rate limiting:** Implement API rate limiting
5. **Backup encryption:** Encrypt database backups
6. **Access control:** Limit SSH access to production servers

### Troubleshooting

1. **Service not starting:**
```bash
docker-compose logs service-name
docker-compose ps
```

2. **Database connection issues:**
```bash
docker-compose exec postgres psql -U postgres -d pl_roadmap_prod
```

3. **Frontend build issues:**
```bash
docker-compose exec frontend npm run build
```

### Performance Optimization

1. **Database indexing:** Ensure proper indexes on frequently queried columns
2. **Caching:** Use Redis for session storage and API caching
3. **CDN:** Use CDN for static assets
4. **Database connection pooling:** Configure appropriate connection pool sizes
5. **Monitoring:** Set up application performance monitoring (APM)
