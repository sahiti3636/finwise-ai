#!/bin/bash

# FinWise Deployment to AWS Elastic Beanstalk
# This script prepares the application for AWS deployment

set -e

echo "🚀 FinWise AWS Deployment"
echo "=========================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Installing..."
    brew install awscli
fi

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ Elastic Beanstalk CLI not found. Installing..."
    pip install awsebcli
fi

# Check if authenticated
if ! aws sts get-caller-identity &> /dev/null; then
    echo "🔐 Please configure AWS credentials:"
    aws configure
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

# Create requirements.txt for AWS
echo "📦 Creating requirements.txt for AWS..."
cat > finwise_backend/requirements.txt << EOF
Django==4.2.7
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
psycopg2-binary==2.9.9
redis==5.0.1
gunicorn==21.2.0
whitenoise==6.6.0
python-decouple==3.8
Pillow==10.1.0
django-filter==23.5
django-extensions==3.2.3
EOF

# Create .ebextensions configuration
echo "⚙️ Creating .ebextensions configuration..."
mkdir -p finwise_backend/.ebextensions

# Python configuration
cat > finwise_backend/.ebextensions/01_python.config << EOF
option_settings:
  aws:elasticbeanstalk:container:python:
    WSGIPath: finwise_backend.wsgi_production
  aws:elasticbeanstalk:application:environment:
    DJANGO_SETTINGS_MODULE: finwise_backend.settings_production
    DEBUG: "False"
    ALLOWED_HOSTS: ".elasticbeanstalk.com,.amazonaws.com"
EOF

# Static files configuration
cat > finwise_backend/.ebextensions/02_static_files.config << EOF
option_settings:
  aws:elasticbeanstalk:environment:proxy:staticfiles:
    /static: staticfiles
    /media: media
EOF

# Environment variables
cat > finwise_backend/.ebextensions/03_env_vars.config << EOF
option_settings:
  aws:elasticbeanstalk:application:environment:
    SECRET_KEY: your-secret-key-here
    DB_ENGINE: django.db.backends.postgresql
    DB_NAME: finwise_prod
    DB_USER: finwise_user
    DB_PASSWORD: your-db-password
    DB_HOST: your-rds-endpoint
    DB_PORT: "5432"
    REDIS_URL: your-redis-endpoint
EOF

# Create Procfile for AWS
echo "📋 Creating Procfile..."
cat > finwise_backend/Procfile << EOF
web: gunicorn finwise_backend.wsgi_production --bind 0.0.0.0:8000 --workers 3 --timeout 120
EOF

# Create .ebignore
echo "🚫 Creating .ebignore..."
cat > finwise_backend/.ebignore << EOF
.git
.gitignore
.env
.venv
venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.log
.coverage
.pytest_cache/
.mypy_cache/
.idea/
.vscode/
*.swp
*.swo
*~
.DS_Store
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF

# Create deployment instructions
echo "📋 Creating deployment instructions..."
cat > finwise_backend/AWS_DEPLOYMENT.md << EOF
# AWS Elastic Beanstalk Deployment

## Prerequisites
1. AWS account
2. AWS CLI configured
3. Elastic Beanstalk CLI installed
4. RDS PostgreSQL instance
5. ElastiCache Redis instance

## Infrastructure Setup

### 1. Create RDS PostgreSQL Database
\`\`\`bash
aws rds create-db-instance \\
  --db-instance-identifier finwise-db \\
  --db-instance-class db.t3.micro \\
  --engine postgres \\
  --master-username finwise_user \\
  --master-user-password your-password \\
  --allocated-storage 20 \\
  --storage-type gp2
\`\`\`

### 2. Create ElastiCache Redis Cluster
\`\`\`bash
aws elasticache create-cache-cluster \\
  --cache-cluster-id finwise-redis \\
  --cache-node-type cache.t3.micro \\
  --engine redis \\
  --num-cache-nodes 1 \\
  --port 6379
\`\`\`

## Deployment Steps

1. **Initialize Elastic Beanstalk**
   \`\`\`bash
   cd finwise_backend
   eb init
   \`\`\`

2. **Create environment**
   \`\`\`bash
   eb create finwise-prod --instance-type t3.micro
   \`\`\`

3. **Set environment variables**
   \`\`\`bash
   eb setenv SECRET_KEY=your-secret-key
   eb setenv DB_HOST=your-rds-endpoint
   eb setenv DB_PASSWORD=your-password
   eb setenv REDIS_URL=your-redis-endpoint
   \`\`\`

4. **Deploy**
   \`\`\`bash
   eb deploy
   \`\`\`

5. **Open the application**
   \`\`\`bash
   eb open
   \`\`\`

## Environment Variables
- DJANGO_SETTINGS_MODULE: finwise_backend.settings_production
- SECRET_KEY: Your secret key
- DEBUG: False
- ALLOWED_HOSTS: .elasticbeanstalk.com,.amazonaws.com
- Database and Redis connection details

## Monitoring
- Use AWS CloudWatch for monitoring
- Set up alarms for errors and performance
- Monitor RDS and ElastiCache metrics

## Scaling
- Configure auto-scaling groups
- Set up load balancer
- Use multiple availability zones
EOF

echo "✅ AWS deployment files created!"
echo "📁 Files created:"
echo "  - requirements.txt"
echo "  - .ebextensions/ (configuration files)"
echo "  - Procfile"
echo "  - .ebignore"
echo "  - AWS_DEPLOYMENT.md"
echo ""
echo "🚀 Next steps:"
echo "1. Set up AWS infrastructure (RDS, ElastiCache)"
echo "2. Follow the deployment instructions in AWS_DEPLOYMENT.md"
echo "3. Deploy using Elastic Beanstalk CLI" 