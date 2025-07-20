import DashboardLayout from '../../components/layout/DashboardLayout'
import { useState, useEffect } from 'react';
import { getEmployees } from '../../services/employeeService';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      setEmployees(data);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  // Get only the first 4 employees for dashboard preview
  const previewEmployees = employees.slice(0, 4);
  const displayedEmployees = showAll ? employees : previewEmployees;


  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
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
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAll ? 'Show Less' : 'View All'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedEmployees.map(employee => (
              <div key={employee.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{employee.name}</h3>
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
        </div>
      </div>
    </DashboardLayout>
  );
}