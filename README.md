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

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

# FinWise – Local Setup

AI-powered financial management platform with tax optimization, government benefits tracking, and personalized advice.

---

## Prerequisites
- Python 3.11+
- Node.js 18+
- (Optional) PostgreSQL
- Google Gemini API key → [Get here](https://makersuite.google.com/app/apikey)

---

## 1️⃣ Backend Setup
```bash
cd finwise_backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Create `.env` in `finwise_backend/`:**
```env
DEBUG=True
SECRET_KEY=dev-secret-key
DATABASE_URL=sqlite:///db.sqlite3
GEMINI_API_KEY=your-gemini-api-key
ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## 2️⃣ Frontend Setup
```bash
cd project_frontend/projectv2_v
npm install
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
npm run dev
```

---

## 3️⃣ Access
- **Frontend** → [http://localhost:5173](http://localhost:5173)
- **Backend API** → [http://localhost:8000/api](http://localhost:8000/api)
- **Admin Panel** → [http://localhost:8000/admin](http://localhost:8000/admin)

---

## Notes
- SQLite is used for quick local testing (default).
- Ensure `GEMINI_API_KEY` is set to enable AI features.



