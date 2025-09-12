import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ParentDashboardPage } from '../pages/ParentDashboardPage';
import { ParentPortalPage } from '../pages/ParentPortalPage';
import { ParentSuggestionsPage } from '../pages/ParentSuggestionsPage';
import { ParentApplicationsPage } from '../pages/ParentApplicationsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ParentNavigation } from './ParentNavigation';

export const ParentPortal = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'parent') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row transition-colors duration-200">
      {/* Parent Navigation */}
      <ParentNavigation />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              <Routes>
                <Route path="/" element={<ParentDashboardPage />} />
                <Route path="/parent-portal" element={<ParentPortalPage />} />
                <Route path="/suggestions" element={<ParentSuggestionsPage />} />
                <Route path="/applications" element={<ParentApplicationsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
