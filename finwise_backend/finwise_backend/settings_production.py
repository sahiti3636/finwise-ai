"""
Production settings for FinWise on Google Cloud Platform
"""

import os
from pathlib import Path
from .settings import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Google Cloud specific settings
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.run.app',  # Cloud Run
    '.appspot.com',  # App Engine
    '.googleapis.com',  # Google APIs
]

# Database configuration for Google Cloud SQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'finwise_db'),
        'USER': os.environ.get('DB_USER', 'finwise_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', ''),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}

# Static files configuration for Google Cloud
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Security settings for production
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Session security
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

# Logging configuration for Google Cloud
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'django.log'),
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'core': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Cache configuration (using local memory for now, can be upgraded to Redis)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# Email configuration (configure with your email service)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')

# Gemini AI configuration
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

# CORS settings for production
CORS_ALLOWED_ORIGINS = [
    "https://finwise-frontend-*.run.app",
    "https://*.appspot.com",
    "https://finwise.yourdomain.com",  # Replace with your domain
]

CORS_ALLOW_CREDENTIALS = True

# Additional security middleware
MIDDLEWARE += [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

# Trusted origins for CSRF
CSRF_TRUSTED_ORIGINS = [
    "https://*.run.app",
    "https://*.appspot.com",
    "https://finwise.yourdomain.com",  # Replace with your domain
]

# Performance optimizations
CONN_MAX_AGE = 60
OPTIMIZE_TABLE_ROW_COUNT = True

# Google Cloud specific optimizations
if os.environ.get('GAE_ENV'):
    # App Engine specific settings
    INSTALLED_APPS += ['django_appengine']
    
    # Use App Engine's built-in caching
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
            'LOCATION': '127.0.0.1:11211',
        }
    } 