import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage'; // Add this import
import EmployeeForm from './components/employees/EmployeeForm'; // Add this import
import ErrorPage from './pages/ErrorPage';

export default function App() {
  const { currentUser, loading } = useAuth(); // Ensure your AuthContext provides loading state

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

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
          <Route index element={<DashboardPage />} /> {/* Add this line */}
          <Route path="employees" element={<EmployeeListPage />} />
          <Route path="employees/:id" element={<EmployeeDetailPage />} />
          <Route path="employees/add" element={<EmployeeForm />} />
          <Route path="employees/edit/:id" element={<EmployeeForm />} />
        </Route>
        
        {/* Error handling */}
        <Route path="/404" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}