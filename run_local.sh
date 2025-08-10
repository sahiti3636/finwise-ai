#!/bin/bash
# FinWise Local Development Setup Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE} FinWise Local Development Setup${NC}"
echo "======================================"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW} Checking prerequisites...${NC}"
    
    # Check Python
    if ! command_exists python3; then
        echo -e "${RED} Python 3 not found. Please install Python 3.8+${NC}"
        exit 1
    fi
    
    # Check Node.js
    if ! command_exists node; then
        echo -e "${RED} Node.js not found. Please install Node.js 16+${NC}"
        echo "Install with: brew install node"
        exit 1
    fi
    
    # Check npm
    if ! command_exists npm; then
        echo -e "${RED} npm not found. Please install npm${NC}"
        exit 1
    fi
    
    echo -e "${GREEN} Prerequisites check completed${NC}"
}

# Function to setup backend
setup_backend() {
    echo -e "${YELLOW} Setting up Python backend...${NC}"
    
    cd finwise_backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    echo "Activating virtual environment..."
    source venv/bin/activate
    
    # Install requirements
    echo "Installing Python dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Check if .env file exists, if not create one
    if [ ! -f ".env" ]; then
        echo "Creating .env file..."
        cat > .env << 'EOF'
DEBUG=True
SECRET_KEY=your-secret-key-here-change-this-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Database (using SQLite for local development)
DATABASE_URL=sqlite:///db.sqlite3

# Gemini API (you'll need to add your own key)
GEMINI_API_KEY=your-gemini-api-key-here

# Email settings (optional for local development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True
EOF
        echo -e "${YELLOW}  Please update the .env file with your Gemini API key${NC}"
    fi
    
    # Run migrations
    echo "Running database migrations..."
    python manage.py migrate
    
    # Create superuser if it doesn't exist
    echo "Checking for superuser..."
    if ! python manage.py shell -c "from django.contrib.auth.models import User; print('Superuser exists' if User.objects.filter(is_superuser=True).exists() else 'No superuser')" 2>/dev/null | grep -q "Superuser exists"; then
        echo -e "${YELLOW}Creating superuser...${NC}"
        echo "Please enter superuser details:"
        python manage.py createsuperuser
    fi
    
    # Collect static files
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
    
    cd ..
    
    echo -e "${GREEN} Backend setup completed${NC}"
}

# Function to setup frontend
setup_frontend() {
    echo -e "${YELLOW}  Setting up React frontend...${NC}"
    
    cd project_frontend/projectv2_v
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "Installing Node.js dependencies..."
        npm install
    fi
    
    cd ../..
    
    echo -e "${GREEN} Frontend setup completed${NC}"
}

# Function to start backend
start_backend() {
    echo -e "${YELLOW} Starting Django backend...${NC}"
    
    cd finwise_backend
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Start Django development server
    echo "Starting Django server on http://127.0.0.1:8000"
    echo "Press Ctrl+C to stop the backend server"
    echo ""
    
    python manage.py runserver 127.0.0.1:8000 &
    BACKEND_PID=$!
    
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    echo -e "${GREEN} Backend started successfully${NC}"
}

# Function to start frontend
start_frontend() {
    echo -e "${YELLOW} Starting React frontend...${NC}"
    
    cd project_frontend/projectv2_v
    
    # Start Vite development server
    echo "Starting Vite dev server on http://localhost:3000"
    echo "Press Ctrl+C to stop the frontend server"
    echo ""
    
    npm run dev &
    FRONTEND_PID=$!
    
    cd ../..
    
    # Wait a moment for frontend to start
    sleep 3
    
    echo -e "${GREEN} Frontend started successfully${NC}"
}

# Function to show status
show_status() {
    echo ""
    echo -e "${BLUE} FinWise is now running locally!${NC}"
    echo "======================================"
    echo -e "${GREEN} Backend: http://127.0.0.1:8000${NC}"
    echo -e "${GREEN} Frontend: http://localhost:3000${NC}"
    echo -e "${GREEN} Admin Panel: http://127.0.0.1:8000/admin${NC}"
    echo ""
    echo -e "${YELLOW} Important Notes:${NC}"
    echo "1. Backend is running on port 8000"
    echo "2. Frontend is running on port 3000"
    echo "3. Make sure to update your Gemini API key in finwise_backend/.env"
    echo "4. Both servers will continue running in the background"
    echo ""
    echo -e "${BLUE} To stop the servers:${NC}"
    echo "   kill $BACKEND_PID $FRONTEND_PID"
    echo "   or close this terminal window"
    echo ""
    echo -e "${GREEN} Happy coding!${NC}"
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW} Stopping servers...${NC}"
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    echo -e "${GREEN} Servers stopped${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Main execution
main() {
    check_prerequisites
    setup_backend
    setup_frontend
    
    echo ""
    echo -e "${YELLOW} Starting FinWise locally...${NC}"
    echo "This will start both backend and frontend servers"
    echo "Press Ctrl+C to stop both servers"
    echo ""
    
    start_backend
    start_frontend
    show_status
    
    # Keep the script running
    echo -e "${YELLOW} Servers are running. Press Ctrl+C to stop...${NC}"
    wait
}

# Run main function
main "$@" 
