import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label="Toggle dark mode"
    >
      <span
        className={`${
          theme === 'dark' ? 'translate-x-5 sm:translate-x-7' : 'translate-x-0.5 sm:translate-x-1'
        } inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-lg flex items-center justify-center`}
      >
        {theme === 'dark' ? (
          <MoonIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
        ) : (
          <SunIcon className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
        )}
      </span>
    </button>
  );
};
