import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../components/ThemeToggle';
import toast from 'react-hot-toast';

type LoginStep = 'role-selection' | 'credentials';
type UserRole = 'student' | 'teacher' | 'nazim' | 'parent' | 'management';

export const LoginPage = () => {
  const [currentStep, setCurrentStep] = useState<LoginStep>('role-selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, clearAuth } = useAuth();

  // The App component will handle routing based on user state
  useEffect(() => {
    console.log('LoginPage - user state changed:', user);
    if (user) {
      console.log('LoginPage - user exists, should redirect to portal');
    }
  }, [user]);

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep('credentials');
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep('role-selection');
    setSelectedRole(null);
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    setIsLoading(true);
    
    try {
      const result = await login(email, password, selectedRole);
      console.log('Login result:', result);
      if (result.success) {
        toast.success(`Login successful! Redirecting to ${selectedRole} portal...`);
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
            Deen Soft
          </h2>
          <p className="mt-1 text-center text-lg text-gray-600 dark:text-gray-400">
            Madrassah Management System
          </p>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {currentStep === 'role-selection' ? 'Select your role to continue' : 'Sign in to your account'}
          </p>
        </div>
        
        {currentStep === 'role-selection' ? (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roleOptions.map((option) => (
                <button
                  key={option.role}
                  onClick={() => handleRoleSelection(option.role)}
                  className={`p-6 rounded-lg border-2 border-dashed transition-all duration-200 ${option.color}`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{option.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                    <p className="text-sm opacity-80">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
            
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
        ) : (
          <div className="mt-8">
            {/* Selected Role Display */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {roleOptions.find(opt => opt.role === selectedRole)?.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {roleOptions.find(opt => opt.role === selectedRole)?.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {roleOptions.find(opt => opt.role === selectedRole)?.description}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleBackToRoleSelection}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Change Role
                </button>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-colors duration-200"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
            >
                  {isLoading ? 'Signing in...' : `Sign in as ${selectedRole}`}
            </button>
          </div>

              {/* Quick login for testing */}
              <div className="mt-4">
            <button
              type="button"
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const result = await login('test@deensoft.com', 'password', selectedRole!);
                      console.log('Test login result:', result);
                      if (result.success) {
                        toast.success(`Test login successful! Redirecting to ${selectedRole} portal...`);
                        console.log('Test login successful, user should be redirected');
                      }
                    } catch (error) {
                      toast.error('Test login failed');
                    } finally {
                      setIsLoading(false);
                    }
              }}
              className="w-full text-xs text-blue-500 hover:text-blue-700 underline"
            >
                  Quick Test Login (Skip credentials)
            </button>
          </div>
        </form>
          </div>
        )}
      </div>
    </div>
  );
};
