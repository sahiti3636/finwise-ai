# FinWise - Intelligent Financial Management Platform

A comprehensive financial management application with AI-powered recommendations, tax optimization, government benefits tracking, and personalized financial planning.

## Features

- **User Authentication**: Secure login/signup with JWT tokens
- **AI-Powered Financial Advisor**: Google Gemini AI integration for personalized financial advice
- **Tax Optimization**: Smart tax saving recommendations with estimated savings amounts
- **Government Benefits**: AI-powered eligibility checking and application guidance
- **Financial Dashboard**: Comprehensive overview of financial health and AI insights
- **Profile Management**: Detailed financial profile with comprehensive data
- **Report Generation**: Downloadable financial reports in Excel format
- **Admin Panel**: User management and system monitoring
- **Intelligent Chatbot**: Context-aware financial conversations powered by Gemini

## Tech Stack

### Backend
- **Django 5.0+**: Web framework
- **Django REST Framework**: API development
- **JWT Authentication**: Secure token-based authentication
- **SQLite/PostgreSQL**: Database
- **Google Gemini AI**: Advanced AI-powered financial recommendations
- **Python-dotenv**: Environment variable management
- **Gunicorn**: Production WSGI server

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Zustand**: State management
- **React Router**: Navigation
- **Lucide React**: Icons

## AI Integration

FinWise features a sophisticated AI-powered financial advisor powered by **Google Gemini**. The AI system provides:

- **Personalized Financial Advice**: Context-aware recommendations based on user profile
- **Tax Optimization**: Section-wise tax savings strategies with estimated amounts
- **Government Benefits**: Eligibility analysis for Indian government schemes
- **Investment Guidance**: Portfolio recommendations based on risk profile
- **Retirement Planning**: Long-term financial planning strategies

### AI Features
- **Smart Context Understanding**: Analyzes income, age, dependents, and financial goals
- **Real-time Recommendations**: Instant, personalized financial advice
- **Fallback Systems**: Robust error handling with intelligent fallback responses
- **Multi-language Support**: Handles Indian financial context and terminology

### Getting Started with AI
1. **Get Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Configure Environment**: Set `GEMINI_API_KEY` in your `.env` file
3. **Test Integration**: Run `python test_gemini.py` to verify setup
4. **Start Using**: AI features are automatically available in the chatbot and recommendations

For detailed AI documentation, see [GEMINI_INTEGRATION.md](GEMINI_INTEGRATION.md).

## Production Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (recommended for production)
- Google Gemini API key

### Backend Setup

1. **Clone and setup virtual environment**:
```bash
cd finwise_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Environment Configuration**:
Create `.env` file in `finwise_backend/`:
```env
DEBUG=False
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/finwise
GEMINI_API_KEY=your-gemini-api-key
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

**Quick AI Setup**:
```bash
# Get your Gemini API key from: https://makersuite.google.com/app/apikey
export GEMINI_API_KEY='AIza-your-api-key-here'
echo "GEMINI_API_KEY=AIza-your-api-key-here" >> .env
```

3. **Database Setup**:
```bash
# For SQLite (development)
python manage.py makemigrations
python manage.py migrate

# For PostgreSQL (production)
# Install psycopg2: pip install psycopg2-binary
# Update settings.py DATABASES configuration
python manage.py makemigrations
python manage.py migrate
```

4. **Create Superuser**:
```bash
python manage.py createsuperuser
```

5. **Static Files**:
```bash
python manage.py collectstatic
```

6. **Test AI Integration**:
```bash
# Test Gemini AI setup
python test_gemini.py

# Verify AI service is working
python manage.py shell
>>> from core.ai_service import ai_service
>>> response = ai_service.generate_chat_response("Hello", {})
>>> print("AI is working!" if response else "AI setup issue")
```

7. **Run Server**:
```bash
# Development
python manage.py runserver

# Production (with Gunicorn)
pip install gunicorn
gunicorn finwise_backend.wsgi:application --bind 0.0.0.0:8000
```

### Frontend Setup

1. **Install Dependencies**:
```bash
cd project_frontend/projectv2_v
npm install
```

2. **Environment Configuration**:
Create `.env` file in `project_frontend/projectv2_v/`:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

3. **Build for Production**:
```bash
npm run build
```

4. **Serve Production Build**:
```bash
# Using a static server
npm install -g serve
serve -s dist -l 3000

# Or using nginx (recommended)
```

## Production Deployment

### Using Docker (Recommended)

1. **Create Dockerfile for Backend**:
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "finwise_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

2. **Create docker-compose.yml**:
```yaml
version: '3.8'
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: finwise
      POSTGRES_USER: finwise_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./finwise_backend
    environment:
      - DATABASE_URL=postgresql://finwise_user:your_password@db:5432/finwise
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - db
    ports:
      - "8000:8000"

  frontend:
    build: ./project_frontend/projectv2_v
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

3. **Deploy**:
```bash
docker-compose up -d
```

### Using Nginx + Gunicorn

1. **Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/finwise/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly for your domain
4. **Database**: Use strong passwords and limit access
5. **API Keys**: Rotate API keys regularly
6. **Backups**: Regular database backups
7. **Monitoring**: Set up logging and monitoring

## User Management

### Authentication Flow
1. Users register with email, username, and password
2. JWT tokens are issued for authentication
3. Tokens are automatically refreshed
4. Users can change passwords securely

### Admin Features
- User management (view, edit, delete)
- System monitoring
- Financial reports overview
- User activity tracking

## API Endpoints

### Authentication
- `POST /api/register/` - User registration
- `POST /api/token/` - User login
- `POST /api/token/refresh/` - Refresh token
- `GET /api/user/` - Get user details
- `POST /api/change-password/` - Change password

### Application
- `GET /api/profile/` - Get/update user profile
- `GET /api/dashboard/` - Dashboard data
- `GET /api/tax-savings/` - Tax recommendations
- `GET /api/benefits/` - Government benefits
- `POST /api/chatbot/` - AI assistant
- `GET /api/reports/` - Financial reports

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check CORS_ALLOWED_ORIGINS in Django settings
2. **Database Connection**: Verify database URL and credentials
3. **Gemini API**: Ensure API key is valid and has sufficient quota
4. **Static Files**: Run `collectstatic` and check nginx configuration
5. **Token Issues**: Check JWT settings and token expiration

### Logs
- Django logs: Check `python manage.py runserver` output
- Nginx logs: `/var/log/nginx/error.log`
- Application logs: Configure logging in Django settings

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Django and React documentation
3. Check API response codes and error messages
4. Verify environment variables and configurations

## License

This project is licensed under the MIT License. # finwise-ai
