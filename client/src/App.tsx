import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { StudentsPage } from './pages/StudentsPage'
import { AddStudentPage } from './pages/AddStudentPage'
import { TeachersPage } from './pages/TeachersPage'
import { AttendancePage } from './pages/AttendancePage'
import { NamazPage } from './pages/NamazPage'
import { IslamicStudiesPage } from './pages/IslamicStudiesPage'
import { DisciplinePage } from './pages/DisciplinePage'
import { FitnessPage } from './pages/FitnessPage'
import { ReportsPage } from './pages/ReportsPage'
import { AdminPage } from './pages/AdminPage'
import { SettingsPage } from './pages/SettingsPage'
import { Layout } from './components/Layout'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const { user, isLoading } = useAuth()

  console.log('App render - user:', user, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <LoadingSpinner size="lg" />
        </div>
      </ThemeProvider>
    )
  }

  if (!user) {
    return (
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/add" element={<AddStudentPage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/namaz" element={<NamazPage />} />
          <Route path="/islamic-studies" element={<IslamicStudiesPage />} />
          <Route path="/discipline" element={<DisciplinePage />} />
          <Route path="/fitness" element={<FitnessPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {user.role === 'admin' && (
            <Route path="/admin" element={<AdminPage />} />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App
