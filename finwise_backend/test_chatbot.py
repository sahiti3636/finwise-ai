#!/usr/bin/env python3
"""
Test script for improved chatbot responses
"""

import os
import sys
import django
from django.conf import settings

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finwise_backend.settings')
django.setup()

from core.ai_service import GeminiAIService
from core.models import UserProfile
from django.contrib.auth.models import User

def test_chatbot():
    """Test the chatbot functionality"""
    print("🧪 Testing Chatbot with Gemini AI...")
    
    # Initialize AI service
    ai_service = GeminiAIService()
    
    # Create a test user profile
    test_profile = {
        'income': 800000,
        'age': 28,
        'investment_amount': 200000,
        'dependents': 2,
        'occupation': 'Software Engineer',
        'city': 'Bangalore',
        'state': 'Karnataka',
        'emergency_fund': 300000,
        'retirement_savings': 500000,
        'tax_deductions': 150000
    }
    
    # Test questions
    test_questions = [
        "How can I save more on taxes?",
        "What's the best investment strategy for my age?",
        "How much should I save for retirement?",
        "What government benefits am I eligible for?"
    ]
    
    for question in test_questions:
        print(f"\n❓ Question: {question}")
        try:
            response = ai_service.generate_chat_response(question, test_profile)
            print(f"🤖 Response: {response['response']}")
            print(f"💡 Suggestions: {response.get('suggestions', [])}")
            print(f"🎯 Confidence: {response.get('confidence', 0)}")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n✅ Chatbot test completed!")

if __name__ == "__main__":
    test_chatbot() 