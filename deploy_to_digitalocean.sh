#!/bin/bash

# FinWise Deployment to DigitalOcean App Platform
# This script prepares the application for DigitalOcean deployment

set -e

echo "🚀 FinWise DigitalOcean Deployment"
echo "==================================="

# Check if doctl is installed
if ! command -v doctl &> /dev/null; then
    echo "❌ DigitalOcean CLI not found. Installing..."
    brew install doctl
fi

# Check if authenticated
if ! doctl auth list &> /dev/null; then
    echo "🔐 Please authenticate with DigitalOcean:"
    doctl auth init
fi

# Build frontend
echo "🏗️ Building frontend..."
cd project_frontend/projectv2_v
npm run build
cd ../../

# Copy frontend build to backend static directory
echo "📁 Copying frontend build..."
mkdir -p finwise_backend/staticfiles/frontend
cp -r project_frontend/projectv2_v/dist/* finwise_backend/staticfiles/frontend/

# Create Dockerfile for DigitalOcean
echo "🐳 Creating Dockerfile..."
cat > finwise_backend/Dockerfile << EOF
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=finwise_backend.settings_production

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    postgresql-client \\
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements_production.txt .
RUN pip install --no-cache-dir -r requirements_production.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput --settings=finwise_backend.settings_production

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "finwise_backend.wsgi_production", "--bind", "0.0.0.0:8000"]
EOF

# Create .dockerignore
echo "🚫 Creating .dockerignore..."
cat > finwise_backend/.dockerignore << EOF
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env
pip-log.txt
pip-delete-this-directory.txt
.tox
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis
.env
.venv
venv/
ENV/
env/
.idea/
.vscode/
*.swp
*.swo
*~
.DS_Store
EOF

# Create app.yaml for DigitalOcean
echo "📱 Creating app.yaml..."
cat > finwise_backend/app.yaml << EOF
name: finwise-app
services:
- name: finwise-backend
  source_dir: .
  github:
    repo: yourusername/finwise
    branch: main
  run_command: gunicorn finwise_backend.wsgi_production --bind 0.0.0.0:8000
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /api
  - path: /admin
  - path: /static
  - path: /media
  envs:
  - key: DJANGO_SETTINGS_MODULE
    value: finwise_backend.settings_production
  - key: SECRET_KEY
    value: your-secret-key-here
  - key: DEBUG
    value: "False"
  - key: ALLOWED_HOSTS
    value: ".ondigitalocean.app"
  - key: CORS_ALLOWED_ORIGINS
    value: "https://finwise-app-xxx.ondigitalocean.app"

- name: finwise-frontend
  source_dir: ../project_frontend/projectv2_v
  github:
    repo: yourusername/finwise
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
  envs:
  - key: REACT_APP_API_URL
    value: https://finwise-app-xxx.ondigitalocean.app/api

databases:
- name: finwise-db
  engine: PG
  version: "12"
  production: false

- name: finwise-redis
  engine: REDIS
  version: "6"
  production: false
EOF

# Create deployment instructions
echo "📋 Creating deployment instructions..."
cat > finwise_backend/DIGITALOCEAN_DEPLOYMENT.md << EOF
# DigitalOcean App Platform Deployment

## Prerequisites
1. DigitalOcean account
2. doctl CLI installed and authenticated
3. GitHub repository with your code

## Steps to Deploy

1. **Push your code to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Prepare for DigitalOcean deployment"
   git push origin main
   \`\`\`

2. **Create the app in DigitalOcean**
   - Go to DigitalOcean Console > Apps
   - Click "Create App"
   - Connect your GitHub repository
   - Select the branch (main)
   - Choose the source directory (finwise_backend)

3. **Configure the app**
   - Use the app.yaml configuration
   - Set environment variables
   - Configure databases (PostgreSQL and Redis)

4. **Deploy**
   - Click "Create Resources"
   - Wait for deployment to complete

## Environment Variables
- DJANGO_SETTINGS_MODULE: finwise_backend.settings_production
- SECRET_KEY: Your secret key
- DEBUG: False
- ALLOWED_HOSTS: .ondigitalocean.app
- CORS_ALLOWED_ORIGINS: Your app URL

## Database Configuration
- PostgreSQL: Automatically provisioned
- Redis: Automatically provisioned

## Monitoring
- Use DigitalOcean's built-in monitoring
- Set up alerts for errors and performance
EOF

echo "✅ DigitalOcean deployment files created!"
echo "📁 Files created:"
echo "  - Dockerfile"
echo "  - .dockerignore"
echo "  - app.yaml"
echo "  - DIGITALOCEAN_DEPLOYMENT.md"
echo ""
echo "🚀 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Follow the deployment instructions in DIGITALOCEAN_DEPLOYMENT.md"
echo "3. Deploy through DigitalOcean Console" 