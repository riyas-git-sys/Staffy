import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout'; // Add this import
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import EmployeeForm from './components/employees/EmployeeForm';
import ErrorPage from './pages/ErrorPage';

export default function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid place-items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading Application</h1>
          <p>Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    // src/App.jsx
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!currentUser ? <SignupPage /> : <Navigate to="/" />} />
        
        {/* Protected routes */}
        <Route element={<DashboardLayout />}> {/* Layout wrapper */}
          <Route 
            path="/" 
            element={currentUser ? <DashboardPage /> : <Navigate to="/login" />}
          >
            <Route index element={<DashboardPage />} />
            <Route path="employees" element={<EmployeeListPage />} />
            <Route path="employees/:id" element={<EmployeeDetailPage />} />
            <Route path="employees/add" element={<EmployeeForm />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}