import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PiggyBank, 
  TrendingUp, 
  Calculator, 
  BookOpen,
  CheckCircle,
  Clock,
  ArrowRight,
  Target,
  DollarSign,
  FileText,
  Lightbulb,
  Loader,
  AlertCircle,
  Brain,
  Shield
} from 'lucide-react';
import { taxSavingsAPI } from '../utils/api';

interface TaxRecommendation {
  title: string;
  description: string;
  potential_saving: number;
  priority: 'high' | 'medium' | 'low';
  category: string;
  action: string;
  risk: string;
  returns: string;
  lock_in: string;
}

interface TaxSummary {
  total_potential_savings: number;
  optimization_score: number;
  current_tax_saved: number;
}

interface TaxOption {
  name: string;
  limit: number;
  invested: number;
  returns: string;
  risk: string;
  lockIn: string;
  potential_saving: number;
}

interface TaxSavingsData {
  recommendations: TaxRecommendation[];
  summary: TaxSummary;
  tax_options: {
    '80C': TaxOption[];
    '80D': TaxOption[];
    '80CCD': TaxOption[];
  };
  profile_data: {
    income: number;
    age: number;
    dependents: number;
    tax_deductions: number;
    investment_amount: number;
    emergency_fund: number;
    retirement_savings: number;
  };
}

