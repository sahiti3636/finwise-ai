"""
Production WSGI configuration for FinWise Backend
"""
import os
import sys

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set the Django settings module for production
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finwise_backend.settings_production')

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application

# Create WSGI application
application = get_wsgi_application()

# Optional: Add middleware for production
try:
    from whitenoise import WhiteNoise
    application = WhiteNoise(application, root='staticfiles/')
    application.add_files('staticfiles/', prefix='static/')
except ImportError:
    pass  # WhiteNoise not available 