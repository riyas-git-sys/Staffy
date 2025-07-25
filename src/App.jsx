import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoadingSpinner from './components/ui/LoadingSpinner'; // Create this component

// Lazy-loaded components
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const EmployeeListPage = lazy(() => import('./pages/employees/EmployeeListPage'));
const EmployeeDetailPage = lazy(() => import('./pages/employees/EmployeeDetailPage'));
const EmployeeForm = lazy(() => import('./components/employees/EmployeeForm'));
const EditEmployeePage = lazy(() => import('./pages/employees/EditEmployeePage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const Announcements = lazy(() => import('./pages/announcements/Announcements'));
const Projects = lazy(() => import('./pages/projects/Projects'));

export default function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen message="Checking authentication status..." />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes basename="/">
          {/* Public routes */}
          <Route 
            path="/login" 
            element={!currentUser ? <LoginPage /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/signup" 
            element={!currentUser ? <SignupPage /> : <Navigate to="/" replace />} 
          />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={currentUser ? <DashboardLayout /> : <Navigate to="/login" replace />}
          >
            <Route index element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeeListPage />} />
            <Route path="employees/:id" element={<EmployeeDetailPage />} />
            <Route path="employees/add" element={<EmployeeForm />} />
            <Route path="employees/edit/:id" element={<EditEmployeePage />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="projects" element={<Projects />} />
          </Route>
          
          {/* Error handling */}
          <Route path="/404" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}