const TaxSavings = () => {
  const [selectedCategory, setSelectedCategory] = useState('80C');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taxData, setTaxData] = useState<TaxSavingsData | null>(null);
  // New state for considered recommendations
  const [considered, setConsidered] = useState<number[]>([]);
  // New state for Learn More modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRec, setModalRec] = useState<TaxRecommendation | null>(null);
  // Add state for user-edited invested amounts for tax options
  const [optionInvested, setOptionInvested] = useState<{ [key: string]: number }>({});

  // Helper function to safely convert potential_saving to number
  const getPotentialSavingNumber = (potentialSaving: any): number => {
    if (typeof potentialSaving === 'number') {
      return potentialSaving;
    }
    if (typeof potentialSaving === 'string') {
      // Remove currency symbols and commas, then parse
      const cleaned = potentialSaving.replace(/[₹,]/g, '').trim();
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Helper function to format potential saving for display
  const formatPotentialSaving = (potentialSaving: any): string => {
    const num = getPotentialSavingNumber(potentialSaving);
    return `₹${num.toLocaleString()}`;
  };

  useEffect(() => {
    loadTaxData();
  }, []);

  const loadTaxData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taxSavingsAPI.get();
      setTaxData(data);
    } catch (err) {
      console.error('Error loading tax data:', err);
      setError('Failed to load tax savings data');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tax savings analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !taxData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error || 'Failed to load tax data'}</p>
        </div>
      </div>
    );
  }

  const categories = Object.keys(taxData.tax_options);

  // Helper: considered recommendations
  const consideredRecs = taxData?.recommendations.filter((_, i) => considered.includes(i)) || [];
  const consideredPotentialSavings = consideredRecs.reduce((sum, rec) => sum + getPotentialSavingNumber(rec.potential_saving), 0);
  const consideredOptimizationScore = consideredRecs.length
    ? Math.round(100 * consideredPotentialSavings / (getPotentialSavingNumber(taxData?.summary.total_potential_savings) || 1))
    : 0;
  const consideredCurrentTaxSaved = consideredRecs.reduce((sum, rec) => sum + (rec.category === '80C' ? getPotentialSavingNumber(rec.potential_saving) : 0), 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-3 rounded-xl">
            <PiggyBank className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Savings</h1>
        </div>
        <p className="text-gray-600">AI-powered tax optimization based on your financial profile</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8" />
            <TrendingUp className="h-6 w-6 opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {considered.length 
              ? `₹${consideredCurrentTaxSaved.toLocaleString()}` 
              : `₹${getPotentialSavingNumber(taxData.summary.current_tax_saved).toLocaleString()}`
            }
          </h3>
          <p className="text-emerald-100">Tax Saved This Year</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8" />
            <Calculator className="h-6 w-6 opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">
            {considered.length 
              ? `₹${consideredPotentialSavings.toLocaleString()}` 
              : `₹${getPotentialSavingNumber(taxData.summary.total_potential_savings).toLocaleString()}`
            }
          </h3>
          <p className="text-blue-100">Additional Potential Savings</p>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <FileText className="h-8 w-8" />
            <Clock className="h-6 w-6 opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-1">{considered.length ? consideredOptimizationScore : taxData.summary.optimization_score}%</h3>
          <p className="text-amber-100">Optimization Score</p>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-900">AI-Powered Recommendations</h2>
          </div>
          <div className="space-y-4">
            {taxData.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className={`p-4 rounded-xl border-l-4 ${
                  rec.priority === 'high' 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : rec.priority === 'medium'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-amber-500 bg-amber-50'
                } transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rec.priority === 'high'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rec.priority === 'medium'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rec.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Potential Saving:</span>
                        <div className="font-semibold text-emerald-600">{formatPotentialSaving(rec.potential_saving)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Risk:</span>
                        <div className={`font-medium ${
                          rec.risk === 'High' ? 'text-red-600' : 
                          rec.risk === 'Medium' ? 'text-yellow-600' : 'text-emerald-600'
                        }`}>
                          {rec.risk}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Returns:</span>
                        <div className="font-medium text-gray-900">{rec.returns}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Lock-in:</span>
                        <div className="font-medium text-gray-900">{rec.lock_in}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <button
                      className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium text-gray-700 hover:text-emerald-600"
                      onClick={() => { setModalRec(rec); setModalOpen(true); }}
                    >
                      <span>{rec.action || 'Learn More'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <label className="flex items-center space-x-2 text-xs mt-2 cursor-pointer select-none text-black">
                      <input
                        type="checkbox"
                        checked={considered.includes(index)}
                        onChange={e => {
                          setConsidered(prev =>
                            e.target.checked
                              ? [...prev, index]
                              : prev.filter(i => i !== index)
                          );
                        }}
                        className="accent-emerald-600"
                      />
                      <span>Considered</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      {/* Learn More Modal */}
      {modalOpen && modalRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">{modalRec.title}</h2>
            <p className="mb-4 text-gray-700">{modalRec.description}</p>
            <ul className="mb-4 text-sm text-gray-600 space-y-1">
              <li><b>Potential Saving:</b> ₹{modalRec.potential_saving.toLocaleString()}</li>
              <li><b>Risk:</b> {modalRec.risk}</li>
              <li><b>Returns:</b> {modalRec.returns}</li>
              <li><b>Lock-in:</b> {modalRec.lock_in}</li>
              <li><b>Category:</b> {modalRec.category}</li>
              <li><b>Priority:</b> {modalRec.priority}</li>
            </ul>
            <button
              className="w-full py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Tax Saving Options */}
      <motion.div variants={itemVariants}>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Tax Saving Options</h2>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                Section {category}
              </button>
            ))}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taxData.tax_options[selectedCategory as keyof typeof taxData.tax_options]?.map((option, index) => {
              const key = `${selectedCategory}-${index}`;
              const invested = optionInvested[key] !== undefined ? optionInvested[key] : option.invested;
              const progress = option.limit > 0 ? (invested / option.limit) * 100 : 0;
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{option.name}</h3>
                    {progress === 100 && (
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          ₹{invested.toLocaleString()} / ₹{option.limit.toLocaleString()}
                        </span>
                      </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={option.limit}
                          value={invested}
                          onChange={e => setOptionInvested(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                          className="w-full mt-2 accent-emerald-600"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 block">Returns</span>
                        <span className="font-medium text-gray-900">{option.returns}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Risk</span>
                        <span className={`font-medium ${
                          option.risk === 'High' ? 'text-red-600' : 
                          option.risk === 'Medium' ? 'text-yellow-600' : 'text-emerald-600'
                        }`}>
                          {option.risk}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Lock-in</span>
                        <span className="font-medium text-gray-900">{option.lockIn}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Potential Saving</span>
                        <span className="font-medium text-emerald-600">₹{option.potential_saving.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaxSavings;