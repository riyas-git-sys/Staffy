import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees } from '../../services/employeeService';

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      setEmployees(data);
      setLoading(false);
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  if (loading) return <div className="p-4">Loading employees...</div>;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          className="border p-2 rounded flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="all">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="HR">Human Resources</option>
          <option value="Marketing">Marketing</option>
        </select>
        <Link
          to="/employees/add"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Employee
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{employee.name}</h3>
              <p className="text-gray-600">{employee.position}</p>
              <p className="text-sm text-gray-500 mt-1">{employee.department}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {employee.status || 'Active'}
                </span>
                <Link
                  to={`/employees/${employee.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}