import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleBasedNavigation } from './RoleBasedNavigation';
import { ThemeToggle } from './ThemeToggle';
import toast from 'react-hot-toast';
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row transition-colors duration-200">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <RoleBasedNavigation />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <RoleBasedNavigation />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  <span className="hidden sm:inline">Madrassah Management System</span>
                  <span className="sm:hidden">MMS</span>
                </h1>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Theme Toggle */}
                <div className="flex items-center">
                  <ThemeToggle />
                </div>

                {/* Notifications */}
                <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 relative transition-colors duration-200">
                  <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center text-[10px] sm:text-xs">
                    3
                  </span>
                </button>

                {/* Settings */}
                <button 
                  onClick={() => navigate('/settings')}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors duration-200"
                  title="Settings"
                >
                  <Cog6ToothIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>

                {/* User menu */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <UserCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 dark:text-gray-300" />
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-32">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-2 py-1.5 sm:px-3 sm:py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
