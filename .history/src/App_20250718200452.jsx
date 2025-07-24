import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeDetailPage from './pages/employees/EmployeeDetailPage';
import AddEmployeePage from './pages/employees/AddEmployeePage';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <h1>Employee Dashboard</h1>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={currentUser ? <DashboardLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<DashboardPage />} />
          <Route path="employees" element={<EmployeeListPage />} />
          <Route path="employees/add" element={<AddEmployeePage />} />
          <Route path="employees/:id" element={<EmployeeDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;