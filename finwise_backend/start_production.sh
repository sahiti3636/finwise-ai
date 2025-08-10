#!/bin/bash

# Start FinWise Backend in Production Mode
echo "🚀 Starting FinWise Backend in Production Mode..."

# Activate virtual environment
source venv/bin/activate

# Set Django settings
export DJANGO_SETTINGS_MODULE=finwise_backend.settings_production

# Start Django server
echo "📍 Server will be available at: http://localhost:8000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

python manage.py runserver 127.0.0.1:8000 