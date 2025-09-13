import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const TeacherDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 45,
    classesAssigned: 3,
    attendanceMarked: 42,
    pendingTasks: 8,
    averageScore: 87
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'attendance',
      title: 'Class 1A Attendance',
      time: '09:00 AM',
      status: 'completed',
      students: 15
    },
    {
      id: 2,
      type: 'scoring',
      title: 'Daily Learning Scores',
      time: '10:30 AM',
      status: 'completed',
      students: 15
    },
    {
      id: 3,
      type: 'namaz',
      title: 'Namaz Tracking',
      time: '12:00 PM',
      status: 'pending',
      students: 15
    }
  ]);

  const [upcomingTasks, setUpcomingTasks] = useState([
    {
      id: 1,
      title: 'Mark Class 2B Attendance',
      time: '02:00 PM',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Update Student Scores',
      time: '03:30 PM',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Prepare Tomorrow\'s Lesson',
      time: '04:00 PM',
      priority: 'low'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Assalam-u-Alaikum, {user?.firstName}! 👨‍🏫
        </h1>
        <p className="text-green-100">
          Here's your teaching dashboard and today's tasks
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Classes</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.classesAssigned}</p>
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
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.attendanceMarked}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.pendingTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Avg Score</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.averageScore}%</p>
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
                         activity.type === 'scoring' ? '⭐' : '🕌'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.time} • {activity.students} students
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    activity.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Tasks</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">⏰</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {task.time}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Mark Attendance</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Mark attendance for your classes quickly and efficiently.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Mark Attendance
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Student Scoring</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Score students on discipline, uniform, fitness, and more.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Score Students
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily Learning</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Track daily learning progress (Muatlia, Sabaq, Sabqi, Manzil).
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            Track Learning
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Reports</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Generate reports for your classes and students.
          </p>
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};
