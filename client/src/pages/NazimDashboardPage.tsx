import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const NazimDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 150,
    totalTeachers: 12,
    totalSections: 8,
    attendanceToday: 94.2,
    disciplineScore: 96.8,
    pendingIssues: 3
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'attendance',
      title: 'Class 5A Attendance',
      description: 'All students present, marked by Teacher Ahmed',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'discipline',
      title: 'Discipline Issue Resolved',
      description: 'Student behavior issue in Class 3B has been addressed',
      time: '4 hours ago',
      status: 'resolved'
    },
    {
      id: 3,
      type: 'scoring',
      title: 'Daily Learning Scores',
      description: 'Scores updated for all classes',
      time: '6 hours ago',
      status: 'completed'
    }
  ]);

  const [pendingIssues, setPendingIssues] = useState([
    {
      id: 1,
      title: 'Teacher Absence',
      description: 'Teacher Fatima is absent, need substitute',
      priority: 'high',
      time: '1 hour ago'
    },
    {
      id: 2,
      title: 'Student Discipline',
      description: 'Student Ali needs attention for behavior',
      priority: 'medium',
      time: '3 hours ago'
    },
    {
      id: 3,
      title: 'Equipment Maintenance',
      description: 'Projector in Class 2A needs repair',
      priority: 'low',
      time: '1 day ago'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Good day, {user?.firstName}! 📋
        </h1>
        <p className="text-yellow-100">
          Here's your daily operations overview and management tasks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Students</h3>
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Teachers</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalTeachers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sections</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalSections}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Attendance</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.attendanceToday}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Discipline</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.disciplineScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending</h3>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pendingIssues}</p>
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
                        {activity.type === 'attendance' ? '📝' : 
                         activity.type === 'discipline' ? '⚠️' : '⭐'}
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

        {/* Pending Issues */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Pending Issues</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {pendingIssues.map((issue) => (
              <div key={issue.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {issue.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      issue.priority === 'high' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : issue.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {issue.priority}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {issue.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Student Management</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Manage student records, attendance, and academic progress.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Manage Students
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Teacher Oversight</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Monitor teacher performance and class management.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Monitor Teachers
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Section Management</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Organize and manage class sections and assignments.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Manage Sections
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Reports & Analytics</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Generate comprehensive reports and analytics.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};
