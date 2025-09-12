import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { TeacherDashboardPage } from '../pages/TeacherDashboardPage';
import { StudentsPage } from '../pages/StudentsPage';
import { DailyLearningPage } from '../pages/DailyLearningPage';
import { StudentScoringPage } from '../pages/StudentScoringPage';
import { AttendancePage } from '../pages/AttendancePage';
import { NamazPage } from '../pages/NamazPage';
import { IslamicStudiesPage } from '../pages/IslamicStudiesPage';
import { DisciplinePage } from '../pages/DisciplinePage';
import { FitnessPage } from '../pages/FitnessPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { TeacherNavigation } from './TeacherNavigation';

export const TeacherPortal = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'teacher') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row transition-colors duration-200">
      {/* Teacher Navigation */}
      <TeacherNavigation />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              <Routes>
                <Route path="/" element={<TeacherDashboardPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/daily-learning" element={<DailyLearningPage />} />
                <Route path="/student-scoring" element={<StudentScoringPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/namaz" element={<NamazPage />} />
                <Route path="/islamic-studies" element={<IslamicStudiesPage />} />
                <Route path="/discipline" element={<DisciplinePage />} />
                <Route path="/fitness" element={<FitnessPage />} />
                <Route path="/reports" element={<ReportsPage />} />
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
