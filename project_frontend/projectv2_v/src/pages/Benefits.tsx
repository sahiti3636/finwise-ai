import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Gift, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Filter,
  Search,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  FileText,
  ExternalLink
} from 'lucide-react';
import { benefitsAPI } from '../utils/api';
import { useAuthStore } from '../store/authStore';

const Benefits = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [benefits, setBenefits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<{ [key: number]: boolean }>({});
  const [claimed, setClaimed] = useState<{ [key: number]: boolean }>({});

  // Helper to get numeric value from benefit.amount
  const getAmountValue = (amount: any) => {
    if (!amount) return 0;
    const amountStr = amount.toString();
    const numbers = amountStr.match(/\d+(?:,\d+)?/g);
    if (numbers && numbers.length > 0) {
      const numValue = parseInt(numbers[0].replace(/,/g, ''));
      if (amountStr.includes('lakh') || amountStr.includes('L')) {
        return numValue * 100000;
      } else if (amountStr.includes('crore') || amountStr.includes('Cr')) {
        return numValue * 10000000;
      } else {
        return numValue;
      }
    }
    return 0;
  };

  // Calculate total potential value from benefits
  const calculateTotalPotentialValue = (benefitsList: any[]) => {
    let total = 0;
    benefitsList.forEach(benefit => {
      if (benefit.amount) {
        const amountStr = benefit.amount.toString();
        // Extract numbers from strings like "₹6,000/year", "₹5 lakh/year", "8.2% interest"
        const numbers = amountStr.match(/\d+(?:,\d+)?/g);
        if (numbers && numbers.length > 0) {
          const numValue = parseInt(numbers[0].replace(/,/g, ''));
          if (amountStr.includes('lakh') || amountStr.includes('L')) {
            total += numValue * 100000; // Convert lakh to rupees
          } else if (amountStr.includes('crore') || amountStr.includes('Cr')) {
            total += numValue * 10000000; // Convert crore to rupees
          } else {
            total += numValue;
          }
        }
      }
    });
    
    // Format the total
    if (total >= 100000) {
      return `${(total / 100000).toFixed(1)}L`;
    } else if (total >= 1000) {
      return `${(total / 1000).toFixed(1)}K`;
    } else {
      return total.toString();
    }
  };

  useEffect(() => {
    const fetchBenefits = async () => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log('Fetching benefits...');
        const data = await benefitsAPI.get();
        console.log('Benefits data received:', data);
        setBenefits(data.benefits || []);
      } catch (err: any) {
        console.error('Benefits fetch error:', err);
        if (err.message?.includes('Authentication') || err.message?.includes('401')) {
          setError('Please log in to view benefits');
          navigate('/login');
        } else {
          setError('Failed to load benefits. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBenefits();
  }, [isAuthenticated, navigate]);

  const filteredBenefits = benefits.filter((benefit) => {
    const matchesFilter = selectedFilter === 'all' || (benefit.status === selectedFilter);
    const matchesSearch = (benefit.name || benefit.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (benefit.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate summary values
  const claimedValue = benefits.reduce((sum, b, i) => claimed[i] ? sum + getAmountValue(b.amount) : sum, 0);
  const unclaimedValue = benefits.reduce((sum, b, i) => !claimed[i] ? sum + getAmountValue(b.amount) : sum, 0);
  const processingCount = benefits.reduce((count, b, i) => applied[i] && !claimed[i] ? count + 1 : count, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible': return 'text-emerald-600 bg-emerald-50';
      case 'claimed': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-amber-600 bg-amber-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'eligible': return <AlertCircle className="h-4 w-4" />;
      case 'claimed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
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

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg max-w-md mx-auto">
            <Gift className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Government Benefits</h2>
            <p className="text-gray-600 mb-6">Please log in to view your personalized government benefits and schemes.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
            <Gift className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Government Benefits</h1>
        </div>
        <p className="text-gray-600">Discover and claim government benefits you're eligible for</p>
      </motion.div>

      {/* Summary Stats */}
      {!loading && !error && (
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-8 w-8" />
            <span className="text-emerald-100 text-sm font-medium">Available</span>
          </div>
            <h3 className="text-2xl font-bold mb-1">{benefits.length}</h3>
          <p className="text-emerald-100">Eligible Benefits</p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8" />
            <span className="text-blue-100 text-sm font-medium">Claimed</span>
          </div>
            <h3 className="text-2xl font-bold mb-1">₹{claimedValue.toLocaleString()}</h3>
          <p className="text-blue-100">Total Value Claimed</p>
        </div>
        
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8" />
            <span className="text-amber-100 text-sm font-medium">Pending</span>
          </div>
            <h3 className="text-2xl font-bold mb-1">{processingCount}</h3>
          <p className="text-amber-100">Application Processing</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8" />
            <span className="text-purple-100 text-sm font-medium">Potential</span>
          </div>
            <h3 className="text-2xl font-bold mb-1">₹{unclaimedValue.toLocaleString()}</h3>
          <p className="text-purple-100">Unclaimed Value</p>
        </div>
      </motion.div>
      )}

      {/* Loading/Error */}
      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-500">Loading benefits...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Benefits</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      {!loading && !error && (
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Category Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                  <button
                    key="all"
                    onClick={() => setSelectedFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedFilter === 'all'
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    All Benefits
                  </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search benefits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
              />
            </div>
          </div>
        </div>
      </motion.div>
      )}

      {/* Benefits Grid */}
      {!loading && !error && (
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBenefits.length === 0 && (
              <div className="col-span-2 text-center text-gray-500 py-10">No benefits found.</div>
            )}
            {filteredBenefits.map((benefit, idx) => (
            <motion.div
                key={benefit.name || benefit.title || idx}
              whileHover={{ scale: 1.02 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{benefit.name || benefit.title}</h3>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(benefit.status || 'eligible')}`}>
                        {getStatusIcon(benefit.status || 'eligible')}
                        <span className="capitalize">{benefit.status || 'eligible'}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{benefit.description}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                  {benefit.amount && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Benefit Amount:</span>
                  <span className="font-semibold text-emerald-600">{benefit.amount}</span>
                </div>
                  )}
                  {benefit.category && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Category:</span>
                  <span className="px-2 py-1 bg-gray-100 rounded-md text-sm font-medium">{benefit.category}</span>
                </div>
                  )}
                  {benefit.estimatedTime && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Processing Time:</span>
                  <span className="text-sm font-medium text-gray-900">{benefit.estimatedTime}</span>
                </div>
                  )}
                  {benefit.deadline && benefit.deadline !== 'No deadline' && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Application Deadline:</span>
                    <span className="text-sm font-medium text-red-600">{benefit.deadline}</span>
                  </div>
                )}
              </div>

              {/* Eligibility */}
                {benefit.eligibility_reason && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Eligibility Reason:</h4>
                    <p className="text-sm text-gray-600">{benefit.eligibility_reason}</p>
                  </div>
                )}
                {benefit.eligibility && !benefit.eligibility_reason && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Eligibility:</h4>
                <p className="text-sm text-gray-600">{benefit.eligibility}</p>
              </div>
                )}

              {/* Required Documents */}
                {benefit.documents && benefit.documents.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Required Documents:</h4>
                <div className="flex flex-wrap gap-1">
                      {benefit.documents.map((doc: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
                )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                  {benefit.link && (
                <a
                  href={benefit.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Official Website</span>
                </a>
                  )}
                                     {(!benefit.status || benefit.status === 'eligible') && (
                     <a
                       href={benefit.link || '#'}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                     >
                    <span>Apply Now</span>
                    <ArrowRight className="h-4 w-4" />
                     </a>
                )}
                {benefit.status === 'pending' && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    <span>Track Status</span>
                  </button>
                )}
                {benefit.status === 'claimed' && (
                  <span className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Claimed</span>
                  </span>
                )}
              </div>
              {/* Checkboxes for Applied and Claimed */}
              <div className="flex items-center gap-4 mt-4">
                <label className="flex items-center space-x-2 text-xs cursor-pointer select-none text-black">
                  <input
                    type="checkbox"
                    checked={!!applied[idx]}
                    onChange={e => setApplied(prev => ({ ...prev, [idx]: e.target.checked }))}
                    className="accent-emerald-600"
                  />
                  <span>Applied</span>
                </label>
                <label className="flex items-center space-x-2 text-xs cursor-pointer select-none text-black">
                  <input
                    type="checkbox"
                    checked={!!claimed[idx]}
                    onChange={e => setClaimed(prev => ({ ...prev, [idx]: e.target.checked }))}
                    className="accent-blue-600"
                  />
                  <span>Claimed</span>
                </label>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      )}
    </motion.div>
  );
};

export default Benefits;