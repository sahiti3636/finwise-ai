#!/bin/bash

# FinWise AI Integration Test Script
# This script helps you test the Gemini AI integration

echo "🚀 FinWise AI Integration Test"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "finwise_backend/core/ai_service.py" ]; then
    echo "❌ Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: finwise_backend/core/ai_service.py"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "finwise_backend/venv" ]; then
    echo "❌ Virtual environment not found"
    echo "   Please run: cd finwise_backend && python -m venv venv"
    exit 1
fi

# Check if .env file exists
if [ ! -f "finwise_backend/.env" ]; then
    echo "⚠️  No .env file found"
    echo "   Creating .env file with template..."
    cat > finwise_backend/.env << EOF
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
DJANGO_SETTINGS_MODULE=finwise_backend.settings

# AI Service Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Database
DATABASE_URL=sqlite:///db.sqlite3

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
EOF
    echo "✅ Created .env file"
    echo "   Please edit finwise_backend/.env and add your Gemini API key"
    echo "   Get your key from: https://makersuite.google.com/app/apikey"
    exit 1
fi

# Check if GEMINI_API_KEY is set
if ! grep -q "GEMINI_API_KEY=" finwise_backend/.env || grep -q "your-gemini-api-key-here" finwise_backend/.env; then
    echo "❌ GEMINI_API_KEY not configured"
    echo "   Please edit finwise_backend/.env and add your Gemini API key"
    echo "   Get your key from: https://makersuite.google.com/app/apikey"
    exit 1
fi

echo "✅ Environment looks good"
echo "🔑 API Key: Configured"
echo "🐍 Virtual Environment: Found"

# Activate virtual environment and test
echo ""
echo "🧪 Testing AI Integration..."
echo "============================"

cd finwise_backend
source venv/bin/activate

# Check if google-generativeai is installed
if ! python -c "import google.generativeai" 2>/dev/null; then
    echo "📦 Installing required packages..."
    pip install -r requirements.txt
fi

# Run the test
echo "🚀 Running Gemini AI tests..."
python test_gemini.py

# Check test result
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 AI Integration Test: SUCCESS!"
    echo "================================"
    echo "✅ Gemini AI is working correctly"
    echo "✅ Your FinWise AI is ready to provide financial advice"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Start the backend: python manage.py runserver"
    echo "   2. Start the frontend: cd ../project_frontend/projectv2_v && npm run dev"
    echo "   3. Test the chatbot in your browser"
else
    echo ""
    echo "❌ AI Integration Test: FAILED"
    echo "============================="
    echo "Please check the error messages above"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Verify your Gemini API key is correct"
    echo "   2. Check your internet connection"
    echo "   3. Ensure you have sufficient API quota"
    echo "   4. Check the logs for detailed error information"
fi

# Deactivate virtual environment
deactivate
cd .. 