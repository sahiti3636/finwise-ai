#!/bin/bash

# 🛑 FinWise - Stop Production Services

echo "🛑 Stopping FinWise Production Services"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Stop backend service
if [ -f "backend.pid" ]; then
    BACKEND_PID=$(cat backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_status "Stopping backend process (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        
        # Wait for process to stop
        sleep 2
        
        if kill -0 $BACKEND_PID 2>/dev/null; then
            print_warning "Backend process still running, force killing..."
            kill -9 $BACKEND_PID
        fi
        
        print_success "Backend process stopped"
    else
        print_warning "Backend process not running"
    fi
    
    rm -f backend.pid
else
    print_warning "Backend PID file not found"
fi

# Stop any running Django processes
DJANGO_PROCESSES=$(pgrep -f "manage.py runserver\|gunicorn\|finwise_backend" || true)
if [ ! -z "$DJANGO_PROCESSES" ]; then
    print_status "Stopping Django processes..."
    echo $DJANGO_PROCESSES | xargs kill
    print_success "Django processes stopped"
fi

# Stop any running Node processes (frontend dev server)
NODE_PROCESSES=$(pgrep -f "npm run dev\|vite" || true)
if [ ! -z "$NODE_PROCESSES" ]; then
    print_status "Stopping Node.js processes..."
    echo $NODE_PROCESSES | xargs kill
    print_success "Node.js processes stopped"
fi

# Check if any processes are still running
REMAINING_PROCESSES=$(pgrep -f "manage.py\|gunicorn\|finwise_backend\|npm run dev\|vite" || true)
if [ ! -z "$REMAINING_PROCESSES" ]; then
    print_warning "Some processes are still running:"
    echo $REMAINING_PROCESSES | xargs ps -p
else
    print_success "All FinWise services stopped"
fi

echo ""
echo "✅ Services stopped successfully"
echo "🚀 To restart: ./deploy_production.sh" 