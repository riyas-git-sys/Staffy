import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import EmployeeListPage from './pages/employees/EmployeeListPage'
import ErrorPage from './pages/ErrorPage'

export default function App() {
  const { currentUser } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={currentUser ? <DashboardPage /> : <Navigate to="/login" replace />}
        >
          <Route index element={<EmployeeListPage />} />
          <Route path="employees" element={<EmployeeListPage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}