import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const StudentProgressPage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    overallScore: 87,
    attendance: 95,
    namaz: 88,
    discipline: 92,
    fitness: 85,
    dailyLearning: 90
  });

  const [recentProgress, setRecentProgress] = useState([
    {
      id: 1,
      subject: 'Quran Recitation',
      score: 90,
      date: '2024-01-20',
      teacher: 'Teacher Ahmed',
      status: 'excellent'
    },
    {
      id: 2,
      subject: 'Islamic Studies',
      score: 85,
      date: '2024-01-19',
      teacher: 'Teacher Fatima',
      status: 'good'
    },
    {
      id: 3,
      subject: 'Arabic Language',
      score: 78,
      date: '2024-01-18',
      teacher: 'Teacher Ali',
      status: 'needs_improvement'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      case 'needs_improvement':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          My Progress 📊
        </h1>
        <p className="text-blue-100">
          Track your learning journey and academic performance
        </p>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Overall Score</h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {progress.overallScore}%
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress.overallScore}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Attendance</h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {progress.attendance}%
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-green-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress.attendance}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Namaz</h3>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {progress.namaz}%
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-purple-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress.namaz}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Discipline</h3>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {progress.discipline}%
            </div>
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-yellow-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress.discipline}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fitness</h3>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {progress.fitness}%
            </div>
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-red-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress.fitness}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily Learning</h3>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {progress.dailyLearning}%
            </div>
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200 dark:text-gray-700"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progress.dailyLearning}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Progress */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Progress</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentProgress.map((item) => (
            <div key={item.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.subject}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.teacher} • {item.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.score}%
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
