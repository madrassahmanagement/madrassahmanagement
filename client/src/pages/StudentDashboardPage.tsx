import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    attendance: 95,
    namaz: 88,
    overallScore: 85,
    assignments: 12,
    completed: 10,
    pending: 2
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'assignment',
      title: 'Quran Recitation Assignment',
      subject: 'Islamic Studies',
      dueDate: '2024-01-20',
      status: 'completed',
      score: 85
    },
    {
      id: 2,
      type: 'score',
      title: 'Daily Learning Score',
      subject: 'General',
      date: '2024-01-19',
      status: 'completed',
      score: 90
    },
    {
      id: 3,
      type: 'namaz',
      title: 'Namaz Tracking',
      subject: 'Spiritual',
      date: '2024-01-19',
      status: 'completed',
      score: 95
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-blue-100">
          Here's your learning progress and upcoming activities
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Attendance</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.attendance}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">🕌</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Namaz</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.namaz}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Overall Score</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.overallScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Assignments</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.completed}/{stats.assignments}
              </p>
            </div>
          </div>
        </div>
      </div>

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
                      {activity.type === 'assignment' ? '📝' : 
                       activity.type === 'score' ? '⭐' : '🕌'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.subject} • {activity.dueDate || activity.date}
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
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.score}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">My Progress</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Track your learning progress and see how you're doing in different subjects.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            View Progress
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Assignments</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            View and submit your assignments. You have {stats.pending} pending assignments.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            View Assignments
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Namaz Tracking</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Track your daily prayers and spiritual activities.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Track Namaz
          </button>
        </div>
      </div>
    </div>
  );
};
