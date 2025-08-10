#!/bin/bash
# FinWise Google Cloud Deployment Script
# This script deploys FinWise to Google Cloud Platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="${GOOGLE_CLOUD_PROJECT:-finwise-ai}"
REGION="${GOOGLE_CLOUD_REGION:-us-central1}"
ZONE="${GOOGLE_CLOUD_ZONE:-us-central1-a}"
SERVICE_NAME="finwise-backend"
FRONTEND_SERVICE="finwise-frontend"
DB_INSTANCE="finwise-db"
DB_NAME="finwise_db"
DB_USER="finwise_user"
DB_PASSWORD=""

echo -e "${BLUE}🚀 Welcome to FinWise Google Cloud Deployment!${NC}"
echo "=================================================="

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking deployment prerequisites...${NC}"
    
    # Check if gcloud is installed
    if ! command -v gcloud &> /dev/null; then
        echo -e "${RED}❌ Google Cloud SDK not found. Please install it first:${NC}"
        echo "   https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    # Check if user is authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        echo -e "${YELLOW}⚠️  Not authenticated with Google Cloud. Please run:${NC}"
        echo "   gcloud auth login"
        exit 1
    fi
    
    # Check if project is set
    if [ -z "$(gcloud config get-value project 2>/dev/null)" ]; then
        echo -e "${YELLOW}⚠️  No Google Cloud project selected. Please run:${NC}"
        echo "   gcloud config set project YOUR_PROJECT_ID"
        exit 1
    fi
    
    # Auto-detect current project if not explicitly set
    if [ "$PROJECT_NAME" = "finwise-ai" ]; then
        CURRENT_PROJECT=$(gcloud config get-value project)
        if [ ! -z "$CURRENT_PROJECT" ]; then
            PROJECT_NAME="$CURRENT_PROJECT"
            echo -e "${GREEN}✅ Using current project: $PROJECT_NAME${NC}"
        fi
    fi
    
    echo -e "${GREEN}✅ Prerequisites check completed${NC}"
}

# Function to create Google Cloud project
create_project() {
    echo -e "${YELLOW}🏗️  Setting up Google Cloud project...${NC}"
    
    # Create new project if it doesn't exist
    if ! gcloud projects describe $PROJECT_NAME &>/dev/null; then
        echo "Creating new project: $PROJECT_NAME"
        gcloud projects create $PROJECT_NAME --name="FinWise AI Financial Advisor"
        echo -e "${GREEN}✅ Project created: $PROJECT_NAME${NC}"
    else
        echo -e "${GREEN}✅ Project already exists: $PROJECT_NAME${NC}"
    fi
    
    # Set the project
    gcloud config set project $PROJECT_NAME
    
    # Enable required APIs
    echo "Enabling required APIs..."
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable sqladmin.googleapis.com
    gcloud services enable compute.googleapis.com
    gcloud services enable storage.googleapis.com
    gcloud services enable secretmanager.googleapis.com
    
    echo -e "${GREEN}✅ Project setup completed${NC}"
}

# Function to create database
create_database() {
    echo -e "${YELLOW}🗄️  Setting up Cloud SQL database...${NC}"
    
    # Generate random password if not set
    if [ -z "$DB_PASSWORD" ]; then
        DB_PASSWORD=$(openssl rand -base64 32)
        echo "Generated database password: $DB_PASSWORD"
    fi
    
    # Create Cloud SQL instance
    if ! gcloud sql instances describe $DB_INSTANCE &>/dev/null; then
        echo "Creating Cloud SQL instance..."
        gcloud sql instances create $DB_INSTANCE \
            --database-version=POSTGRES_14 \
            --tier=db-f1-micro \
            --region=$REGION \
            --storage-type=SSD \
            --storage-size=10GB \
            --backup-start-time="02:00" \
            --maintenance-window-day=SUN \
            --maintenance-window-hour=02 \
            --authorized-networks=0.0.0.0/0 \
            --root-password=$DB_PASSWORD
        
        echo -e "${GREEN}✅ Database instance created${NC}"
    else
        echo -e "${GREEN}✅ Database instance already exists${NC}"
    fi
    
    # Create database
    gcloud sql databases create $DB_NAME --instance=$DB_INSTANCE || echo "Database already exists"
    
    # Create user
    gcloud sql users create $DB_USER --instance=$DB_INSTANCE --password=$DB_PASSWORD || echo "User already exists"
    
    # Get connection info
    DB_HOST=$(gcloud sql instances describe $DB_INSTANCE --format="value(connectionName)")
    
    echo -e "${GREEN}✅ Database setup completed${NC}"
    echo "Database Host: $DB_HOST"
    echo "Database Name: $DB_NAME"
    echo "Database User: $DB_USER"
}

# Function to create Docker configuration
create_docker_config() {
    echo -e "${YELLOW}🐳 Creating Docker configuration...${NC}"
    
    cd finwise_backend
    
    # Create Dockerfile for backend
    cat > Dockerfile << 'EOF'
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements_production.txt .
RUN pip install --no-cache-dir -r requirements_production.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Create non-root user
RUN useradd -m -u 1000 finwise && chown -R finwise:finwise /app
USER finwise

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "finwise_backend.wsgi:application"]
EOF

    # Create .dockerignore
    cat > .dockerignore << 'EOF'
venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
.env
.venv/
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git/
.mypy_cache/
.pytest_cache/
.hypothesis/
.DS_Store
EOF

    cd ../project_frontend/projectv2_v
    
    # Create Dockerfile for frontend
    cat > Dockerfile << 'EOF'
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

    # Create nginx.conf
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        location /api/ {
            proxy_pass http://finwise-backend:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

    cd ../..
    
    echo -e "${GREEN}✅ Docker configuration created${NC}"
}

# Function to deploy backend
deploy_backend() {
    echo -e "${YELLOW}🚀 Deploying backend to Cloud Run...${NC}"
    
    cd finwise_backend
    
    # Build and deploy to Cloud Run
    gcloud run deploy $SERVICE_NAME \
        --source . \
        --region $REGION \
        --allow-unauthenticated \
        --set-env-vars="DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@/$DB_NAME?host=/cloudsql/$PROJECT_NAME:$REGION:$DB_INSTANCE" \
        --set-env-vars="GEMINI_API_KEY=$(gcloud secrets versions access latest --secret=gemini-api-key 2>/dev/null || echo 'YOUR_GEMINI_API_KEY')" \
        --set-env-vars="SECRET_KEY=$(gcloud secrets versions access latest --secret=django-secret-key 2>/dev/null || echo 'YOUR_DJANGO_SECRET_KEY')" \
        --set-env-vars="DEBUG=False" \
        --set-env-vars="ALLOWED_HOSTS=*" \
        --add-cloudsql-instances="$PROJECT_NAME:$REGION:$DB_INSTANCE"
    
    # Get the service URL
    BACKEND_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    
    cd ..
    
    echo -e "${GREEN}✅ Backend deployed successfully${NC}"
    echo "Backend URL: $BACKEND_URL"
}

# Function to deploy frontend
deploy_frontend() {
    echo -e "${YELLOW}🎨 Deploying frontend to Cloud Run...${NC}"
    
    cd project_frontend/projectv2_v
    
    # Build and deploy to Cloud Run
    gcloud run deploy $FRONTEND_SERVICE \
        --source . \
        --region $REGION \
        --allow-unauthenticated \
        --set-env-vars="VITE_API_URL=$BACKEND_URL"
    
    # Get the service URL
    FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region=$REGION --format="value(status.url)")
    
    cd ../..
    
    echo -e "${GREEN}✅ Frontend deployed successfully${NC}"
    echo "Frontend URL: $FRONTEND_URL"
}

# Function to create secrets
create_secrets() {
    echo -e "${YELLOW}🔐 Setting up secrets...${NC}"
    
    # Create Gemini API key secret
    echo "Please enter your Gemini API key:"
    read -s GEMINI_KEY
    
    if [ ! -z "$GEMINI_KEY" ]; then
        echo "$GEMINI_KEY" | gcloud secrets create gemini-api-key --data-file=- || echo "Secret already exists"
        echo -e "${GREEN}✅ Gemini API key secret created${NC}"
    fi
    
    # Create Django secret key
    DJANGO_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))")
    echo "$DJANGO_SECRET" | gcloud secrets create django-secret-key --data-file=- || echo "Secret already exists"
    echo -e "${GREEN}✅ Django secret key created${NC}"
}

# Function to setup domain and SSL
setup_domain() {
    echo -e "${YELLOW}🌐 Setting up custom domain...${NC}"
    
    echo "Do you want to set up a custom domain? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Please enter your domain name (e.g., finwise.yourdomain.com):"
        read -r DOMAIN_NAME
        
        if [ ! -z "$DOMAIN_NAME" ]; then
            # Map custom domain to Cloud Run services
            gcloud run domain-mappings create \
                --service=$SERVICE_NAME \
                --domain=$DOMAIN_NAME \
                --region=$REGION
            
            echo -e "${GREEN}✅ Custom domain mapped: $DOMAIN_NAME${NC}"
        fi
    fi
}

# Function to display deployment summary
show_summary() {
    echo -e "${BLUE}🎉 Deployment Summary${NC}"
    echo "========================"
    echo -e "${GREEN}✅ Project: $PROJECT_NAME${NC}"
    echo -e "${GREEN}✅ Region: $REGION${NC}"
    echo -e "${GREEN}✅ Backend: $BACKEND_URL${NC}"
    echo -e "${GREEN}✅ Frontend: $FRONTEND_URL${NC}"
    echo -e "${GREEN}✅ Database: $DB_INSTANCE${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Next Steps:${NC}"
    echo "1. Update your Gemini API key in Google Secret Manager"
    echo "2. Test the deployed application"
    echo "3. Set up monitoring and logging"
    echo "4. Configure backup and disaster recovery"
    echo ""
    echo -e "${BLUE}🚀 Your FinWise AI is now live on Google Cloud!${NC}"
}

# Main deployment flow
main() {
    check_prerequisites
    create_project
    create_database
    create_docker_config
    create_secrets
    deploy_backend
    deploy_frontend
    setup_domain
    show_summary
}

# Run main function
main "$@" 