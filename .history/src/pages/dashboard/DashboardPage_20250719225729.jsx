import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import { getEmployees } from '../../services/employeeService';
import { Link } from 'react-router-dom';
import Loader from '../../components/ui/Loader';

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Starting employee fetch...");
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        console.log("Employee data received:", data);
        setEmployees(data || []); // Ensure we always have an array
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load employee data");
      } finally {
        console.log("Fetch completed");
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  // Get employees for display
  const displayedEmployees = showAll ? employees : employees.slice(0, 4);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            {/* Dashboard Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome to your employee management system!</p>
            </div>

            {/* Quick Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500 text-sm font-medium">Total Employees</h3>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500 text-sm font-medium">Active</h3>
                <p className="text-2xl font-bold">
                  {employees.filter(e => e.status === 'Active').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-gray-500 text-sm font-medium">Departments</h3>
                <p className="text-2xl font-bold">
                  {[...new Set(employees.map(e => e.department))].length}
                </p>
              </div>
            </div>

            {/* Employee Cards Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recent Employees</h2>
                {employees.length > 4 && (
                  <button 
                    onClick={() => setShowAll(!showAll)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showAll ? 'Show Less' : 'View All'}
                  </button>
                )}
              </div>

              {employees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No employees found
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {displayedEmployees.map(employee => (
                    <div key={employee.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center">
                          {employee.firstName?.charAt(0) || employee.lastName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{employee.department}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          employee.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {employee.status || 'Active'}
                        </span>
                        <Link
                          to={`/employees/${employee.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <div className="flex justify-end">
          <Link 
            to="/employees/add" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Add New Employee
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}