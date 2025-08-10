#!/usr/bin/env python3
"""
Test script for Gemini AI integration
Tests all AI service functionality including chat, tax recommendations, and benefits
"""

import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
project_dir = Path(__file__).parent
sys.path.insert(0, str(project_dir))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'finwise_backend.settings')
django.setup()

from core.ai_service import ai_service

def test_gemini_integration():
    """Test the complete Gemini AI integration"""
    print("🧪 Testing Gemini AI Integration...")
    print("=" * 50)
    
    # Test user profile
    test_profile = {
        'income': 800000,  # 8 lakhs per year
        'age': 32,
        'dependents': 2,
        'investment_amount': 50000,
        'occupation': 'Software Engineer',
        'city': 'Bangalore',
        'state': 'Karnataka',
        'marital_status': 'Married',
        'education': 'Bachelor\'s Degree',
        'business_type': 'Salaried',
        'property_owned': 'Rental',
        'vehicle_owned': 'Car',
        'emergency_fund': 100000,
        'retirement_savings': 200000,
        'tax_deductions': 50000
    }
    
    try:
        # Test 1: Chat Response
        print("\n1️⃣ Testing Chat Response...")
        chat_response = ai_service.generate_chat_response(
            "How can I save more on taxes?", 
            test_profile
        )
        print(f"✅ Chat Response: {chat_response['response'][:200]}...")
        print(f"   Suggestions: {len(chat_response['suggestions'])} suggestions")
        print(f"   Confidence: {chat_response['confidence']}")
        
        # Test 2: Tax Recommendations
        print("\n2️⃣ Testing Tax Recommendations...")
        tax_response = ai_service.generate_tax_recommendations(test_profile)
        print(f"✅ Tax Response: {len(tax_response.get('recommendations', []))} recommendations")
        if 'summary' in tax_response:
            print(f"   Total Potential Savings: ₹{tax_response['summary'].get('total_potential_savings', 0):,}")
        
        # Test 3: Benefits Recommendations
        print("\n3️⃣ Testing Benefits Recommendations...")
        benefits_response = ai_service.generate_benefits_recommendations(test_profile)
        print(f"✅ Benefits Response: {len(benefits_response)} benefits")
        for i, benefit in enumerate(benefits_response[:2], 1):
            print(f"   {i}. {benefit.get('name', 'Unknown')}: {benefit.get('amount', 'N/A')}")
        
        print("\n🎉 All Gemini AI tests completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        print(f"   Error type: {type(e).__name__}")
        return False

def test_gemini_api_key():
    """Test if Gemini API key is properly configured"""
    print("\n🔑 Testing Gemini API Key Configuration...")
    
    api_key = os.getenv('GEMINI_API_KEY')
    if api_key:
        print(f"✅ API Key found: {api_key[:10]}...{api_key[-4:]}")
        return True
    else:
        print("❌ No GEMINI_API_KEY found in environment")
        print("   Please set GEMINI_API_KEY in your .env file")
        return False

def test_gemini_model_initialization():
    """Test if Gemini model can be initialized"""
    print("\n🤖 Testing Gemini Model Initialization...")
    
    try:
        # This should already be initialized in ai_service
        model = ai_service.model
        print("✅ Gemini model initialized successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to initialize Gemini model: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 FinWise Gemini AI Integration Test")
    print("=" * 50)
    
    # Test API key
    if not test_gemini_api_key():
        print("\n❌ Cannot proceed without API key")
        return
    
    # Test model initialization
    if not test_gemini_model_initialization():
        print("\n❌ Cannot proceed without model initialization")
        return
    
    # Test full integration
    success = test_gemini_integration()
    
    if success:
        print("\n🎯 Gemini AI Integration Status: ✅ WORKING")
        print("\n📋 Summary:")
        print("   • API Key: ✅ Configured")
        print("   • Model: ✅ Initialized")
        print("   • Chat: ✅ Working")
        print("   • Tax Recommendations: ✅ Working")
        print("   • Benefits: ✅ Working")
        print("\n🚀 Your FinWise AI is ready to provide financial advice!")
    else:
        print("\n❌ Gemini AI Integration Status: FAILED")
        print("   Please check the error messages above")

if __name__ == "__main__":
    main() 