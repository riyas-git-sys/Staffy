// src/pages/employees/EmployeeFilters.jsx
import { useState, useEffect } from 'react';
import { 
  FiBuilding, 
  FiUser, 
  FiCheckCircle, 
  FiRotateCcw,
  FiChevronDown,
  FiX
} from 'react-icons/fi';

export default function EmployeeFilters({ 
  onFilterChange,
  currentFilters
}) {
  const [filters, setFilters] = useState(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      department: '',
      role: '',
      status: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Predefined roles and departments
  const roles = [
    'Software Engineer',
    'UI/UX Designer',
    'Data Scientist/Analyst',
    'Sales Executive',
    'Devops Engineering',
    'Product Manager',
    'Digital Marketing Specialist',
    'Customer Service Manager',
    'Financial Analyst',
    'HR Business Partner',
    'Operations Manager',
    'Project Manager'
  ];

  const departments = [
    'Information Technology(IT)',
    'Information Technology(IT) / R&D',
    'Sales & Business Development',
    'Engineering / R&D',
    'Marketing',
    'Customer Service/Support',
    'Finance & Accounting',
    'Human Resources (HR)',
    'Operations'
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            name="department"
            value={filters.department}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={filters.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="md:col-span-3 flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}