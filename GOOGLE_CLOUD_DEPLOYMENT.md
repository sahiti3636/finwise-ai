# 🚀 FinWise Google Cloud Deployment Guide

## Overview
This guide will walk you through deploying your FinWise AI Financial Advisor application to Google Cloud Platform (GCP). We'll use Google Cloud Run for the backend and frontend, Cloud SQL for the database, and Secret Manager for secure configuration.

## 🎯 **Deployment Options**

### Option 1: Cloud Run (Recommended)
- **Pros**: Serverless, auto-scaling, pay-per-use, easy deployment
- **Cons**: Cold starts, limited customization
- **Cost**: ~$0.00002400 per 100ms of CPU time + memory

### Option 2: App Engine
- **Pros**: Fully managed, auto-scaling, built-in monitoring
- **Cons**: More expensive for high traffic
- **Cost**: ~$0.05 per instance hour

### Option 3: Compute Engine
- **Pros**: Full control, predictable pricing
- **Cons**: Manual scaling, more management overhead
- **Cost**: ~$0.0475 per hour for e2-micro

## 🔧 **Prerequisites**

### 1. Google Cloud SDK Installation
```bash
# macOS (using Homebrew)
brew install google-cloud-sdk

# Or download from Google Cloud Console
# https://cloud.google.com/sdk/docs/install
```

### 2. Authentication
```bash
# Login to Google Cloud
gcloud auth login

# Set your project (create one if needed)
gcloud config set project YOUR_PROJECT_ID
```

### 3. Enable Required APIs
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

## 🚀 **Quick Deployment (Automated)**

### Step 1: Run the Deployment Script
```bash
# Make the script executable
chmod +x deploy_to_google_cloud.sh

# Run the deployment
./deploy_to_google_cloud.sh
```

The script will:
- ✅ Check prerequisites
- 🏗️ Create Google Cloud project
- 🗄️ Set up Cloud SQL database
- 🐳 Create Docker configurations
- 🔐 Set up secrets
- 🚀 Deploy backend to Cloud Run
- 🎨 Deploy frontend to Cloud Run
- 🌐 Configure custom domain (optional)

## 📋 **Manual Deployment Steps**

### Step 1: Create Google Cloud Project
```bash
# Create new project
gcloud projects create finwise-ai --name="FinWise AI Financial Advisor"

# Set as active project
gcloud config set project finwise-ai
```

### Step 2: Set Up Cloud SQL Database
```bash
# Create PostgreSQL instance
gcloud sql instances create finwise-db \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --storage-type=SSD \
    --storage-size=10GB \
    --backup-start-time="02:00" \
    --maintenance-window-day=SUN \
    --maintenance-window-hour=02 \
    --authorized-networks=0.0.0.0/0 \
    --root-password=YOUR_SECURE_PASSWORD

# Create database
gcloud sql databases create finwise_db --instance=finwise-db

# Create user
gcloud sql users create finwise_user --instance=finwise-db --password=YOUR_USER_PASSWORD
```

### Step 3: Set Up Secrets
```bash
# Store Gemini API key
echo "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-

# Store Django secret key
python3 -c "import secrets; print(secrets.token_urlsafe(50))" | \
gcloud secrets create django-secret-key --data-file=-
```

### Step 4: Deploy Backend to Cloud Run
```bash
cd finwise_backend

# Build and deploy
gcloud run deploy finwise-backend \
    --source . \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars="DATABASE_URL=postgresql://finwise_user:YOUR_USER_PASSWORD@/finwise_db?host=/cloudsql/finwise-ai:us-central1:finwise-db" \
    --set-env-vars="GEMINI_API_KEY=$(gcloud secrets versions access latest --secret=gemini-api-key)" \
    --set-env-vars="SECRET_KEY=$(gcloud secrets versions access latest --secret=django-secret-key)" \
    --set-env-vars="DEBUG=False" \
    --set-env-vars="ALLOWED_HOSTS=*" \
    --add-cloudsql-instances="finwise-ai:us-central1:finwise-db"
```

### Step 5: Deploy Frontend to Cloud Run
```bash
cd ../project_frontend/projectv2_v

# Build and deploy
gcloud run deploy finwise-frontend \
    --source . \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars="VITE_API_URL=YOUR_BACKEND_URL"
```

## 🔐 **Environment Configuration**

### Backend Environment Variables
```bash
# Required
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_django_secret_key
DEBUG=False
ALLOWED_HOSTS=*

# Database
DB_NAME=finwise_db
DB_USER=finwise_user
DB_PASSWORD=your_password
DB_HOST=your_cloud_sql_connection_name

# Optional
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_app_password
```

### Frontend Environment Variables
```bash
# API Configuration
VITE_API_URL=https://your-backend-url.run.app
VITE_APP_NAME=FinWise AI
VITE_APP_VERSION=1.0.0
```

## 🗄️ **Database Migration**

### Step 1: Run Migrations
```bash
# Connect to Cloud Run service
gcloud run services update finwise-backend \
    --region us-central1 \
    --set-env-vars="RUN_MIGRATIONS=True"

# Or run migrations manually
gcloud run jobs create finwise-migrate \
    --image gcr.io/finwise-ai/finwise-backend \
    --region us-central1 \
    --command="python" \
    --args="manage.py,migrate"
```

