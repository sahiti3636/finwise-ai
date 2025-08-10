import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Bell, 
  Target,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  FileText,
  PiggyBank,
  TrendingDown,
  Shield,
  CreditCard
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie, BarChart, Bar } from 'recharts';
import { dashboardAPI, taxSavingsAPI, reportsAPI } from '../utils/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [savingsData, setSavingsData] = useState<any[]>([]);
  const [taxBreakdown, setTaxBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsRes = await dashboardAPI.get();
        setStats(statsRes);
        
        // Use mock data for savings since the API doesn't exist yet
        const mockSavingsData = [
          { id: 1, amount: 500, type: 'emergency', date: '2024-01-15' },
          { id: 2, amount: 300, type: 'retirement', date: '2024-01-10' },
          { id: 3, amount: 400, type: 'vacation', date: '2024-01-05' }
        ];
        setSavingsData(mockSavingsData);
        
        const taxRes = await taxSavingsAPI.get();
        // Handle the tax response properly
        if (taxRes && typeof taxRes === 'object' && 'deductions' in taxRes) {
          setTaxBreakdown(taxRes.deductions || []);
        } else {
          setTaxBreakdown([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleDownloadReport = async () => {
    try {
      // Use the reportsAPI.get() to fetch all report data
      const data = await reportsAPI.get();
      // Convert to CSV (simple flat format for demo)
      const flatten = (obj: any, prefix = ''): Record<string, any> =>
        Object.keys(obj).reduce((acc, k) => {
          const pre = prefix.length ? prefix + '_' : '';
          if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) Object.assign(acc, flatten(obj[k], pre + k));
          else acc[pre + k] = obj[k];
          return acc;
        }, {} as Record<string, any>);
      const flat: Record<string, any>[] = Array.isArray(data.reports) ? data.reports.map(flatten) : [flatten(data)];
      const keys = flat.length ? Object.keys(flat[0]) : [];
      const csv = [keys.join(','), ...flat.map((row: Record<string, any>) => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'finwise_report.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Prepare stats for display using real backend data structure
  const statsDisplay = stats ? [
    {
      title: 'Total Savings',
      value: `₹${Number(stats.total_savings || 0).toLocaleString()}`,
      change: stats.progress_percentage ? `${Math.round(stats.progress_percentage)}%` : '0%',
      trend: stats.progress_percentage > 50 ? 'up' : 'down',
      icon: PiggyBank,
      color: 'emerald'
    },
    {
      title: 'Monthly Savings',
      value: `₹${Number(stats.monthly_savings || 0).toLocaleString()}`,
      change: '+8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Savings Goal',
      value: `₹${Number(stats.savings_goal || 0).toLocaleString()}`,
      change: stats.progress_percentage ? `${Math.round(stats.progress_percentage)}%` : '0%',
      trend: stats.progress_percentage > 50 ? 'up' : 'down',
      icon: Target,
      color: 'amber'
    },
    {
      title: 'Tax Recommendations',
      value: stats.recommendations ? stats.recommendations.split(',').length : 0,
      change: '+2',
      trend: 'up',
      icon: Shield,
      color: 'purple'
    }
  ] : [];

  // Prepare savings chart data
  const chartData = [
    { month: 'Jan', savings: 1200, target: 1000 },
    { month: 'Feb', savings: 1400, target: 1000 },
    { month: 'Mar', savings: 1100, target: 1000 },
    { month: 'Apr', savings: 1600, target: 1000 },
    { month: 'May', savings: 1300, target: 1000 },
    { month: 'Jun', savings: 1800, target: 1000 }
  ];

  // Prepare financial breakdown data
  const financialBreakdown = [
    { name: 'Savings', value: stats?.total_savings || 0, color: '#10b981' },
    { name: 'Investments', value: stats?.investment_amount || 0, color: '#3b82f6' },
    { name: 'Emergency Fund', value: stats?.emergency_fund || 0, color: '#f59e0b' },
    { name: 'Retirement', value: stats?.retirement_savings || 0, color: '#ef4444' }
  ].filter(item => item.value > 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Profile Update Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadReport}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition font-medium"
        >
          <FileText className="h-5 w-5" />
          <span>Download Report</span>
        </button>
      </div>
      
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's your comprehensive financial overview for this month</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsDisplay.map((stat, index) => (
          <motion.div
            key={stat.title}
            whileHover={{ scale: 1.02 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span className="font-medium">{stat.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Savings Trend Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Savings Trend</h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-600">Actual Savings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Target</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Financial Breakdown */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Breakdown</h2>
            {financialBreakdown.length > 0 ? (
              <>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                      data={financialBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                      dataKey="value"
                >
                      {financialBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                      formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
                  {financialBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                      <span className="text-sm font-medium text-gray-900">₹{Number(item.value).toLocaleString()}</span>
                </div>
              ))}
            </div>
              </>
            ) : (
              <div className="text-center py-8">
                <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Update your profile to see financial breakdown</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tax Recommendations */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personalized Tax Recommendations</h2>
          {stats && stats.recommendations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.recommendations.split(',').map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{recommendation.trim()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Update your profile to get personalized tax recommendations</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;