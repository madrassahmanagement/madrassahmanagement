import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { LoginPage } from './pages/LoginPage'
import { TeacherPortal } from './components/TeacherPortal'
import { ParentPortal } from './components/ParentPortal'
import { NazimPortal } from './components/NazimPortal'
import { RaisJamiaPortal } from './components/RaisJamiaPortal'
import { ManagementPortal } from './components/ManagementPortal'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const { user, isLoading } = useAuth()
  const [forceRender, setForceRender] = useState(0)

  console.log('App render - user:', user, 'isLoading:', isLoading);
  console.log('User role:', user?.role);
  console.log('User exists:', !!user);

  // Force re-render when user state changes
  useEffect(() => {
    console.log('App useEffect - user changed:', user);
    setForceRender(prev => prev + 1);
  }, [user]);

  // Debug: Log when App component re-renders
  console.log('App component re-render, forceRender:', forceRender);

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
      case 'teacher':
        return <TeacherPortal />;
      case 'parent':
        return <ParentPortal />;
      case 'nazim':
        return <NazimPortal />;
      case 'raises_jamia':
        return <RaisJamiaPortal />;
      case 'management':
      case 'admin':
      case 'mudir':
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
