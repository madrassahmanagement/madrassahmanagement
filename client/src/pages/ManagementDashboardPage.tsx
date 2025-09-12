import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const ManagementDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 200,
    totalTeachers: 25,
    totalSections: 12,
    totalParents: 180,
    attendanceToday: 96.5,
    systemHealth: 98.2,
    activeUsers: 45,
    pendingApprovals: 8
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'user',
      title: 'New Teacher Registered',
      description: 'Teacher Ahmed Khan has been added to the system',
      time: '1 hour ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'system',
      title: 'System Backup Completed',
      description: 'Daily backup has been successfully completed',
      time: '3 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'approval',
      title: 'Parent Application Pending',
      description: 'Leave application from Parent Sarah needs approval',
      time: '5 hours ago',
      status: 'pending'
    }
  ]);

  const [systemAlerts, setSystemAlerts] = useState([
    {
      id: 1,
      title: 'High Server Load',
      description: 'Server CPU usage is at 85%',
      severity: 'warning',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'Database Optimization',
      description: 'Database performance is optimal',
      severity: 'info',
      time: '1 day ago'
    }
  ]);

  const getRoleDisplayName = () => {
    const roleNames = {
      'management': 'Management',
      'admin': 'Admin',
      'mudir': 'Mudir',
      'raises_jamia': 'Rais e Jamia',
      'shaikul_hadees': 'Shaikul Hadees',
      'senior_mentor': 'Senior Mentor'
    };
    return roleNames[user?.role as keyof typeof roleNames] || 'Management';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.firstName}! ⚙️
        </h1>
        <p className="text-red-100">
          {getRoleDisplayName()} Dashboard - Complete system oversight and control
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Students</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Teachers</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalTeachers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Parents</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalParents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Health</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.systemHealth}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activities</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">
                        {activity.type === 'user' ? '👤' : 
                         activity.type === 'system' ? '⚙️' : '📋'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {activity.status}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">System Alerts</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">
                        {alert.severity === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.severity === 'warning' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {alert.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Management Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">User Management</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Manage all users, roles, and permissions across the system.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Manage Users
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Settings</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Configure system settings, preferences, and global configurations.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            System Settings
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Analytics & Reports</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            View comprehensive analytics and generate detailed reports.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            View Analytics
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Admin Panel</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Access advanced administrative controls and system management.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};
