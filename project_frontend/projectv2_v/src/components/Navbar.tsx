import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PiggyBank, 
  Gift, 
  MessageCircle, 
  User, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tax-savings', icon: PiggyBank, label: 'Tax Savings' },
    { path: '/benefits', icon: Gift, label: 'Benefits' },
    { path: '/wisdom-library', icon: BookOpen, label: 'Wisdom Library' },
    { path: '/chatbot', icon: MessageCircle, label: 'AI Assistant' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (user?.role === 'admin') {
    navigationItems.push({ path: '/admin', icon: Settings, label: 'Admin' });
  }

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-2 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              FinWise Advisor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-emerald-100 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {(user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U')}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.first_name || user?.username || 'User'}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;