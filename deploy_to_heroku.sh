#!/bin/bash

# FinWise Deployment to Heroku
# This script deploys the FinWise application to Heroku

set -e

echo "🚀 FinWise Heroku Deployment"
echo "=============================="

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Installing..."
    brew tap heroku/brew && brew install heroku
fi

# Check if logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please log in to Heroku:"
    heroku login
fi

# Create Heroku app if it doesn't exist
APP_NAME="finwise-app-$(date +%s)"
echo "📱 Creating Heroku app: $APP_NAME"
heroku create $APP_NAME

# Add PostgreSQL addon
echo "🗄️ Adding PostgreSQL database..."
heroku addons:create heroku-postgresql:mini

# Add Redis addon
echo "🔴 Adding Redis cache..."
heroku addons:create heroku-redis:mini

# Set environment variables
echo "⚙️ Setting environment variables..."
heroku config:set DJANGO_SETTINGS_MODULE=finwise_backend.settings_production
heroku config:set SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(50))")
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=".herokuapp.com"
heroku config:set CORS_ALLOWED_ORIGINS="https://$APP_NAME.herokuapp.com"

# Get database URL
DB_URL=$(heroku config:get DATABASE_URL)
echo "📊 Database URL configured"

# Build frontend
echo "🏗️ Building frontend..."
cd project_frontend/projectv2_v
npm run build
cd ../../

# Copy frontend build to backend static directory
echo "📁 Copying frontend build..."
mkdir -p finwise_backend/staticfiles/frontend
cp -r project_frontend/projectv2_v/dist/* finwise_backend/staticfiles/frontend/

# Create Procfile for Heroku
echo "📋 Creating Procfile..."
cat > finwise_backend/Procfile << EOF
web: gunicorn finwise_backend.wsgi_production --log-file -
release: python manage.py migrate --settings=finwise_backend.settings_production
EOF

# Create runtime.txt
echo "🐍 Setting Python version..."
echo "python-3.11.0" > finwise_backend/runtime.txt

# Create app.json for Heroku
echo "📱 Creating app.json..."
cat > finwise_backend/app.json << EOF
{
  "name": "FinWise Financial App",
  "description": "A comprehensive financial management application",
  "repository": "https://github.com/yourusername/finwise",
  "logo": "https://node-js-sample.herokuapp.com/node.png",
  "keywords": ["python", "django", "react", "financial"],
  "addons": [
    "heroku-postgresql:mini",
    "heroku-redis:mini"
  ],
  "env": {
    "DJANGO_SETTINGS_MODULE": {
      "value": "finwise_backend.settings_production"
    },
    "SECRET_KEY": {
      "generator": "secret"
    },
    "DEBUG": {
      "value": "False"
    }
  },
  "buildpacks": [
    {
      "url": "heroku/python"
    }
  ]
}
EOF

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
cd finwise_backend
git init
git add .
git commit -m "Initial Heroku deployment"
git push heroku main

# Run migrations
echo "🗄️ Running database migrations..."
heroku run python manage.py migrate --settings=finwise_backend.settings_production

# Create superuser
echo "👨‍💼 Creating superuser..."
heroku run python manage.py createsuperuser --settings=finwise_backend.settings_production

# Open the app
echo "🌐 Opening deployed app..."
heroku open

echo "✅ Deployment completed!"
echo "🌍 Your app is now live at: https://$APP_NAME.herokuapp.com"
echo "🔧 Admin panel: https://$APP_NAME.herokuapp.com/admin/"
echo "📊 Monitor your app: https://dashboard.heroku.com/apps/$APP_NAME" 