import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { StudentDashboardPage } from './StudentDashboardPage';
import { TeacherDashboardPage } from './TeacherDashboardPage';
import { ParentDashboardPage } from './ParentDashboardPage';
import { NazimDashboardPage } from './NazimDashboardPage';
import { ManagementDashboardPage } from './ManagementDashboardPage';
import toast from 'react-hot-toast';
import { studentsAPI } from '../services/api';
import { 
  UsersIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 24,
    totalClasses: 12,
    attendanceToday: 94.2,
    namazToday: 87.5,
    islamicStudies: 91.3,
    discipline: 96.8
  });

  // Load real data from API
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const response = await studentsAPI.getAll();
        const students = response.data || [];
        
        setStats(prev => ({
          ...prev,
          totalStudents: students.length,
          totalClasses: new Set(students.map((s: any) => s.currentClass?.name || s.currentClass)).size
        }));
      } catch (error) {
        console.error('Error loading stats:', error);
        
        // Fallback to localStorage
        const storedStudents = localStorage.getItem('students');
        if (storedStudents) {
          const students = JSON.parse(storedStudents);
          setStats(prev => ({
            ...prev,
            totalStudents: students.length,
            totalClasses: new Set(students.map((s: any) => s.currentClass)).size
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const [recentActivities] = useState([
    { id: 1, type: 'attendance', message: 'Class 5A attendance marked', time: '2 minutes ago', status: 'success' },
    { id: 2, type: 'namaz', message: 'Ahmed missed Fajr prayer', time: '15 minutes ago', status: 'warning' },
    { id: 3, type: 'islamic', message: 'Sabaq completed for Class 3B', time: '1 hour ago', status: 'success' },
    { id: 4, type: 'discipline', message: 'Behavior issue reported for Sarah', time: '2 hours ago', status: 'error' },
    { id: 5, type: 'fitness', message: 'Fitness assessment completed', time: '3 hours ago', status: 'success' }
  ]);

  const quickActions = [
    { 
      name: 'Mark Attendance', 
      href: '/attendance', 
      icon: ClipboardDocumentCheckIcon, 
      color: 'bg-blue-500',
      action: () => {
        navigate('/attendance');
      }
    },
    { 
      name: 'Record Namaz', 
      href: '/namaz', 
      icon: BookOpenIcon, 
      color: 'bg-green-500',
      action: () => {
        navigate('/namaz');
      }
    },
    { 
      name: 'Islamic Studies', 
      href: '/islamic-studies', 
      icon: AcademicCapIcon, 
      color: 'bg-purple-500',
      action: () => {
        navigate('/islamic-studies');
      }
    },
    { 
      name: 'Discipline', 
      href: '/discipline', 
      icon: ExclamationTriangleIcon, 
      color: 'bg-red-500',
      action: () => {
        navigate('/discipline');
      }
    },
    { 
      name: 'Fitness', 
      href: '/fitness', 
      icon: HeartIcon, 
      color: 'bg-pink-500',
      action: () => {
        navigate('/fitness');
      }
    },
    { 
      name: 'Generate Reports', 
      href: '/reports', 
      icon: ChartBarIcon, 
      color: 'bg-indigo-500',
      action: () => {
        navigate('/reports');
      }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-3 w-3 sm:h-5 sm:w-5 text-green-500" />;
      case 'warning':
        return <ClockIcon className="h-3 w-3 sm:h-5 sm:w-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-3 w-3 sm:h-5 sm:w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-3 w-3 sm:h-5 sm:w-5 text-gray-500" />;
    }
  };

  // Show role-specific dashboards
  if (user?.role === 'student') {
    return <StudentDashboardPage />;
  }

  if (user?.role === 'teacher') {
    return <TeacherDashboardPage />;
  }

  if (user?.role === 'parent') {
    return <ParentDashboardPage />;
  }

  if (user?.role === 'nazim') {
    return <NazimDashboardPage />;
  }

  if (['management', 'admin', 'mudir', 'raises_jamia', 'shaikul_hadees', 'senior_mentor'].includes(user?.role || '')) {
    return <ManagementDashboardPage />;
  }

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-7 text-gray-900 truncate">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome to the Madrassah Management System
          </p>
        </div>
        <div className="flex sm:mt-0">
          <Link
            to="/students"
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Students */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Total Students
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.totalStudents}</dd>
                </dl>
              </div>
            </div>
            <div className="mt-1 flex items-center text-xs sm:text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">+12% from last month</span>
            </div>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Total Teachers
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.totalTeachers}</dd>
                </dl>
              </div>
            </div>
            <div className="mt-1 flex items-center text-xs sm:text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">+2 new this month</span>
            </div>
          </div>
        </div>

        {/* Total Classes */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Total Classes
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.totalClasses}</dd>
                </dl>
              </div>
            </div>
            <div className="mt-1 flex items-center text-xs sm:text-sm text-gray-500">
              <span className="truncate">Active classes</span>
            </div>
          </div>
        </div>

        {/* Attendance Today */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentCheckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Attendance Today
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.attendanceToday}%</dd>
                </dl>
              </div>
            </div>
            <div className="mt-1 flex items-center text-xs sm:text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="truncate">+5.2% from yesterday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Namaz Today
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.namazToday}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Islamic Studies
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.islamicStudies}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Discipline
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">{stats.discipline}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HeartIcon className="h-6 w-6 sm:h-8 sm:w-8 text-pink-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Fitness
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">89.2%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-3 py-4 sm:px-4 sm:py-5 lg:p-6">
            <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={action.action}
                    className="relative group bg-white p-4 sm:p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer text-left w-full"
                  >
                    <div>
                      <span className={`rounded-lg inline-flex p-2 sm:p-3 ${action.color} text-white`}>
                        <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                      </span>
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <h3 className="text-sm sm:text-lg font-medium text-gray-900">
                        {action.name}
                      </h3>
                    </div>
                    <span
                      className="pointer-events-none absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-300 group-hover:text-gray-400"
                      aria-hidden="true"
                    >
                      <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                      </svg>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-3 py-4 sm:px-4 sm:py-5 lg:p-6">
            <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900 mb-3 sm:mb-4">
              Recent Activities
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-2 sm:space-x-3">
                        <div>
                          <span className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-100 flex items-center justify-center ring-4 sm:ring-8 ring-white">
                            {getStatusIcon(activity.status)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1 sm:pt-1.5 flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm text-gray-500">{activity.message}</p>
                          </div>
                          <div className="text-left sm:text-right text-xs sm:text-sm whitespace-nowrap text-gray-500 mt-1 sm:mt-0">
                            <time>{activity.time}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
