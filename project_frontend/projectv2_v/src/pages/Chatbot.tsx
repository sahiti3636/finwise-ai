import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Lightbulb,
  TrendingUp,
  PiggyBank,
  FileText,
  Calendar,
  Loader
} from 'lucide-react';
import { chatbotAPI } from '../utils/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Financial Advisor. I can help you with tax savings, government benefits, investment advice, and financial planning. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      suggestions: [
        "How can I save more tax?",
        "What government benefits am I eligible for?",
        "Best investment options for 2024",
        "Help me plan my retirement"
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    'tax': {
      keywords: ['tax', 'deduction', '80c', 'savings', 'section'],
      response: "Based on your profile, here are some tax-saving opportunities:\n\n• **ELSS Mutual Funds**: You can invest ₹30,000 more to maximize your 80C limit\n• **PPF**: Consider increasing your PPF contribution\n• **Health Insurance**: Get coverage for your parents under Section 80D\n• **NPS**: Additional ₹50,000 deduction under 80CCD(1B)\n\nWould you like detailed information about any of these options?",
      suggestions: ["Tell me about ELSS funds", "How does NPS work?", "Health insurance benefits"]
    },
    'benefits': {
      keywords: ['benefit', 'government', 'scheme', 'eligible', 'pmkisan'],
      response: "You're eligible for several government benefits:\n\n• **PM-KISAN**: ₹6,000/year for farmers\n• **Ayushman Bharat**: ₹5 lakh health coverage\n• **PMAY**: Housing loan subsidy\n• **Mudra Loan**: Business funding up to ₹10 lakh\n\nI can help you apply for any of these. Which one interests you?",
      suggestions: ["How to apply for PM-KISAN?", "Ayushman Bharat eligibility", "Business loan requirements"]
    },
    'investment': {
      keywords: ['invest', 'mutual fund', 'stock', 'sip', 'portfolio'],
      response: "Here's a diversified investment strategy for you:\n\n• **Large Cap Funds**: 40% (Low risk, steady returns)\n• **Mid Cap Funds**: 30% (Moderate risk, good growth)\n• **Small Cap Funds**: 20% (High risk, high returns)\n• **Debt Funds**: 10% (Safety and liquidity)\n\nBased on your risk profile, I recommend starting with ₹5,000/month SIP. Shall I suggest specific funds?",
      suggestions: ["Best mutual funds for beginners", "How to start SIP?", "Risk assessment"]
    },
    'retirement': {
      keywords: ['retirement', 'pension', 'future', 'planning', 'atal'],
      response: "Let's plan your retirement:\n\n**Current Age**: 28 years\n**Retirement Goal**: ₹2 crore by age 60\n**Monthly Investment Needed**: ₹8,500\n\n**Recommended Options**:\n• **PPF**: ₹1.5 lakh/year\n• **Atal Pension Yojana**: ₹1,000/month\n• **Equity Mutual Funds**: ₹5,000/month\n\nThis will help you build a corpus of ₹2+ crores. Want a detailed retirement plan?",
      suggestions: ["Create retirement roadmap", "PPF vs NPS comparison", "Pension scheme options"]
    }
  };

  const getBotResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (response.keywords.some(keyword => message.includes(keyword))) {
        return {
          text: response.response,
          suggestions: response.suggestions
        };
      }
    }

    // Default responses for common greetings and general queries
    if (message.includes('hello') || message.includes('hi')) {
      return {
        text: "Hello! I'm here to help you with your financial goals. I can assist with tax planning, investments, government benefits, and retirement planning. What would you like to know?",
        suggestions: ["Show my tax summary", "Investment recommendations", "Government schemes"]
      };
    }

    if (message.includes('help')) {
      return {
        text: "I can help you with:\n\n• **Tax Planning**: Maximize your tax savings\n• **Investment Advice**: Build a diversified portfolio\n• **Government Benefits**: Find eligible schemes\n• **Retirement Planning**: Secure your future\n• **Financial Goals**: Create actionable plans\n\nWhat specific area would you like assistance with?",
        suggestions: ["Tax optimization tips", "Investment strategy", "Benefit eligibility check"]
      };
    }

    return {
      text: "I understand you're looking for financial guidance. Could you please be more specific about what you'd like to know? I can help with tax savings, investments, government benefits, or general financial planning.",
      suggestions: ["Tax saving options", "Investment advice", "Government benefits", "Retirement planning"]
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Call the real API
      const response = await chatbotAPI.sendMessage(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot API error:', error);
      
      // Fallback to predefined responses
      const botResponse = getBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: botResponse.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputText(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: PiggyBank, text: "Tax Savings Tips", color: "emerald" },
    { icon: TrendingUp, text: "Investment Advice", color: "blue" },
    { icon: FileText, text: "Government Benefits", color: "purple" },
    { icon: Calendar, text: "Financial Planning", color: "amber" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const messageVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <motion.div variants={messageVariants} className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Financial Assistant</h1>
        </div>
        <p className="text-gray-600">Get personalized financial advice and guidance</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={messageVariants} className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestionClick(action.text)}
              className={`p-4 bg-${action.color}-50 hover:bg-${action.color}-100 rounded-xl transition-colors border border-${action.color}-200`}
            >
              <action.icon className={`h-6 w-6 text-${action.color}-600 mx-auto mb-2`} />
              <span className={`text-sm font-medium text-${action.color}-700`}>{action.text}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Chat Interface */}
      <motion.div variants={messageVariants} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                      : 'bg-white shadow-sm border border-gray-200'
                  }`}>
                    <div className={`whitespace-pre-line ${message.sender === 'user' ? 'text-white' : 'text-gray-900'}`}>
                      {message.text}
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.sender === 'bot' && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex justify-start"
              >
                <div className="flex space-x-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white shadow-sm border border-gray-200 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-1">
                      <Loader className="h-4 w-4 animate-spin text-gray-500" />
                      <span className="text-gray-500 text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your finances..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 resize-none"
                disabled={isTyping}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chatbot;