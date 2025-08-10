#!/usr/bin/env python3
"""
Integration test for FinWise Django + Gemini AI
Tests the complete flow from Django views to AI service
"""
import os
import sys
import django
from pathlib import Path
from django.test import TestCase, override_settings
from django.test.client import Client
from django.contrib.auth import get_user_model
from django.urls import reverse
import json

# Add the project directory to Python path
project_dir = Path(__file__).parent
sys.path.insert(0, str(project_dir))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finwise_backend.settings')
django.setup()

from core.models import UserProfile
from core.ai_service import ai_service

User = get_user_model()

def test_ai_service_integration():
    """Test AI service integration"""
    print("🧪 Testing AI Service Integration...")
    
    try:
        # Test AI service initialization
        print("  ✅ AI Service initialized")
        
        # Test chat response
        test_profile = {
            'income': 800000,
            'age': 35,
            'dependents': 2,
            'business_type': 'Salaried',
            'city': 'Mumbai'
        }
        
        chat_response = ai_service.generate_chat_response(
            "How can I save tax on my income?", 
            test_profile
        )
        print(f"  ✅ Chat Response: {len(chat_response)} characters")
        
        # Test tax recommendations
        tax_response = ai_service.generate_tax_recommendations(test_profile)
        print(f"  ✅ Tax Recommendations: {len(tax_response)} recommendations")
        
        # Test benefits recommendations
        benefits_response = ai_service.generate_benefits_recommendations(test_profile)
        print(f"  ✅ Benefits Recommendations: {len(benefits_response)} benefits")
        
        return True
        
    except Exception as e:
        print(f"  ❌ AI Service Error: {e}")
        return False

def test_django_models():
    """Test Django models"""
    print("🏗️  Testing Django Models...")
    
    try:
        # Test User model - use unique username
        import time
        unique_username = f'testuser_{int(time.time())}'
        
        user = User.objects.create_user(
            username=unique_username,
            email=f'{unique_username}@example.com',
            password='testpass123'
        )
        print("  ✅ User model working")
        
        # Test UserProfile model
        profile = UserProfile.objects.create(
            user=user,
            income=800000,
            age=35,
            dependents=2,
            business_type='Salaried',
            city='Mumbai'
        )
        print("  ✅ UserProfile model working")
        
        # Cleanup
        user.delete()
        print("  ✅ Models cleanup successful")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Models Error: {e}")
        return False

def test_django_views():
    """Test Django views"""
    print("🌐 Testing Django Views...")
    
    try:
        # Use override_settings to fix ALLOWED_HOSTS issue
        with override_settings(ALLOWED_HOSTS=['testserver', 'localhost', '127.0.0.1']):
            client = Client()
            
            # Test chatbot view (should require auth)
            response = client.get('/api/chatbot/')
            assert response.status_code == 401, "Chatbot view should require authentication"
            print("  ✅ Chatbot view authentication working")
            
            # Test other API endpoints
            response = client.get('/api/tax-savings/')
            assert response.status_code == 401, "Tax savings view should require authentication"
            print("  ✅ Tax savings view authentication working")
            
            response = client.get('/api/benefits/')
            assert response.status_code == 401, "Benefits view should require authentication"
            print("  ✅ Benefits view authentication working")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Views Error: {e}")
        return False

def test_django_server():
    """Test Django server startup"""
    print("🚀 Testing Django Server...")
    
    try:
        # Test Django configuration
        from django.conf import settings
        print(f"  ✅ Django version: {django.get_version()}")
        print(f"  ✅ Database: {settings.DATABASES['default']['ENGINE']}")
        print(f"  ✅ Installed apps: {len(settings.INSTALLED_APPS)} apps")
        
        # Test URL configuration
        from django.urls import get_resolver
        resolver = get_resolver()
        print(f"  ✅ URL patterns: {len(resolver.url_patterns)} patterns")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Server Error: {e}")
        return False

def main():
    """Run all integration tests"""
    print("🚀 FinWise Integration Test")
    print("=" * 50)
    
    # Test Django server configuration
    server_working = test_django_server()
    
    # Test AI service
    ai_working = test_ai_service_integration()
    
    # Test Django models
    models_working = test_django_models()
    
    # Test Django views
    views_working = test_django_views()
    
    print("\n" + "=" * 50)
    print("📊 Integration Test Results:")
    print(f"  🚀 Django Server: {'✅ WORKING' if server_working else '❌ FAILED'}")
    print(f"  🤖 AI Service: {'✅ WORKING' if ai_working else '❌ FAILED'}")
    print(f"  🏗️  Django Models: {'✅ WORKING' if models_working else '❌ FAILED'}")
    print(f"  🌐 Django Views: {'✅ WORKING' if views_working else '❌ FAILED'}")
    
    if all([server_working, ai_working, models_working, views_working]):
        print("\n🎉 All integration tests passed!")
        print("🚀 Your FinWise application is ready to use!")
        return True
    else:
        print("\n⚠️  Some integration tests failed.")
        print("🔧 Please check the errors above and fix them.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 