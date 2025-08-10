# 🚀 Running FinWise Locally

## Quick Start (Automated)

Run the automated setup script:
```bash
./run_local.sh
```

This script will:
- ✅ Check prerequisites (Python, Node.js, npm)
- 🐍 Set up Python backend with virtual environment
- ⚛️ Set up React frontend with dependencies
- 🚀 Start both backend and frontend servers
- 🔧 Create necessary configuration files

## Manual Setup

### Prerequisites

1. **Python 3.8+**
   ```bash
   # Check if installed
   python3 --version
   
   # Install on macOS if needed
   brew install python
   ```

2. **Node.js 16+ and npm**
   ```bash
   # Check if installed
   node --version
   npm --version
   
   # Install on macOS if needed
   brew install node
   ```

### Step 1: Backend Setup

```bash
cd finwise_backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file
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

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

cd ..
```

### Step 2: Frontend Setup

```bash
cd project_frontend/projectv2_v

# Install dependencies
npm install

cd ../..
```

### Step 3: Start Servers

**Terminal 1 - Backend:**
```bash
cd finwise_backend
source venv/bin/activate
python manage.py runserver 127.0.0.1:8000
```

**Terminal 2 - Frontend:**
```bash
cd project_frontend/projectv2_v
npm run dev
```

## Access Your Application

- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://127.0.0.1:8000
- 👑 **Admin Panel**: http://127.0.0.1:8000/admin

## Important Configuration

### 1. Gemini API Key
You need to get a Gemini API key from Google AI Studio:
1. Go to: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add it to `finwise_backend/.env`:
   ```
   GEMINI_API_KEY=your-actual-api-key-here
   ```

### 2. Environment Variables
The `.env` file contains important configuration:
- `DEBUG`: Set to `True` for local development
- `SECRET_KEY`: Django secret key (auto-generated)
- `ALLOWED_HOSTS`: Hosts that can access the app
- `CORS_ALLOWED_ORIGINS`: Frontend origins for CORS

## Troubleshooting

### Common Issues:

1. **Port already in use**
   ```bash
   # Find process using port 8000
   lsof -i :8000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Database errors**
   ```bash
   cd finwise_backend
   source venv/bin/activate
   python manage.py migrate --run-syncdb
   ```

3. **Frontend build errors**
   ```bash
   cd project_frontend/projectv2_v
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Virtual environment issues**
   ```bash
   cd finwise_backend
   rm -rf venv
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

### Getting Help

If you encounter issues:
1. Check the terminal output for error messages
2. Verify all prerequisites are installed
3. Make sure ports 8000 and 3000 are available
4. Check that the `.env` file is properly configured

## Development Workflow

1. **Backend changes**: Django will auto-reload
2. **Frontend changes**: Vite will hot-reload
3. **Database changes**: Run `python manage.py makemigrations` then `python manage.py migrate`
4. **New dependencies**: Add to `requirements.txt` and run `pip install -r requirements.txt`

## Stopping the Servers

- **Backend**: Press `Ctrl+C` in the backend terminal
- **Frontend**: Press `Ctrl+C` in the frontend terminal
- **Both**: Press `Ctrl+C` in the main terminal if using the automated script

## Next Steps

Once running locally:
1. Test the application functionality
2. Make changes to the code
3. Test the AI features with your Gemini API key
4. Explore the admin panel at `/admin`
5. Check the API endpoints at `/api/`

Happy coding! 🚀 