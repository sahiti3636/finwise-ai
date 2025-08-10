# FinWise Project - Troubleshooting Guide

## 🚀 Quick Start

### **Backend (Django)**
```bash
cd finwise_backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

### **Frontend (React)**
```bash
cd project_frontend/projectv2_v
npm start
```

## 🔧 Common Issues & Solutions

### **1. Black/White Screen Issue**

**Problem**: Frontend shows blank screen at http://localhost:5173

**Solution**: 
- Check browser console for JavaScript errors (F12 → Console)
- Ensure both backend and frontend servers are running
- Clear browser cache and refresh

**Root Cause**: Usually caused by:
- Missing API endpoints
- Import errors in React components
- Authentication issues

### **2. Backend Server Issues**

**Problem**: Django server won't start

**Solutions**:
```bash
# Check if virtual environment is activated
which python
# Should show: /path/to/finwise_backend/venv/bin/python

# Activate virtual environment
cd finwise_backend
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver 0.0.0.0:8000
```

### **3. Frontend Build Errors**

**Problem**: `npm run build` fails

**Solutions**:
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build

# Start development server
npm start
```

### **4. API Connection Issues**

**Problem**: Frontend can't connect to backend

**Solutions**:
- Ensure backend is running on port 8000
- Check CORS settings in Django
- Verify API_BASE_URL in frontend (should be http://127.0.0.1:8000/api)

### **5. Database Issues**

**Problem**: Database errors or missing data

**Solutions**:
```bash
cd finwise_backend
source venv/bin/activate

# Reset database (WARNING: This will delete all data)
python manage.py flush

# Run migrations
python manage.py migrate

# Populate sample data
python manage.py populate_books
```

### **6. Authentication Issues**

**Problem**: Can't log in or authentication fails

**Solutions**:
- Clear browser localStorage: `localStorage.clear()`
- Check if backend is running
- Verify JWT tokens are being sent correctly
- Check browser console for authentication errors

## 🐛 Debugging Steps

### **1. Check Backend Logs**
```bash
cd finwise_backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```
Look for error messages in the terminal.

### **2. Check Frontend Console**
- Open browser developer tools (F12)
- Go to Console tab
- Look for red error messages
- Check Network tab for failed API calls

### **3. Test API Endpoints**
```bash
# Test if backend is responding
curl http://127.0.0.1:8000/api/

# Test authentication endpoint
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

### **4. Check Database**
```bash
cd finwise_backend
source venv/bin/activate
python manage.py shell

# In Django shell:
from core.models import Book, UserProfile
print(f"Books: {Book.objects.count()}")
print(f"User Profiles: {UserProfile.objects.count()}")
```

## 📋 System Requirements

### **Backend Requirements**
- Python 3.8+
- Django 4.2+
- Virtual environment
- SQLite (default) or PostgreSQL

### **Frontend Requirements**
- Node.js 16+
- npm 8+
- Modern browser (Chrome, Firefox, Safari, Edge)

## 🔍 Common Error Messages

### **"Module not found"**
- Check if all dependencies are installed
- Verify import paths are correct
- Clear node_modules and reinstall

### **"Authentication credentials were not provided"**
- Check if user is logged in
- Verify JWT token is in localStorage
- Check if backend is running

### **"Failed to fetch"**
- Check if backend server is running
- Verify API_BASE_URL is correct
- Check CORS settings

### **"Build failed"**
- Check TypeScript errors
- Verify all imports are correct
- Check for missing dependencies

## 🚨 Emergency Reset

If everything is broken, here's how to reset:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Reset backend
cd finwise_backend
source venv/bin/activate
python manage.py flush  # Clear database
python manage.py migrate
python manage.py populate_books

# 3. Reset frontend
cd ../project_frontend/projectv2_v
rm -rf node_modules package-lock.json
npm install

# 4. Start servers
# Terminal 1:
cd finwise_backend
source venv/bin/activate
python manage.py runserver 0.0.0.0:8000

# Terminal 2:
cd project_frontend/projectv2_v
npm start
```

## 📞 Getting Help

If you're still having issues:

1. **Check the logs**: Look at both backend and frontend console output
2. **Verify URLs**: Make sure you're accessing the correct URLs
3. **Clear cache**: Clear browser cache and localStorage
4. **Restart servers**: Stop and restart both backend and frontend
5. **Check ports**: Ensure no other services are using ports 8000 or 5173

## ✅ Success Indicators

When everything is working correctly:

- Backend: `http://127.0.0.1:8000/api/` should return a response
- Frontend: `http://localhost:5173` should show the login page
- Database: Should have 20+ books populated
- Authentication: Should be able to log in and access protected pages 