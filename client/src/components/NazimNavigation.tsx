import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { 
  HomeIcon, 
  UsersIcon,
  UserGroupIcon,
  BookOpenIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export const NazimNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Students', href: '/students', icon: UsersIcon },
    { name: 'Teachers', href: '/teachers', icon: UserGroupIcon },
    { name: 'Teacher Tracking', href: '/teacher-tracking', icon: UserGroupIcon },
    { name: 'Sections', href: '/sections', icon: UserGroupIcon },
    { name: 'Daily Learning', href: '/daily-learning', icon: BookOpenIcon },
    { name: 'Student Scoring', href: '/student-scoring', icon: StarIcon },
    { name: 'Attendance', href: '/attendance', icon: ClipboardDocumentCheckIcon },
    { name: 'Namaz Tracking', href: '/namaz', icon: BookOpenIcon },
    { name: 'Islamic Studies', href: '/islamic-studies', icon: AcademicCapIcon },
    { name: 'Discipline', href: '/discipline', icon: ExclamationTriangleIcon },
    { name: 'Fitness', href: '/fitness', icon: HeartIcon },
    { name: 'Parent Portal', href: '/parent-portal', icon: UsersIcon },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 bg-white dark:bg-gray-800 shadow-lg transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <XMarkIcon className="block h-6 w-6" />
          ) : (
            <Bars3Icon className="block h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-xl transition-colors duration-200">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Nazim Portal
                </h1>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          isActive(item.href)
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                            : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white'
                        } group flex items-center px-3 py-2 text-sm font-medium border-l-4 rounded-r-md transition-colors duration-200`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              
              {/* User info and logout */}
              <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-8 w-8">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Nazim
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Nazim Portal
              </h1>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
                          : 'border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white'
                      } group flex items-center px-2 py-2 text-sm font-medium border-l-4 rounded-r-md transition-colors duration-200`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            {/* User info and logout */}
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-8 w-8">
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Nazim
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
