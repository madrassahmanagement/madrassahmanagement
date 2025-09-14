import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ManagementDashboardPage } from '../pages/ManagementDashboardPage';
import { StudentsPage } from '../pages/StudentsPage';
import { TeachersPage } from '../pages/TeachersPage';
import { TeacherTrackingPage } from '../pages/TeacherTrackingPage';
import { ExamManagementPage } from '../pages/ExamManagementPage';
import { StudentProgressTrackingPage } from '../pages/StudentProgressTrackingPage';
import { StudentScoringSystemPage } from '../pages/StudentScoringSystemPage';
import { EnhancedNamazTrackingPage } from '../pages/EnhancedNamazTrackingPage';
import { FeeManagementPage } from '../pages/FeeManagementPage';
import { SectionsPage } from '../pages/SectionsPage';
import { DailyLearningPage } from '../pages/DailyLearningPage';
import { StudentScoringPage } from '../pages/StudentScoringPage';
import { AttendancePage } from '../pages/AttendancePage';
import { NamazPage } from '../pages/NamazPage';
import { IslamicStudiesPage } from '../pages/IslamicStudiesPage';
import { DisciplinePage } from '../pages/DisciplinePage';
import { FitnessPage } from '../pages/FitnessPage';
import { ParentPortalPage } from '../pages/ParentPortalPage';
import { ReportsPage } from '../pages/ReportsPage';
import { AdminPage } from '../pages/AdminPage';
import { RoleManagementPage } from '../pages/RoleManagementPage';
import { SettingsPage } from '../pages/SettingsPage';
import { RaisJamiaNavigation } from './RaisJamiaNavigation';

export const RaisJamiaPortal = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'raises_jamia') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row transition-colors duration-200">
      {/* Rais e Jamia Navigation */}
      <RaisJamiaNavigation />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className="py-4 sm:py-6">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
              <Routes>
                <Route path="/" element={<ManagementDashboardPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/teacher-tracking" element={<TeacherTrackingPage />} />
                <Route path="/exam-management" element={<ExamManagementPage />} />
                <Route path="/student-progress-tracking" element={<StudentProgressTrackingPage />} />
                <Route path="/student-scoring-system" element={<StudentScoringSystemPage />} />
                <Route path="/enhanced-namaz-tracking" element={<EnhancedNamazTrackingPage />} />
                <Route path="/fee-management" element={<FeeManagementPage />} />
                <Route path="/sections" element={<SectionsPage />} />
                <Route path="/daily-learning" element={<DailyLearningPage />} />
                <Route path="/student-scoring" element={<StudentScoringPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/namaz" element={<NamazPage />} />
                <Route path="/islamic-studies" element={<IslamicStudiesPage />} />
                <Route path="/discipline" element={<DisciplinePage />} />
                <Route path="/fitness" element={<FitnessPage />} />
                <Route path="/parent-portal" element={<ParentPortalPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/role-management" element={<RoleManagementPage />} />
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


