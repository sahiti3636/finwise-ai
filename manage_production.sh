#!/bin/bash

# FinWise Production Management Script
# Run this from the project root directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/finwise_backend"

echo "🚀 FinWise Production Management"
echo "================================"

# Function to show usage
show_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     - Start complete production environment"
    echo "  stop      - Stop complete production environment"
    echo "  restart   - Restart complete production environment"
    echo "  status    - Show production environment status"
    echo "  logs      - Show live logs from all services"
    echo "  build     - Build frontend for production"
    echo "  migrate   - Run database migrations"
    echo "  collect   - Collect static files"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 status"
    echo "  $0 logs"
}

# Function to check if backend directory exists
check_backend() {
    if [ ! -d "$BACKEND_DIR" ]; then
        echo "❌ Error: Backend directory not found at $BACKEND_DIR"
        echo "   Make sure you're running this from the project root directory"
        exit 1
    fi
}

# Function to execute backend command
run_backend_command() {
    local command="$1"
    cd "$BACKEND_DIR"
    if [ -f "$command" ]; then
        ./"$command"
    else
        echo "❌ Error: Command $command not found in backend directory"
        exit 1
    fi
}

# Main command logic
case "${1:-help}" in
    start)
        echo "🚀 Starting FinWise production environment..."
        check_backend
        run_backend_command "start_production_complete.sh"
        ;;
    stop)
        echo "🛑 Stopping FinWise production environment..."
        check_backend
        run_backend_command "stop_production_complete.sh"
        ;;
    restart)
        echo "🔄 Restarting FinWise production environment..."
        check_backend
        run_backend_command "stop_production_complete.sh"
        sleep 3
        run_backend_command "start_production_complete.sh"
        ;;
    status)
        echo "📊 Checking FinWise production environment status..."
        check_backend
        run_backend_command "status_production.sh"
        ;;
    logs)
        echo "📝 Showing live logs from all services..."
        echo "Press Ctrl+C to stop"
        echo ""
        echo "🔴 Redis logs:"
        tail -f /opt/homebrew/var/log/redis.log &
        echo "🐘 PostgreSQL logs:"
        tail -f /opt/homebrew/var/log/postgresql@15.log &
        echo "🌐 Nginx logs:"
        tail -f /opt/homebrew/var/log/nginx/access.log &
        echo "🐍 Django logs:"
        tail -f "$BACKEND_DIR/logs/django.log" &
        
        # Wait for all background processes
        wait
        ;;
    build)
        echo "🏗️ Building frontend for production..."
        cd "$SCRIPT_DIR/project_frontend/projectv2_v"
        if [ -f "package.json" ]; then
            echo "📦 Installing dependencies..."
            npm install
            echo "🔨 Building production bundle..."
            npm run build
            echo "✅ Frontend built successfully!"
        else
            echo "❌ Error: Frontend directory not found"
            exit 1
        fi
        ;;
    migrate)
        echo "🗄️ Running database migrations..."
        check_backend
        cd "$BACKEND_DIR"
        source venv/bin/activate
        python manage.py migrate --settings=finwise_backend.settings_production
        ;;
    collect)
        echo "📁 Collecting static files..."
        check_backend
        cd "$BACKEND_DIR"
        source venv/bin/activate
        python manage.py collectstatic --noinput --settings=finwise_backend.settings_production
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        echo "❌ Error: Unknown command '$1'"
        echo ""
        show_usage
        exit 1
        ;;
esac 