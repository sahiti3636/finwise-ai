#!/bin/bash

# Script to run the FinWise project with proper environment setup

echo "Starting FinWise Project..."

# Navigate to backend directory
cd finwise_backend

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
echo "Checking dependencies..."
pip install -r requirements.txt

# Run Django server
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000 