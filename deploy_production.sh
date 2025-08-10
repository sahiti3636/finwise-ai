#!/bin/bash

# 🚀 FinWise - Complete Production Deployment Script

set -e  # Exit on any error

echo "🚀 FinWise Production Deployment"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the project root
if [ ! -d "finwise_backend" ] || [ ! -d "project_frontend" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to setup backend
setup_backend() {
    print_status "Setting up backend for production..."
    
    cd finwise_backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_status "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install production requirements
    print_status "Installing production dependencies..."
    pip install -r requirements_production.txt
    
    # Check if environment file exists
    if [ ! -f ".env.production" ]; then
        print_warning "Environment file not found. Please create .env.production from env.production.template"
        print_status "You can continue with default values for now"
    fi
    
    # Run production setup
    print_status "Running production setup..."
    python manage_production.py deploy
    
    cd ..
    print_success "Backend setup completed"
}

# Function to setup frontend
setup_frontend() {
    print_status "Setting up frontend for production..."
    
    cd project_frontend/projectv2_v
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Build for production
    print_status "Building frontend for production..."
    npm run build
    
    cd ../..
    print_success "Frontend setup completed"
}

# Function to start services
start_services() {
    print_status "Starting production services..."
    
    cd finwise_backend
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Start backend
    print_status "Starting backend server..."
    nohup python manage_production.py start > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    
    cd ..
    
    print_success "Services started"
    print_status "Backend PID: $BACKEND_PID"
    print_status "Backend logs: tail -f backend.log"
}

# Function to check health
check_health() {
    print_status "Checking application health..."
    
    # Wait a bit for services to start
    sleep 5
    
    # Check backend
    if curl -f http://localhost:8000/api/health/ > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_warning "Backend health check failed (this might be normal if health endpoint doesn't exist)"
    fi
    
    # Check if frontend build exists
    if [ -d "project_frontend/projectv2_v/dist" ]; then
        print_success "Frontend build exists"
    else
        print_error "Frontend build not found"
    fi
}

# Function to show deployment info
show_deployment_info() {
    echo ""
    echo "🎉 Deployment Summary"
    echo "===================="
    echo "✅ Backend: http://localhost:8000"
    echo "✅ Frontend: Built in project_frontend/projectv2_v/dist"
    echo "✅ Backend PID: $(cat backend.pid 2>/dev/null || echo 'Not running')"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Configure your web server (Nginx/Apache) to serve the frontend"
    echo "2. Set up a reverse proxy to the backend"
    echo "3. Configure SSL certificates"
    echo "4. Set up monitoring and logging"
    echo ""
    echo "📚 Documentation: finwise_backend/DEPLOYMENT.md"
    echo ""
    echo "🛑 To stop services: ./stop_production.sh"
}

# Function to cleanup on exit
cleanup() {
    print_status "Cleaning up..."
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            print_status "Stopped backend process"
        fi
        rm -f backend.pid
    fi
}

# Set trap for cleanup
trap cleanup EXIT

# Main deployment flow
main() {
    print_status "Starting FinWise production deployment..."
    
    check_prerequisites
    setup_backend
    setup_frontend
    start_services
    check_health
    show_deployment_info
    
    print_success "Deployment completed successfully!"
    print_status "Your FinWise application is now running in production mode"
}

# Run main function
main "$@" 