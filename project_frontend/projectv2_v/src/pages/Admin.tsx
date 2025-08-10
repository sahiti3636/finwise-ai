import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Users, 
  BarChart3, 
  Shield, 
  Database,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus,
  FileText
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock user data - in production, this would come from an API
  const mockUsers = [
    { id: 1, username: 'john_doe', email: 'john@example.com', status: 'active', joined: '2024-01-15' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', status: 'active', joined: '2024-01-20' },
    { id: 3, username: 'bob_wilson', email: 'bob@example.com', status: 'inactive', joined: '2024-01-25' },
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'system', name: 'System', icon: Database },
  ];

  const systemStats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: '+5%',
      trend: 'up',
      icon: Activity,
      color: 'emerald'
    },
    {
      title: 'Reports Generated',
      value: '8,593',
      change: '+28%',
      trend: 'up',
      icon: FileText,
      color: 'purple'
    },
    {
      title: 'System Health',
      value: '99.9%',
      change: 'Uptime',
      trend: 'stable',
      icon: Shield,
      color: 'amber'
    }
  ];

  const userGrowthData = [
    { month: 'Jan', users: 1200, active: 980 },
    { month: 'Feb', users: 1350, active: 1100 },
    { month: 'Mar', users: 1580, active: 1280 },
    { month: 'Apr', users: 1820, active: 1450 },
    { month: 'May', users: 2100, active: 1680 },
    { month: 'Jun', users: 2400, active: 1920 },
    { month: 'Jul', users: 2847, active: 2234 },
  ];

  const reportsData = [
    { type: 'Tax Reports', count: 3247, color: '#10b981' },
    { type: 'Investment', count: 2891, color: '#3b82f6' },
    { type: 'Benefits', count: 1876, color: '#8b5cf6' },
    { type: 'Planning', count: 1234, color: '#f59e0b' },
  ];

  const recentUsers = [
    { id: 1, name: 'Arjun Patel', email: 'arjun.patel@email.com', joinDate: '2024-07-15', status: 'active' },
    { id: 2, name: 'Meera Singh', email: 'meera.singh@email.com', joinDate: '2024-07-14', status: 'active' },
    { id: 3, name: 'Ravi Kumar', email: 'ravi.kumar@email.com', joinDate: '2024-07-13', status: 'pending' },
    { id: 4, name: 'Anita Sharma', email: 'anita.sharma@email.com', joinDate: '2024-07-12', status: 'active' },
    { id: 5, name: 'Suresh Gupta', email: 'suresh.gupta@email.com', joinDate: '2024-07-11', status: 'inactive' },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High API Usage',
      description: 'Tax calculation API usage is at 85% of daily limit',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'Scheduled Maintenance',
      description: 'System maintenance scheduled for this weekend',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'success',
      title: 'Backup Completed',
      description: 'Daily database backup completed successfully',
      time: '6 hours ago'
    }
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
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">Monitor system performance and manage platform operations</p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* System Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemStats.map((stat, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">User Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
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
                      dataKey="users" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      name="Total Users"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="active" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Active Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Reports by Type</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="type" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* System Alerts */}
          <motion.div variants={itemVariants}>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">System Alerts</h2>
              <div className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border-l-4 ${
                      alert.type === 'warning' 
                        ? 'border-amber-500 bg-amber-50' 
                        : alert.type === 'success'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                        {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                        {alert.type === 'info' && <Clock className="h-5 w-5 text-blue-600" />}
                        <div>
                          <h3 className="font-medium text-gray-900">{alert.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{alert.description}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'users' && (
        <motion.div variants={itemVariants}>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">User Management</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Joined</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{user.joined}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'reports' && (
        <motion.div variants={itemVariants}>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Report Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportsData.map((report, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{report.type}</span>
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: report.color }}
                    ></div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{report.count.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Generated this month</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'system' && (
        <motion.div variants={itemVariants}>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">System Settings</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">API Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax API Rate Limit:</span>
                      <span className="font-medium">1000/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Report Generation Limit:</span>
                      <span className="font-medium">500/hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AI Chat Limit:</span>
                      <span className="font-medium">2000/hour</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Storage Usage</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Database Size:</span>
                      <span className="font-medium">2.4 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">File Storage:</span>
                      <span className="font-medium">8.7 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Backup Size:</span>
                      <span className="font-medium">1.2 GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Admin;