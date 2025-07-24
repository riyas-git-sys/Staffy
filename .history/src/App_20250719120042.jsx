import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import EmployeeListPage from './pages/employees/EmployeeListPage'
import ErrorPage from './pages/ErrorPage'

export default function App() {
  const { currentUser } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!currentUser ? <SignupPage /> : <Navigate to="/" replace />} />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={currentUser ? <DashboardPage /> : <Navigate to="/login" replace />}
        >
          <Route index element={<EmployeeListPage />} />
          <Route path="employees" element={<EmployeeListPage />} />
        </Route>
        
        {/* Error handling */}
        <Route path="/404" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  )
}