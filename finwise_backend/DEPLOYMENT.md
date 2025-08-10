# 🚀 FinWise Backend - Production Deployment Guide

## 📋 Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Nginx (optional)
- Docker & Docker Compose (optional)

## 🔧 Quick Production Setup

### 1. Install Production Dependencies

```bash
pip install -r requirements_production.txt
```

### 2. Set Environment Variables

Copy the template and configure:
```bash
cp env.production.template .env.production
# Edit .env.production with your actual values
```

### 3. Run Production Setup

```bash
python manage_production.py deploy
```

### 4. Start Production Server

```bash
python manage_production.py start
```

## 🐳 Docker Deployment (Recommended)

### 1. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### 2. Individual Docker Commands

```bash
# Build backend image
docker build -t finwise-backend .

# Run backend only
docker run -p 8000:8000 --env-file .env.production finwise-backend
```

## 🌐 Manual Server Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3.11 python3.11-venv python3.11-dev
sudo apt install -y postgresql postgresql-contrib redis-server nginx

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate
```

### 2. Database Setup

```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE finwise_prod;
CREATE USER finwise_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE finwise_prod TO finwise_user;
\q
```

### 3. Application Setup

```bash
# Install Python dependencies
pip install -r requirements_production.txt

# Run migrations
python manage_production.py migrate

# Collect static files
python manage_production.py collect-static

# Create superuser
python manage_production.py superuser
```

### 4. Gunicorn Service

Create `/etc/systemd/system/finwise.service`:

```ini
[Unit]
Description=FinWise Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/finwise_backend
Environment="PATH=/path/to/finwise_backend/venv/bin"
Environment="DJANGO_SETTINGS_MODULE=finwise_backend.settings_production"
ExecStart=/path/to/finwise_backend/venv/bin/gunicorn --config gunicorn.conf.py finwise_backend.wsgi_production:application
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable finwise
sudo systemctl start finwise
sudo systemctl status finwise
```

### 5. Nginx Configuration

Create `/etc/nginx/sites-available/finwise`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location /static/ {
        alias /path/to/finwise_backend/staticfiles/;
    }

    location /media/ {
        alias /path/to/finwise_backend/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/finwise /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Security Checklist

- [ ] Change `DJANGO_SECRET_KEY`
- [ ] Set `DEBUG = False`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Enable HTTPS with SSL certificates
- [ ] Set secure cookie flags
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable logging and monitoring

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check application health
python manage_production.py health-check

# Check service status
sudo systemctl status finwise
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis
```

### Logs

```bash
# Application logs
tail -f logs/django.log

# System logs
sudo journalctl -u finwise -f
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Maintenance

```bash
# Backup database
pg_dump -h localhost -U finwise_user finwise_prod > backup.sql

# Restore database
psql -h localhost -U finwise_user finwise_prod < backup.sql
```

## 🚨 Troubleshooting

### Common Issues

1. **Static files not loading**
   - Run `python manage_production.py collect-static`
   - Check Nginx configuration

2. **Database connection errors**
   - Verify PostgreSQL is running
   - Check database credentials
   - Ensure database exists

3. **Permission errors**
   - Check file ownership
   - Verify user permissions

4. **Port conflicts**
   - Check if port 8000 is available
   - Use different port in configuration

### Performance Tuning

- Adjust Gunicorn workers based on CPU cores
- Configure Redis for caching
- Optimize database queries
- Enable compression in Nginx

## 📞 Support

For deployment issues:
1. Check logs for error messages
2. Verify environment variables
3. Test individual components
4. Review security checklist

---

**🎉 Your FinWise backend is now production-ready!** 