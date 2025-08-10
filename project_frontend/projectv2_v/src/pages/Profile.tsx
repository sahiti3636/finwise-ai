import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Briefcase,
  DollarSign,
  Home,
  Users,
  Shield,
  FileText,
  Camera,
  CheckCircle,
  Loader,
  AlertCircle,
  Target,
  PiggyBank,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { profileAPI } from '../utils/api';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    // Personal Information
      name: '',
      email: '',
      phone: '',
    
    // Financial Information
    income: 0,
    age: 0,
    dependents: 0,
    
    // Investment & Savings
    monthly_savings: 0,
    total_savings: 0,
    investment_amount: 0,
    savings_goal: 0,
    
    // Investment Details
    investments: '',
    investment_types: '',
    
    // Additional Financial Info
    emergency_fund: 0,
    retirement_savings: 0,
    tax_deductions: 0,
    
    // Report Generation Fields
      occupation: '',
    city: '',
    state: '',
    marital_status: '',
    education: '',
    business_type: '',
    property_owned: false,
    vehicle_owned: false
  });

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
        const data = await profileAPI.get();
        setProfileData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        income: data.income || 0,
        age: data.age || 0,
        dependents: data.dependents || 0,
        monthly_savings: data.monthly_savings || 0,
        total_savings: data.total_savings || 0,
        investment_amount: data.investment_amount || 0,
        savings_goal: data.savings_goal || 0,
        investments: data.investments || '',
        investment_types: data.investment_types || '',
        emergency_fund: data.emergency_fund || 0,
        retirement_savings: data.retirement_savings || 0,
        tax_deductions: data.tax_deductions || 0,
        occupation: data.occupation || '',
        city: data.city || '',
        state: data.state || '',
        marital_status: data.marital_status || '',
        education: data.education || '',
        business_type: data.business_type || '',
        property_owned: data.property_owned || false,
        vehicle_owned: data.vehicle_owned || false
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      console.log('Saving profile data:', profileData);
      
      const result = await profileAPI.update(profileData);
      console.log('Profile update result:', result);
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      console.error('Error details:', error.message, error.response);
      
      // Try to get more detailed error information
      let errorMessage = 'Failed to save profile changes';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response && error.response.data) {
        errorMessage = error.response.data.error || error.response.data.detail || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    console.log(`Updating field ${field} with value:`, value, 'type:', typeof value);
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your comprehensive financial information for personalized advice</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={saving}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isEditing 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saving ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : isEditing ? (
              <Save className="h-4 w-4" />
            ) : (
              <Edit className="h-4 w-4" />
            )}
            <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </motion.button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="text-emerald-800">{successMessage}</span>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Summary Card */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold mx-auto mb-4">
                  {profileData.name.charAt(0) || 'U'}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{profileData.name || 'User Profile'}</h2>
              <p className="text-gray-600 mb-4">Financial Information</p>
              <div className="flex items-center justify-center space-x-2 text-emerald-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Active Account</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Income: ₹{profileData.income.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <PiggyBank className="h-4 w-4" />
                <span className="text-sm">Savings: ₹{profileData.total_savings.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Investments: ₹{profileData.investment_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Comprehensive Financial Information</h3>
              
              {/* Personal Information */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Full Name</label>
                      <input
                        type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 text-black placeholder-gray-400"
                      placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Enter your phone number"
                      />
                    </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Financial Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income (₹)</label>
                      <input
                      type="number"
                      value={profileData.income}
                      onChange={(e) => handleInputChange('income', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Enter annual income"
                      />
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Enter your age"
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dependents</label>
                      <input
                      type="number"
                      value={profileData.dependents}
                      onChange={(e) => handleInputChange('dependents', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Number of dependents"
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Deductions (₹)</label>
                      <input
                      type="number"
                      value={profileData.tax_deductions}
                      onChange={(e) => handleInputChange('tax_deductions', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Current tax deductions"
                      />
                  </div>
                </div>
              </div>

              {/* Savings Information */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <PiggyBank className="h-5 w-5 mr-2" />
                  Savings & Goals
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Savings (₹)</label>
                      <input
                      type="number"
                      value={profileData.monthly_savings}
                      onChange={(e) => handleInputChange('monthly_savings', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Monthly savings amount"
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Savings (₹)</label>
                      <input
                      type="number"
                      value={profileData.total_savings}
                      onChange={(e) => handleInputChange('total_savings', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Total savings"
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Savings Goal (₹)</label>
                      <input
                        type="number"
                      value={profileData.savings_goal}
                      onChange={(e) => handleInputChange('savings_goal', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Savings goal"
                      />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Fund (₹)</label>
                      <input
                      type="number"
                      value={profileData.emergency_fund}
                      onChange={(e) => handleInputChange('emergency_fund', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Emergency fund amount"
                    />
                  </div>
                </div>
              </div>

              {/* Investment Information */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Investment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount (₹)</label>
                    <input
                      type="number"
                      value={profileData.investment_amount}
                      onChange={(e) => handleInputChange('investment_amount', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Total investment amount"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Savings (₹)</label>
                      <input
                        type="number"
                      value={profileData.retirement_savings}
                      onChange={(e) => handleInputChange('retirement_savings', parseInt(e.target.value) || 0)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Retirement savings"
                      />
                    </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Types</label>
                        <input
                          type="text"
                      value={profileData.investment_types}
                      onChange={(e) => handleInputChange('investment_types', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="e.g., Stocks, Mutual Funds, PPF, ELSS"
                        />
                      </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Investments Description</label>
                    <textarea
                      value={profileData.investments}
                      onChange={(e) => handleInputChange('investments', e.target.value)}
                        disabled={!isEditing}
                      rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Describe your current investments in detail..."
                      />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                    <input
                      type="text"
                      value={profileData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Your occupation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Your city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Your state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                    <select
                      value={profileData.marital_status}
                      onChange={(e) => handleInputChange('marital_status', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    >
                      <option value="">Select status</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    <input
                      type="text"
                      value={profileData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Your education level"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                    <input
                      type="text"
                      value={profileData.business_type}
                      onChange={(e) => handleInputChange('business_type', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Type of business (if applicable)"
                    />
                  </div>
                </div>
                
                {/* Boolean fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="property_owned"
                      checked={profileData.property_owned}
                      onChange={(e) => handleInputChange('property_owned', e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="property_owned" className="text-sm font-medium text-gray-700">
                      Own Property
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="vehicle_owned"
                      checked={profileData.vehicle_owned}
                      onChange={(e) => handleInputChange('vehicle_owned', e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="vehicle_owned" className="text-sm font-medium text-gray-700">
                      Own Vehicle
                    </label>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Update Your Profile</h4>
                      <p className="text-sm text-blue-700">
                        Update your comprehensive financial information to receive personalized tax recommendations, savings advice, and investment guidance.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;