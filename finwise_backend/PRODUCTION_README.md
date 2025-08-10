# 🚀 FinWise Production Environment

This document provides comprehensive instructions for setting up and managing the FinWise application in production.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Nginx       │    │   Django        │
│   (React)       │◄──►│   (Port 80)     │◄──►│   (Port 8000)   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   PostgreSQL    │    │     Redis       │
                       │   (Port 5432)   │    │   (Port 6379)   │
                       └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- macOS with Homebrew
- Python 3.13+
- Node.js 18+
- PostgreSQL 15
- Redis 8+
- Nginx 1.29+

## 🚀 Quick Start

### 1. Start Complete Production Environment
```bash
cd finwise_backend
./start_production_complete.sh
```

### 2. Check Status
```bash
./status_production.sh
```

### 3. Stop Production Environment
```bash
./stop_production_complete.sh
```

## 🔧 Manual Setup

### 1. Install Dependencies
```bash
# Install system services
brew install postgresql@15 redis nginx

# Install Python dependencies
cd finwise_backend
source venv/bin/activate
pip install -r requirements_production.txt
```

### 2. Configure Database
```bash
# Start PostgreSQL
brew services start postgresql@15

# Create database and user (if not exists)
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
createdb finwise_prod
createuser -s finwise_user
psql -d finwise_prod -c "ALTER USER finwise_user WITH PASSWORD 'finwise_password';"
```

### 3. Configure Redis
```bash
# Start Redis
brew services start redis
```

### 4. Configure Nginx
```bash
# Copy configuration
sudo cp nginx_finwise.conf /opt/homebrew/etc/nginx/servers/

# Test configuration
sudo nginx -t

# Start Nginx
brew services start nginx
```

### 5. Setup Django
```bash
# Run migrations
python manage.py migrate --settings=finwise_backend.settings_production

# Collect static files
python manage.py collectstatic --noinput --settings=finwise_backend.settings_production

# Create superuser (optional)
python manage.py createsuperuser --settings=finwise_backend.settings_production
```

### 6. Start Backend
```bash
# Start Gunicorn
gunicorn --bind 127.0.0.1:8000 finwise_backend.wsgi_production:application --daemon
```

## 🌐 Access URLs

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8000/api/
- **Admin Interface**: http://localhost:80/admin/
- **Direct Backend**: http://localhost:8000/

## 📊 Management Commands

### Production Scripts
```bash
# Start everything
./start_production_complete.sh

# Stop everything
./stop_production_complete.sh

# Check status
./status_production.sh
```

### Individual Services
```bash
# PostgreSQL
brew services start postgresql@15
brew services stop postgresql@15
brew services restart postgresql@15

# Redis
brew services start redis
brew services stop redis
brew services restart redis

# Nginx
brew services start nginx
brew services stop nginx
sudo nginx -s reload

# Django Backend
python manage_production.py start
python manage_production.py stop
python manage_production.py status
```

### Django Management
```bash
# Run with production settings
python manage.py [command] --settings=finwise_backend.settings_production

# Common commands
python manage.py migrate --settings=finwise_backend.settings_production
python manage.py collectstatic --noinput --settings=finwise_backend.settings_production
python manage.py createsuperuser --settings=finwise_backend.settings_production
python manage.py check --settings=finwise_backend.settings_production
```

## 🔍 Monitoring & Logs

### Service Logs
```bash
# Nginx logs
tail -f /opt/homebrew/var/log/nginx/access.log
tail -f /opt/homebrew/var/log/nginx/error.log

# Django logs
tail -f logs/django.log

# PostgreSQL logs
tail -f /opt/homebrew/var/log/postgresql@15.log

# Redis logs
tail -f /opt/homebrew/var/log/redis.log
```

### Process Monitoring
```bash
# Check all services
ps aux | grep -E "(nginx|postgres|redis|gunicorn)"

# Check ports
lsof -i :80    # Nginx
lsof -i :8000  # Django
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>
```

#### 2. Database Connection Failed
```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Test connection
psql -h localhost -U finwise_user -d finwise_prod
```

#### 3. Redis Connection Failed
```bash
# Check Redis status
brew services list | grep redis

# Test connection
redis-cli ping
```

#### 4. Nginx Configuration Error
```bash
# Test configuration
sudo nginx -t

# Check error logs
tail -f /opt/homebrew/var/log/nginx/error.log
```

#### 5. Static Files Not Loading
```bash
# Recollect static files
python manage.py collectstatic --noinput --settings=finwise_backend.settings_production

# Check permissions
ls -la staticfiles/
```

### Performance Tuning

#### Gunicorn Workers
```bash
# Calculate optimal workers: (2 x CPU cores) + 1
# For 4 cores: 9 workers
gunicorn --workers 9 --bind 127.0.0.1:8000 finwise_backend.wsgi_production:application
```

#### Nginx Optimization
```bash
# Enable gzip compression (already configured)
# Enable caching (already configured)
# Monitor performance
ab -n 1000 -c 10 http://localhost:80/
```

## 🔒 Security Considerations

### Production Checklist
- [ ] Change default database passwords
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set secure headers
- [ ] Enable logging and monitoring
- [ ] Regular security updates

### Environment Variables
```bash
# Critical production variables
DJANGO_SECRET_KEY=your-super-secret-key-here
DB_PASSWORD=your-database-password
REDIS_PASSWORD=your-redis-password
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer for multiple backend instances
- Database read replicas
- Redis cluster for caching
- CDN for static files

### Vertical Scaling
- Increase worker processes
- Optimize database queries
- Enable connection pooling
- Monitor resource usage

## 🆘 Support

### Emergency Commands
```bash
# Stop everything immediately
./stop_production_complete.sh

# Restart everything
./stop_production_complete.sh && ./start_production_complete.sh

# Check system resources
top -l 1
df -h
free -h
```

### Log Locations
- Django: `finwise_backend/logs/django.log`
- Nginx: `/opt/homebrew/var/log/nginx/`
- PostgreSQL: `/opt/homebrew/var/log/postgresql@15.log`
- Redis: `/opt/homebrew/var/log/redis.log`

---

**🎯 Your FinWise production environment is now ready!**

For additional support, check the main README.md and TROUBLESHOOTING.md files. 