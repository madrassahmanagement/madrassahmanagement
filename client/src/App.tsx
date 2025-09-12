import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { LoginPage } from './pages/LoginPage'
import { StudentPortal } from './components/StudentPortal'
import { TeacherPortal } from './components/TeacherPortal'
import { ParentPortal } from './components/ParentPortal'
import { NazimPortal } from './components/NazimPortal'
import { ManagementPortal } from './components/ManagementPortal'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const { user, isLoading } = useAuth()

  console.log('App render - user:', user, 'isLoading:', isLoading);
  console.log('User role:', user?.role);
  console.log('User exists:', !!user);

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

  // Render appropriate portal based on user role
  const renderPortal = () => {
    if (!user) return null;

    switch (user.role) {
      case 'student':
        return <StudentPortal />;
      case 'teacher':
        return <TeacherPortal />;
      case 'parent':
        return <ParentPortal />;
      case 'nazim':
        return <NazimPortal />;
      case 'management':
      case 'admin':
      case 'mudir':
      case 'raises_jamia':
      case 'shaikul_hadees':
      case 'senior_mentor':
        return <ManagementPortal />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <ThemeProvider>
      {renderPortal()}
    </ThemeProvider>
  )
}

export default App
