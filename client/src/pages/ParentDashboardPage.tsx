import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const ParentDashboardPage = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([
    {
      id: 1,
      name: 'Ahmed Ali',
      rollNumber: '2024-001',
      class: 'Class 5A',
      attendance: 95,
      overallScore: 87,
      lastActivity: '2 hours ago',
      status: 'active'
    },
    {
      id: 2,
      name: 'Fatima Khan',
      rollNumber: '2024-002',
      class: 'Class 3B',
      attendance: 92,
      overallScore: 91,
      lastActivity: '1 day ago',
      status: 'active'
    }
  ]);

  const [recentUpdates, setRecentUpdates] = useState([
    {
      id: 1,
      childName: 'Ahmed Ali',
      type: 'score',
      title: 'Daily Learning Score Updated',
      description: 'Ahmed received 90% in today\'s learning assessment',
      time: '2 hours ago',
      score: 90
    },
    {
      id: 2,
      childName: 'Fatima Khan',
      type: 'attendance',
      title: 'Attendance Marked',
      description: 'Fatima was present for all classes today',
      time: '1 day ago',
      status: 'present'
    },
    {
      id: 3,
      childName: 'Ahmed Ali',
      type: 'namaz',
      title: 'Namaz Tracking',
      description: 'Ahmed completed Fajr and Isha prayers',
      time: '2 days ago',
      status: 'completed'
    }
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Monthly Parent Meeting',
      description: 'Join us for the monthly parent-teacher meeting on January 25th',
      date: '2024-01-25',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Exam Schedule Released',
      description: 'Quarterly exams will be held from February 1-5, 2024',
      date: '2024-02-01',
      type: 'exam'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.firstName}! 👨‍👩‍👧‍👦
        </h1>
        <p className="text-purple-100">
          Monitor your children's progress and stay connected with their education
        </p>
      </div>

      {/* Children Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => (
          <div key={child.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {child.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Roll No: {child.rollNumber} • {child.class}
                </p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                child.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {child.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Attendance</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {child.attendance}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${child.attendance}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Overall Score</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {child.overallScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${child.overallScore}%` }}
                ></div>
              </div>
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last activity: {child.lastActivity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Updates */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Updates</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentUpdates.map((update) => (
              <div key={update.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">
                      {update.type === 'score' ? '⭐' : 
                       update.type === 'attendance' ? '📝' : '🕌'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {update.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {update.childName} • {update.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {update.time}
                    </p>
                  </div>
                  {update.score && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {update.score}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Announcements</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">
                      {announcement.type === 'meeting' ? '👥' : '📅'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {announcement.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {announcement.date}
                    </p>
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Progress Tracking</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            View detailed progress reports for all your children.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            View Progress
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Suggestions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Submit suggestions or feedback to the management.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Submit Suggestion
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Applications</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Submit applications for leave or other requests.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Submit Application
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Update your profile information and preferences.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};
