import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Announcements from './pages/announcements/Announcements';
import Projects from './pages/projects/Projects';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
    children: [
      {
        path: 'employees',
        element: <EmployeeListPage />,
      },
      {
        path: 'announcements',
        element: <Announcements />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
    ],
  },
]);