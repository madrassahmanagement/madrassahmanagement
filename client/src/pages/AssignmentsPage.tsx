import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AssignmentsPage = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Quran Recitation - Surah Al-Fatiha',
      subject: 'Quran Studies',
      teacher: 'Teacher Ahmed',
      dueDate: '2024-01-25',
      status: 'pending',
      description: 'Memorize and recite Surah Al-Fatiha with proper tajweed',
      points: 100
    },
    {
      id: 2,
      title: 'Arabic Grammar Exercise',
      subject: 'Arabic Language',
      teacher: 'Teacher Fatima',
      dueDate: '2024-01-23',
      status: 'completed',
      description: 'Complete exercises 1-10 from chapter 3',
      points: 85,
      submittedDate: '2024-01-22'
    },
    {
      id: 3,
      title: 'Islamic History Essay',
      subject: 'Islamic Studies',
      teacher: 'Teacher Ali',
      dueDate: '2024-01-30',
      status: 'in_progress',
      description: 'Write a 500-word essay about the life of Prophet Muhammad (PBUH)',
      points: 150
    }
  ]);

  const [submittedAssignments, setSubmittedAssignments] = useState([
    {
      id: 2,
      title: 'Arabic Grammar Exercise',
      subject: 'Arabic Language',
      teacher: 'Teacher Fatima',
      submittedDate: '2024-01-22',
      score: 85,
      feedback: 'Good work! Pay attention to the verb conjugations.',
      status: 'graded'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'graded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'graded':
        return 'Graded';
      default:
        return status;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          My Assignments 📝
        </h1>
        <p className="text-purple-100">
          View and submit your assignments
        </p>
      </div>

      {/* Assignment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {assignments.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">In Progress</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {assignments.filter(a => a.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Completed</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {assignments.filter(a => a.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Current Assignments</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {assignment.title}
                    </h3>
                    {isOverdue(assignment.dueDate) && assignment.status !== 'completed' && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Overdue
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {assignment.subject} • {assignment.teacher}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {assignment.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Due: {assignment.dueDate}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Points: {assignment.points}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                    {getStatusText(assignment.status)}
                  </span>
                  {assignment.status === 'pending' && (
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200">
                      Start
                    </button>
                  )}
                  {assignment.status === 'in_progress' && (
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200">
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submitted Assignments */}
      {submittedAssignments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Submitted Assignments</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {submittedAssignments.map((assignment) => (
              <div key={assignment.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {assignment.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {assignment.subject} • {assignment.teacher}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Submitted: {assignment.submittedDate}
                    </p>
                    {assignment.feedback && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                        Feedback: {assignment.feedback}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {assignment.score}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Score
                      </div>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                      {getStatusText(assignment.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
