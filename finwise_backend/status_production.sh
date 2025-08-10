#!/bin/bash

echo "📊 FinWise Production Environment Status"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check service status
check_service_status() {
    local service_name="$1"
    local process_pattern="$2"
    local port="$3"
    local url="$4"
    
    echo -e "\n${BLUE}🔍 Checking $service_name...${NC}"
    
    # Check if process is running
    if pgrep -f "$process_pattern" > /dev/null; then
        echo -e "  ✅ Process: ${GREEN}Running${NC}"
    else
        echo -e "  ❌ Process: ${RED}Not Running${NC}"
    fi
    
    # Check if port is listening
    if [ -n "$port" ]; then
        if lsof -i :$port > /dev/null 2>&1; then
            echo -e "  ✅ Port $port: ${GREEN}Listening${NC}"
        else
            echo -e "  ❌ Port $port: ${RED}Not Listening${NC}"
        fi
    fi
    
    # Test URL if provided
    if [ -n "$url" ]; then
        if curl -s --connect-timeout 5 "$url" > /dev/null 2>&1; then
            echo -e "  ✅ URL: ${GREEN}Accessible${NC}"
        else
            echo -e "  ❌ URL: ${RED}Not Accessible${NC}"
        fi
    fi
}

# Check PostgreSQL
check_service_status "PostgreSQL" "postgres" "5432" ""

# Check Redis
check_service_status "Redis" "redis-server" "6379" ""

# Check Nginx
check_service_status "Nginx" "nginx" "80" "http://localhost:80"

# Check Django Backend
check_service_status "Django Backend" "gunicorn" "8000" "http://localhost:8000/api/"

# Check database connection
echo -e "\n${BLUE}🗄️ Database Connection Test${NC}"
cd "$(dirname "$0")"
if source venv/bin/activate 2>/dev/null; then
    if python manage.py check --settings=finwise_backend.settings_production > /dev/null 2>&1; then
        echo -e "  ✅ Database: ${GREEN}Connected${NC}"
    else
        echo -e "  ❌ Database: ${RED}Connection Failed${NC}"
    fi
else
    echo -e "  ❌ Virtual Environment: ${RED}Not Accessible${NC}"
fi

# Check Redis connection
echo -e "\n${BLUE}🔴 Redis Connection Test${NC}"
if redis-cli ping > /dev/null 2>&1; then
    echo -e "  ✅ Redis: ${GREEN}Connected${NC}"
else
    echo -e "  ❌ Redis: ${RED}Connection Failed${NC}"
fi

# System resources
echo -e "\n${BLUE}💻 System Resources${NC}"
echo -e "  📊 CPU Usage: $(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')%"
echo -e "  💾 Memory Usage: $(top -l 1 | grep PhysMem | awk '{print $2}')"
echo -e "  💽 Disk Usage: $(df -h / | tail -1 | awk '{print $5}')"

# URLs
echo -e "\n${BLUE}🌐 Access URLs${NC}"
echo -e "  🌍 Frontend: ${GREEN}http://localhost:80${NC}"
echo -e "  🔧 Backend API: ${GREEN}http://localhost:8000/api/${NC}"
echo -e "  👨‍💼 Admin: ${GREEN}http://localhost:80/admin/${NC}"

echo -e "\n${GREEN}✅ Status check completed!${NC}" 