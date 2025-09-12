import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { StudentDashboardPage } from '../pages/StudentDashboardPage';
import { StudentProgressPage } from '../pages/StudentProgressPage';
import { AssignmentsPage } from '../pages/AssignmentsPage';
import { MyScoresPage } from '../pages/MyScoresPage';
import { NamazPage } from '../pages/NamazPage';
import { SettingsPage } from '../pages/SettingsPage';
import { StudentNavigation } from './StudentNavigation';

export const StudentPortal = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'student') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row transition-colors duration-200">
      {/* Student Navigation */}
      <StudentNavigation />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              <Routes>
                <Route path="/" element={<StudentDashboardPage />} />
                <Route path="/student-progress" element={<StudentProgressPage />} />
                <Route path="/assignments" element={<AssignmentsPage />} />
                <Route path="/my-scores" element={<MyScoresPage />} />
                <Route path="/namaz" element={<NamazPage />} />
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
