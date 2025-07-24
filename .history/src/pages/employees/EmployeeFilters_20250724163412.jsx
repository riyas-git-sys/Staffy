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

  // Check if any filters are active
  const hasActiveFilters = filters.department || filters.role || filters.status;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6 animate-slideDown">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Department Filter */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FiBuilding className="w-4 h-4 mr-2 text-blue-500" />
            Department
          </label>
          <div className="relative group">
            <select
              name="department"
              value={filters.department}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white hover:border-gray-400 cursor-pointer"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
            {filters.department && (
              <button
                onClick={() => handleChange({ target: { name: 'department', value: '' } })}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Role Filter */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FiUser className="w-4 h-4 mr-2 text-green-500" />
            Role
          </label>
          <div className="relative group">
            <select
              name="role"
              value={filters.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none bg-white hover:border-gray-400 cursor-pointer"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
            {filters.role && (
              <button
                onClick={() => handleChange({ target: { name: 'role', value: '' } })}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FiCheckCircle className="w-4 h-4 mr-2 text-purple-500" />
            Status
          </label>
          <div className="relative group">
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none bg-white hover:border-gray-400 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Terminated">Terminated</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
            {filters.status && (
              <button
                onClick={() => handleChange({ target: { name: 'status', value: '' } })}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Reset Button */}
        <div className="space-y-2">
          <div className="h-6"></div> {/* Spacer to align with other inputs */}
          <button
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className={`w-full p-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
              hasActiveFilters
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 transform hover:scale-105 active:scale-95'
                : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <FiRotateCcw className={`w-4 h-4 transition-transform duration-300 ${hasActiveFilters ? 'hover:rotate-180' : ''}`} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Active filters:</span>
            {filters.department && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-slideIn">
                <FiBuilding className="w-3 h-3 mr-1" />
                {filters.department}
                <button
                  onClick={() => handleChange({ target: { name: 'department', value: '' } })}
                  className="ml-1 hover:text-blue-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.role && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-slideIn">
                <FiUser className="w-3 h-3 mr-1" />
                {filters.role}
                <button
                  onClick={() => handleChange({ target: { name: 'role', value: '' } })}
                  className="ml-1 hover:text-green-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 animate-slideIn">
                <FiCheckCircle className="w-3 h-3 mr-1" />
                {filters.status}
                <button
                  onClick={() => handleChange({ target: { name: 'status', value: '' } })}
                  className="ml-1 hover:text-purple-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}