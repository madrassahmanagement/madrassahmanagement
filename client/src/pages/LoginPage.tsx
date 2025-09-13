import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../components/ThemeToggle';
import toast from 'react-hot-toast';

type UserRole = 'student' | 'teacher' | 'nazim' | 'parent' | 'management';

export const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, clearAuth } = useAuth();

  // The App component will handle routing based on user state
  useEffect(() => {
    console.log('LoginPage - user state changed:', user);
    if (user) {
      console.log('LoginPage - user exists, should redirect to portal');
    }
  }, [user]);

  const handleRoleSelection = async (role: UserRole) => {
    setSelectedRole(role);
    setIsLoading(true);
    
    try {
      const result = await login('demo@deensoft.com', 'password', role);
      console.log('Login result:', result);
      if (result.success) {
        toast.success(`Login successful! Redirecting to ${role} portal...`);
        console.log('Login successful, user should be redirected');
        // The App component will handle routing based on user state
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      role: 'student' as UserRole,
      title: 'Student',
      description: 'Access your learning progress, assignments, and grades',
      icon: '🎓',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900 dark:hover:bg-blue-800 dark:border-blue-700 dark:text-blue-200'
    },
    {
      role: 'teacher' as UserRole,
      title: 'Teacher',
      description: 'Manage your classes, track students, and mark attendance',
      icon: '👨‍🏫',
      color: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-800 dark:bg-green-900 dark:hover:bg-green-800 dark:border-green-700 dark:text-green-200'
    },
    {
      role: 'nazim' as UserRole,
      title: 'Nazim',
      description: 'Oversee daily operations and student management',
      icon: '📋',
      color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:hover:bg-yellow-800 dark:border-yellow-700 dark:text-yellow-200'
    },
    {
      role: 'parent' as UserRole,
      title: 'Parent',
      description: 'Monitor your child\'s progress and communicate with teachers',
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800 dark:bg-purple-900 dark:hover:bg-purple-800 dark:border-purple-700 dark:text-purple-200'
    },
    {
      role: 'management' as UserRole,
      title: 'Management',
      description: 'Full system access for administration and oversight',
      icon: '⚙️',
      color: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-800 dark:bg-red-900 dark:hover:bg-red-800 dark:border-red-700 dark:text-red-200'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <div className="flex items-center justify-center">
          <ThemeToggle />
        </div>
      </div>
      
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Saut Ul Quran Education House
          </h2>
          <p className="mt-1 text-center text-lg text-gray-600 dark:text-gray-400">
            DeenSoft by Power Project
          </p>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Click on your role to sign in directly
          </p>
        </div>
        
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleOptions.map((option) => (
            <button
                key={option.role}
                onClick={() => handleRoleSelection(option.role)}
              disabled={isLoading}
                className={`p-6 rounded-lg border-2 border-dashed transition-all duration-200 ${option.color} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                  <p className="text-sm opacity-80">{option.description}</p>
                </div>
            </button>
            ))}
          </div>

          {isLoading && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center text-blue-600 dark:text-blue-400">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            </div>
          )}
          
          {/* Debug buttons */}
          <div className="mt-8 space-y-2">
            <button
              type="button"
              onClick={() => {
                clearAuth();
                toast.success('Auth cleared - please refresh page');
              }}
              className="w-full text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear Auth & Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
