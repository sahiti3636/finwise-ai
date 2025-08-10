import os
import json
import google.generativeai as genai
from typing import Dict, List, Optional, Any
import logging

logger = logging.getLogger(__name__)

class GeminiAIService:
    """AI service using Google Gemini for financial recommendations"""
    
    def __init__(self):
        # Get Gemini API key
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        # Configure Gemini
        genai.configure(api_key=self.api_key)
        
        # Initialize Gemini model
        try:
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            logger.info("Gemini AI service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {e}")
            raise
    
    def generate_chat_response(self, user_message: str, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a conversational response for the chatbot"""
        try:
            # Create context-aware prompt
            prompt = self._create_chat_prompt(user_message, user_profile)
            
            # Generate response using Gemini
            logger.info(f"Generating chat response with Gemini")
            response = self.model.generate_content(prompt)
            
            # Extract the generated text
            generated_text = response.text.strip()
            logger.info(f"Generated text: {generated_text[:200]}...")
            
            # Clean up the response
            cleaned_response = self._clean_response(generated_text)
            
            return {
                "response": cleaned_response,
                "suggestions": self._generate_suggestions(user_message),
                "confidence": 0.9
            }
            
        except Exception as e:
            logger.error(f"Error generating chat response: {e}")
            return self._get_fallback_chat_response(user_message, user_profile)
    
    def generate_tax_recommendations(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate tax savings recommendations"""
        try:
            # Create tax-specific prompt
            prompt = self._create_tax_prompt(user_profile)
            
            # Generate response using Gemini
            logger.info(f"Generating tax recommendations with Gemini")
            response = self.model.generate_content(prompt)
            
            generated_text = response.text.strip()
            cleaned_response = self._clean_response(generated_text)
            
            # Parse the response into structured format
            parsed_response = self._parse_tax_response(cleaned_response, user_profile)
            logger.info(f"Parsed tax response: {parsed_response}")
            return parsed_response
            
        except Exception as e:
            logger.error(f"Error generating tax recommendations: {e}")
            return self._get_fallback_tax_recommendations(user_profile)
    
    def generate_benefits_recommendations(self, user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate government benefits recommendations"""
        try:
            # Create benefits-specific prompt
            prompt = self._create_benefits_prompt(user_profile)
            
            # Generate response using Gemini
            logger.info(f"Generating benefits recommendations with Gemini")
            response = self.model.generate_content(prompt)
            
            generated_text = response.text.strip()
            cleaned_response = self._clean_response(generated_text)
            
            # Parse the response into structured format
            return self._parse_benefits_response(cleaned_response, user_profile)
            
        except Exception as e:
            logger.error(f"Error generating benefits recommendations: {e}")
            return self._get_fallback_benefits(user_profile)
    
    def _create_chat_prompt(self, user_message: str, user_profile: Dict[str, Any]) -> str:
        """Create a context-aware prompt for chat"""
        income = user_profile.get('income', 0)
        age = user_profile.get('age', 30)
        investment_amount = user_profile.get('investment_amount', 0)
        dependents = user_profile.get('dependents', 0)
        occupation = user_profile.get('occupation', '')
        city = user_profile.get('city', '')
        
        prompt = f"""You are an expert financial advisor with 20+ years of experience. You provide clear, actionable financial advice.

User Profile:
- Income: ₹{income:,} per year
- Age: {age} years old
- Investment Amount: ₹{investment_amount:,}
- Dependents: {dependents}
- Occupation: {occupation}
- Location: {city}

User Question: {user_message}

Provide helpful, specific financial advice that:
1. Addresses their specific question
2. Considers their financial profile
3. Gives actionable advice
4. Is easy to understand
5. Includes relevant examples or numbers when appropriate

Keep your response concise but comprehensive (2-4 sentences). Focus on Indian financial context and products."""
        return prompt
    
    def _create_tax_prompt(self, user_profile: Dict[str, Any]) -> str:
        """Create a prompt for tax recommendations"""
        income = user_profile.get('income', 0)
        age = user_profile.get('age', 30)
        dependents = user_profile.get('dependents', 0)
        investment_amount = user_profile.get('investment_amount', 0)
        occupation = user_profile.get('occupation', '')
        marital_status = user_profile.get('marital_status', '')
        
        prompt = f"""As a tax expert specializing in Indian tax laws, provide specific tax savings recommendations for:

Profile:
- Income: ₹{income:,} per year
- Age: {age} years old
- Dependents: {dependents}
- Current Investments: ₹{investment_amount:,}
- Occupation: {occupation}
- Marital Status: {marital_status}

Provide 3-5 specific tax-saving strategies with:
1. Strategy name and category (e.g., Section 80C, 80D, etc.)
2. How much they can save in rupees
3. Implementation steps
4. Priority level (High/Medium/Low)

Focus on Indian tax laws and products like:
- ELSS mutual funds
- PPF (Public Provident Fund)
- NPS (National Pension System)
- Health insurance premiums
- Home loan interest
- Education loan interest

Format as structured recommendations with estimated savings amounts in Indian Rupees."""
        return prompt
    
    def _create_benefits_prompt(self, user_profile: Dict[str, Any]) -> str:
        """Create a prompt for benefits recommendations"""
        income = user_profile.get('income', 0)
        age = user_profile.get('age', 30)
        occupation = user_profile.get('occupation', '')
        city = user_profile.get('city', '')
        state = user_profile.get('state', '')
        dependents = user_profile.get('dependents', 0)
        education = user_profile.get('education', '')
        
        prompt = f"""As a government benefits expert specializing in Indian government schemes, recommend available programs for:

Profile:
- Income: ₹{income:,} per year
- Age: {age} years old
- Occupation: {occupation}
- Location: {city}, {state}
- Dependents: {dependents}
- Education: {education}

Provide 3-5 specific Indian government benefits with:
1. Program name and category
2. Eligibility criteria
3. Estimated benefit amount in rupees
4. Application process
5. Timeline for approval

Focus on Indian government schemes like:
- PM-KISAN
- Ayushman Bharat
- PMAY (Pradhan Mantri Awas Yojana)
- Mudra Loan
- PMJJBY (Pradhan Mantri Jeevan Jyoti Bima Yojana)
- PMSBY (Pradhan Mantri Suraksha Bima Yojana)
- Atal Pension Yojana
- Sukanya Samriddhi Yojana

Recommend programs they likely qualify for based on their profile."""
        return prompt
    
    def _clean_response(self, generated_text: str) -> str:
        """Clean up the generated response"""
        if not generated_text:
            return "I'm sorry, I couldn't generate a response at this time. Please try again."
        
        # Clean up any artifacts
        response = generated_text.strip()
        response = response.replace('\n\n', '\n').strip()
        
        # Remove any incomplete sentences at the end
        if response and response[-1] not in '.!?':
            # Find the last complete sentence
            sentences = response.split('.')
            if len(sentences) > 1:
                response = '.'.join(sentences[:-1]) + '.'
        
        return response
    
    def _parse_tax_response(self, response: str, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Parse tax response into structured format"""
        try:
            # Try to extract JSON from the response
            start = response.find('{')
            end = response.rfind('}') + 1
            if start != -1 and end > start:
                json_str = response[start:end]
                data = json.loads(json_str)
                return data
        except:
            pass
        
        # Fallback to structured format
        try:
            description = response[:200] + "..." if len(response) > 200 else response
        except:
            description = "Tax optimization recommendations based on your profile."
            
        return {
            "recommendations": [
                {
                    "title": "Tax Optimization",
                    "description": description,
                    "potential_saving": 1000,
                    "priority": "high",
                    "category": "Tax Optimization",
                    "action": "Review Options",
                    "risk": "Low",
                    "returns": "Tax Savings",
                    "lock_in": "1 year"
                }
            ],
            "summary": {
                "total_potential_savings": 1000,
                "optimization_score": 60,
                "current_tax_saved": 0
            }
        }
    
    def _parse_benefits_response(self, response: str, user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse benefits response into structured format"""
        try:
            # Try to extract JSON array from the response
            start = response.find('[')
            end = response.rfind(']') + 1
            if start != -1 and end > start:
                json_str = response[start:end]
                data = json.loads(json_str)
                return data
        except:
            pass
        
        # Fallback to structured format
        return [
            {
                "name": "General Benefits",
                "description": response[:200] + "..." if len(response) > 200 else response,
                "eligibility_reason": "Based on your profile",
                "link": "https://www.india.gov.in/topics/benefits",
                "amount": "₹500-1000",
                "category": "General",
                "estimatedTime": "15-30 days"
            }
        ]
    
    def _generate_suggestions(self, user_message: str) -> List[str]:
        """Generate follow-up suggestions based on user message"""
        message_lower = user_message.lower()
        
        if 'investment' in message_lower:
            suggestions = [
                "What's the best investment strategy for my age?",
                "How much should I invest monthly?",
                "What are the risks of this investment?",
                "Show me low-risk investment options"
            ]
        elif 'saving' in message_lower or 'budget' in message_lower:
            suggestions = [
                "How much should I save each month?",
                "What's the best way to budget my income?",
                "How do I build an emergency fund?",
                "What are good savings goals?"
            ]
        elif 'tax' in message_lower:
            suggestions = [
                "What tax deductions can I claim?",
                "How can I reduce my tax bill?",
                "What are the best tax-saving investments?",
                "When should I file my taxes?"
            ]
        elif 'debt' in message_lower or 'loan' in message_lower:
            suggestions = [
                "How do I pay off debt faster?",
                "What's the best debt payoff strategy?",
                "Should I consolidate my loans?",
                "How much debt is too much?"
            ]
        elif 'retirement' in message_lower:
            suggestions = [
                "How much should I save for retirement?",
                "What's the best retirement account?",
                "When should I start retirement planning?",
                "How do I calculate retirement needs?"
            ]
        else:
            suggestions = [
                "Tell me more about this",
                "How can I implement this?",
                "What are the risks?",
                "Show me alternatives"
            ]
        
        return suggestions
    
    def _get_fallback_chat_response(self, user_message: str, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback response when Gemini fails"""
        income = user_profile.get('income', 0)
        age = user_profile.get('age', 30)
        dependents = user_profile.get('dependents', 0)
        
        # Provide more specific fallback responses based on the question
        if 'investment' in user_message.lower():
            response = f"Based on your ₹{income:,} income and age {age}, I recommend a diversified portfolio: 70% stocks (index funds like NIFTY 50), 20% bonds (government securities), and 10% cash. With {dependents} dependents, also consider a Sukanya Samriddhi Yojana for girls or PPF for general savings. Aim to invest 15-20% of your income monthly, prioritizing your EPF up to the match, then maxing out an NPS or mutual funds."
        elif 'saving' in user_message.lower() or 'budget' in user_message.lower():
            response = f"With your ₹{income:,} income, follow the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. Build an emergency fund of 3-6 months of expenses first. Then focus on retirement savings. Consider automating transfers to make saving easier and more consistent."
        elif 'tax' in user_message.lower():
            response = f"For tax optimization with your ₹{income:,} income, maximize your EPF contributions (₹1.5 lakh limit), use ELSS mutual funds for 80C benefits, and consider NPS for additional deductions. With {dependents} dependents, you may qualify for child tax benefits. These strategies could save you ₹{income//12*0.1:,} annually in taxes."
        elif 'debt' in user_message.lower() or 'loan' in user_message.lower():
            response = f"With your ₹{income:,} income, prioritize high-interest debt first (credit cards typically 15-25% APR). Consider the debt avalanche method: pay minimums on all debts, then put extra money toward the highest interest rate debt. Once high-interest debt is cleared, focus on building savings and investments."
        elif 'retirement' in user_message.lower():
            response = f"At age {age}, you should aim to save 15-20% of your ₹{income:,} income for retirement. Start with your EPF up to the employer match, then max out an NPS (₹2 lakh limit). Consider a PPF for tax-free withdrawals in retirement. With {dependents} dependents, also plan for college costs with a Sukanya Samriddhi Yojana."
        else:
            response = f"I understand you're asking about '{user_message}'. Based on your profile (₹{income:,} income, age {age}, {dependents} dependents), I can provide personalized financial advice. For more specific guidance, please ask about investments, savings, taxes, debt, or retirement planning."
        
        return {
            "response": response,
            "suggestions": self._generate_suggestions(user_message),
            "confidence": 0.7
        }
    
    def _get_fallback_tax_recommendations(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback tax recommendations"""
        income = user_profile.get('income', 0)
        
        recommendations = []
        if income > 1000000:
            recommendations.append({
                "category": "High-Income Tax Strategies",
                "description": "Consider tax-loss harvesting, charitable giving, and retirement account maximization.",
                "estimated_savings": 50000,
                "priority": "High"
            })
        elif income > 500000:
            recommendations.append({
                "category": "Tax-Efficient Investing",
                "description": "Focus on tax-advantaged accounts and government securities.",
                "estimated_savings": 30000,
                "priority": "Medium"
            })
        else:
            recommendations.append({
                "category": "Standard Deductions",
                "description": "Maximize standard deductions and consider ELSS mutual funds.",
                "estimated_savings": 10000,
                "priority": "High"
            })
        
        return {
            "recommendations": recommendations,
            "total_estimated_savings": sum(r["estimated_savings"] for r in recommendations)
        }
    
    def _get_fallback_benefits(self, user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fallback benefits recommendations"""
        return [
            {
                "name": "General Government Benefits",
                "description": "Based on your profile, you may be eligible for various Indian government programs. Visit india.gov.in for a comprehensive assessment.",
                "eligibility_reason": "General eligibility based on income and location",
                "link": "https://www.india.gov.in/topics/benefits",
                "amount": "Varies",
                "category": "General",
                "estimatedTime": "15-30 days"
            }
        ]

# Global instance
ai_service = GeminiAIService() 