### Step 2: Create Superuser
```bash
gcloud run jobs create finwise-createsuperuser \
    --image gcr.io/finwise-ai/finwise-backend \
    --region us-central1 \
    --command="python" \
    --args="manage.py,createsuperuser" \
    --set-env-vars="DJANGO_SUPERUSER_USERNAME=admin,DJANGO_SUPERUSER_EMAIL=admin@finwise.com,DJANGO_SUPERUSER_PASSWORD=secure_password"
```

## 🌐 **Custom Domain Setup**

### Step 1: Map Domain to Cloud Run
```bash
# Map custom domain to backend
gcloud run domain-mappings create \
    --service=finwise-backend \
    --domain=api.yourdomain.com \
    --region=us-central1

# Map custom domain to frontend
gcloud run domain-mappings create \
    --service=finwise-frontend \
    --domain=finwise.yourdomain.com \
    --region=us-central1
```

### Step 2: Configure DNS
Add these DNS records to your domain provider:
```
Type: CNAME
Name: api
Value: ghs.googlehosted.com

Type: CNAME
Name: finwise
Value: ghs.googlehosted.com
```

## 📊 **Monitoring and Logging**

### Cloud Logging
```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=finwise-backend" --limit=50

# Create log-based metrics
gcloud logging metrics create finwise-errors \
    --description="FinWise application errors" \
    --log-filter="resource.type=cloud_run_revision AND severity>=ERROR"
```

### Cloud Monitoring
```bash
# Create uptime check
gcloud monitoring uptime-checks create http finwise-uptime \
    --display-name="FinWise Uptime Check" \
    --uri="https://your-frontend-url.run.app" \
    --check-interval=30s
```

## 💰 **Cost Optimization**

### Cloud Run Optimization
```bash
# Set minimum instances to 0 for cost savings
gcloud run services update finwise-backend \
    --region us-central1 \
    --min-instances=0 \
    --max-instances=10

# Use concurrency to handle more requests per instance
gcloud run services update finwise-backend \
    --region us-central1 \
    --concurrency=80
```

### Cloud SQL Optimization
```bash
# Use smaller instance for development
gcloud sql instances patch finwise-db \
    --tier=db-f1-micro

# Enable automatic backups
gcloud sql instances patch finwise-db \
    --backup-start-time="02:00" \
    --backup-retention-days=7
```

## 🔒 **Security Best Practices**

### 1. IAM Roles
```bash
# Create service account for Cloud Run
gcloud iam service-accounts create finwise-runner \
    --display-name="FinWise Cloud Run Service Account"

# Grant minimal required permissions
gcloud projects add-iam-policy-binding finwise-ai \
    --member="serviceAccount:finwise-runner@finwise-ai.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"
```

### 2. Network Security
```bash
# Restrict database access
gcloud sql instances patch finwise-db \
    --authorized-networks=YOUR_IP_ADDRESS/32
```

### 3. Secret Rotation
```bash
# Create new secret version
echo "NEW_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-

# Update Cloud Run service
gcloud run services update finwise-backend \
    --region us-central1 \
    --set-env-vars="GEMINI_API_KEY=$(gcloud secrets versions access latest --secret=gemini-api-key)"
```

## 🚨 **Troubleshooting**

### Common Issues

#### 1. Database Connection Errors
```bash
# Check Cloud SQL instance status
gcloud sql instances describe finwise-db

# Verify connection
gcloud sql connect finwise-db --user=finwise_user
```

#### 2. Cloud Run Deployment Failures
```bash
# Check build logs
gcloud builds log BUILD_ID

# Verify service configuration
gcloud run services describe finwise-backend --region=us-central1
```

#### 3. Environment Variable Issues
```bash
# List current environment variables
gcloud run services describe finwise-backend --region=us-central1 --format="value(spec.template.spec.containers[0].env[].name,spec.template.spec.containers[0].env[].value)"
```

### Debug Commands
```bash
# Test backend connectivity
curl -v https://your-backend-url.run.app/api/health/

# Check frontend build
cd project_frontend/projectv2_v
npm run build

# Verify Docker build
docker build -t finwise-backend .
```

## 📈 **Scaling and Performance**

### Auto-scaling Configuration
```bash
# Configure auto-scaling
gcloud run services update finwise-backend \
    --region us-central1 \
    --min-instances=1 \
    --max-instances=20 \
    --cpu=1 \
    --memory=512Mi \
    --concurrency=80
```

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test configuration
cat > load-test.yml << EOF
config:
  target: 'https://your-backend-url.run.app'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/health/"
EOF

# Run load test
artillery run load-test.yml
```

## 🎉 **Deployment Complete!**

After successful deployment, you'll have:
- ✅ **Backend API**: Running on Cloud Run with auto-scaling
- ✅ **Frontend**: Served from Cloud Run with CDN
- ✅ **Database**: PostgreSQL on Cloud SQL with backups
- ✅ **Secrets**: Securely stored in Secret Manager
- ✅ **Monitoring**: Built-in Cloud Monitoring and Logging
- ✅ **SSL**: Automatic HTTPS with Let's Encrypt
- ✅ **Domain**: Custom domain mapping (if configured)

## 🔗 **Useful Links**

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Cloud Build Documentation](https://cloud.google.com/cloud-build/docs)
- [FinWise Project Repository](your-repo-url)

## 🆘 **Need Help?**

If you encounter issues:
1. Check the troubleshooting section above
2. Review Google Cloud Console logs
3. Verify environment variables and secrets
4. Test locally before deploying
5. Check the FinWise documentation

---

**Happy Deploying! 🚀 Your FinWise AI is ready for the cloud!** 