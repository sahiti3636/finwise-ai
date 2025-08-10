#!/bin/bash

echo "🛑 Stopping FinWise Production Environment"
echo "=========================================="

# Function to stop a service
stop_service() {
    if pgrep -f "$1" > /dev/null; then
        echo "🔄 Stopping $2..."
        $3
        sleep 2
        if ! pgrep -f "$1" > /dev/null; then
            echo "✅ $2 stopped successfully"
        else
            echo "❌ Failed to stop $2"
        fi
    else
        echo "ℹ️ $2 is not running"
    fi
}

# Stop Django Backend
echo "🐍 Stopping Django Backend..."
if pgrep -f "gunicorn" > /dev/null; then
    pkill -f "gunicorn"
    sleep 2
    if ! pgrep -f "gunicorn" > /dev/null; then
        echo "✅ Backend stopped successfully"
    else
        echo "❌ Failed to stop backend"
    fi
else
    echo "ℹ️ Backend is not running"
fi

# Stop Nginx
echo "🌐 Stopping Nginx..."
stop_service "nginx" "Nginx" "brew services stop nginx"

# Stop Redis
echo "🔴 Stopping Redis..."
stop_service "redis-server" "Redis" "brew services stop redis"

# Stop PostgreSQL
echo "🐘 Stopping PostgreSQL..."
stop_service "postgres" "PostgreSQL" "brew services stop postgresql@15"

echo ""
echo "🎯 Production Environment Status:"
echo "================================="
if pgrep -f "gunicorn" > /dev/null; then
    echo "❌ Backend is still running"
else
    echo "✅ Backend is stopped"
fi

if pgrep -f "nginx" > /dev/null; then
    echo "❌ Nginx is still running"
else
    echo "✅ Nginx is stopped"
fi

if pgrep -f "redis-server" > /dev/null; then
    echo "❌ Redis is still running"
else
    echo "✅ Redis is stopped"
fi

if pgrep -f "postgres" > /dev/null; then
    echo "❌ PostgreSQL is still running"
else
    echo "✅ PostgreSQL is stopped"
fi

echo ""
echo "🛑 FinWise Production Environment has been stopped!" 