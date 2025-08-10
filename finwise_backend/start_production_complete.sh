#!/bin/bash

echo "🚀 Starting FinWise Production Environment"
echo "=========================================="

# Function to check if a service is running
check_service() {
    if pgrep -f "$1" > /dev/null; then
        echo "✅ $2 is running"
        return 0
    else
        echo "❌ $2 is not running"
        return 1
    fi
}

# Function to start a service if not running
start_service() {
    if ! check_service "$1" "$2"; then
        echo "🔄 Starting $2..."
        $3
        sleep 2
        if check_service "$1" "$2"; then
            echo "✅ $2 started successfully"
        else
            echo "❌ Failed to start $2"
            return 1
        fi
    fi
}

# Start PostgreSQL
echo "🐘 Starting PostgreSQL..."
brew services start postgresql@15
sleep 2

# Start Redis
echo "🔴 Starting Redis..."
brew services start redis
sleep 2

# Start Nginx
echo "🌐 Starting Nginx..."
brew services start nginx
sleep 2

# Check if backend is running, if not start it
if ! check_service "gunicorn" "Backend"; then
    echo "🐍 Starting Django Backend..."
    cd "$(dirname "$0")"
    source venv/bin/activate
    
    # Collect static files
    echo "📁 Collecting static files..."
    python manage.py collectstatic --noinput --settings=finwise_backend.settings_production
    
    # Run migrations
    echo "🗄️ Running database migrations..."
    python manage.py migrate --settings=finwise_backend.settings_production
    
    # Start backend
    echo "🚀 Starting Gunicorn backend..."
    gunicorn --bind 127.0.0.1:8000 finwise_backend.wsgi_production:application --daemon
    sleep 3
fi

# Final status check
echo ""
echo "🎯 Production Environment Status:"
echo "================================="
check_service "postgres" "PostgreSQL"
check_service "redis-server" "Redis"
check_service "nginx" "Nginx"
check_service "gunicorn" "Django Backend"

echo ""
echo "🌍 Frontend: http://localhost:80"
echo "🔧 Backend API: http://localhost:8000/api/"
echo "👨‍💼 Admin: http://localhost:80/admin/"
echo ""
echo "✅ FinWise Production Environment is ready!" 