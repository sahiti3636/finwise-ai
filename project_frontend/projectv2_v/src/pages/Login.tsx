import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LogIn, 
  Eye, 
  EyeOff, 
  Shield, 
  Loader, 
  AlertCircle, 
  Sparkles,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  Star,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (type: 'user' | 'admin') => {
    if (type === 'user') {
      setUsername('demo');
      setPassword('password123');
    } else {
      setUsername('admin');
      setPassword('admin123');
    }
  };

  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Stagger animation for features
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '1s' }}
          className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl"
        />
      <motion.div
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '0.5s' }}
          className="absolute bottom-40 right-1/3 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
          {/* Left Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col justify-center space-y-8"
          >
            <div className="space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    FinWise
                  </span>
                </h1>
                <p className="text-xl text-blue-200 leading-relaxed">
                  Your intelligent financial companion for smarter wealth management
                </p>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Smart Investment Tracking</h3>
                  <p className="text-blue-300 text-sm">Monitor and optimize your portfolio performance</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Goal-Based Planning</h3>
                  <p className="text-blue-300 text-sm">Set and achieve your financial milestones</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI-Powered Insights</h3>
                  <p className="text-blue-300 text-sm">Get personalized financial recommendations</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Tax Optimization</h3>
                  <p className="text-blue-300 text-sm">Maximize your savings with smart tax strategies</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center space-x-6 pt-8"
            >
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-blue-300 text-sm">4.9/5 Rating</span>
              </div>
              <div className="w-px h-6 bg-blue-300/30" />
              <span className="text-blue-300 text-sm">10,000+ Users</span>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
                
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-blue-200">Sign in to your FinWise account</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3"
          >
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-200 text-sm">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
                      <label htmlFor="username" className="block text-sm font-semibold text-blue-200 mb-3">
              Username
            </label>
                      <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
                          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              placeholder="Enter your username"
              required
              disabled={loading}
            />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
          </div>

          <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-blue-200 mb-3">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm pr-12"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors duration-200"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center space-x-3">
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                        {!loading && <ArrowRight className="w-4 h-4" />}
                      </div>
          </motion.button>
        </form>

                  <div className="mt-8 text-center">
                <p className="text-blue-300 text-sm">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-white hover:text-blue-300 font-semibold transition-colors duration-200">
                    Sign Up
                  </Link>
                </p>
              </div>
                  <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-300/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-transparent text-blue-200 font-medium">Demo Credentials</span>
            </div>
          </div>
          
                    <div className="mt-6 space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleDemoLogin('user')}
                        className="w-full text-left p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 rounded-xl text-blue-200 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300 backdrop-blur-sm"
              disabled={loading}
            >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">Demo User</div>
              <div className="text-xs text-blue-300">demo / password123</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-blue-300" />
                        </div>
                      </motion.button>
            
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleDemoLogin('admin')}
                        className="w-full text-left p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30 rounded-xl text-purple-200 hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300 backdrop-blur-sm"
              disabled={loading}
            >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">Admin User</div>
              <div className="text-xs text-purple-300">admin / admin123</div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-purple-300" />
                        </div>
                      </motion.button>
          </div>
          
                    <p className="mt-6 text-center text-xs text-blue-300 leading-relaxed">
            Click on demo credentials to auto-fill, or enter any username/password for demo mode
          </p>
                  </div>
                </div>
              </motion.div>
        </div>
      </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;