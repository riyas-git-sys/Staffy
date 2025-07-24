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
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200 animate-slideDown">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Department Filter */}
    <div className="space-y-2">
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        <div className="p-1.5 bg-blue-100 rounded-full mr-2 animate-pulse-slow">
          <FiBuilding className="w-4 h-4 text-blue-600" />
        </div>
        Department
      </label>
      <div className="relative group">
        <select
          name="department"
          value={filters.department}
          onChange={handleChange}
          className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none bg-white hover:border-blue-400 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FiChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-all duration-200 group-focus-within:rotate-180" />
        </div>
        {filters.department && (
          <button
            onClick={() => handleChange({ target: { name: 'department', value: '' } })}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-200 p-1 rounded-full hover:bg-red-50 animate-fadeIn"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-lg border-2 border-blue-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none animate-borderGlow"></div>
      </div>
    </div>

    {/* Role Filter */}
    <div className="space-y-2">
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        <div className="p-1.5 bg-green-100 rounded-full mr-2 animate-pulse-slow" style={{animationDelay: '0.2s'}}>
          <FiUser className="w-4 h-4 text-green-600" />
        </div>
        Role
      </label>
      <div className="relative group">
        <select
          name="role"
          value={filters.role}
          onChange={handleChange}
          className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 appearance-none bg-white hover:border-green-400 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FiChevronDown className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-all duration-200 group-focus-within:rotate-180" />
        </div>
        {filters.role && (
          <button
            onClick={() => handleChange({ target: { name: 'role', value: '' } })}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-200 p-1 rounded-full hover:bg-red-50 animate-fadeIn"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
        <div className="absolute inset-0 rounded-lg border-2 border-green-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none animate-borderGlow"></div>
      </div>
    </div>

    {/* Status Filter */}
    <div className="space-y-2">
      <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
        <div className="p-1.5 bg-purple-100 rounded-full mr-2 animate-pulse-slow" style={{animationDelay: '0.4s'}}>
          <FiCheckCircle className="w-4 h-4 text-purple-600" />
        </div>
        Status
      </label>
      <div className="relative group">
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 appearance-none bg-white hover:border-purple-400 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <option value="">All Statuses</option>
          <option value="Active">✅ Active</option>
          <option value="On Leave">🏖️ On Leave</option>
          <option value="Terminated">❌ Terminated</option>
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <FiChevronDown className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-all duration-200 group-focus-within:rotate-180" />
        </div>
        {filters.status && (
          <button
            onClick={() => handleChange({ target: { name: 'status', value: '' } })}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-all duration-200 p-1 rounded-full hover:bg-red-50 animate-fadeIn"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
        <div className="absolute inset-0 rounded-lg border-2 border-purple-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none animate-borderGlow"></div>
      </div>
    </div>
  </div>

  {/* Reset Button */}
  <div className="mt-6 flex justify-end">
    <button
      type="button"
      onClick={handleReset}
      className="group inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-red-50 hover:to-red-100 hover:text-red-600 font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
    >
      <FiRotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
      <span>Reset Filters</span>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    </button>
  </div>

  {/* Active Filters Summary */}
  {(filters.department || filters.role || filters.status) && (
    <div className="mt-4 pt-4 border-t border-gray-200 animate-slideUp">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-gray-600">Active filters:</span>
        {filters.department && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-bounceIn">
            <FiBuilding className="w-3 h-3 mr-1" />
            {filters.department}
            <button
              onClick={() => handleChange({ target: { name: 'department', value: '' } })}
              className="ml-2 hover:text-blue-600 transition-colors"
            >
              <FiX className="w-3 h-3" />
            </button>
          </span>
        )}
        {filters.role && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-bounceIn" style={{animationDelay: '0.1s'}}>
            <FiUser className="w-3 h-3 mr-1" />
            {filters.role}
            <button
              onClick={() => handleChange({ target: { name: 'role', value: '' } })}
              className="ml-2 hover:text-green-600 transition-colors"
            >
              <FiX className="w-3 h-3" />
            </button>
          </span>
        )}
        {filters.status && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 animate-bounceIn" style={{animationDelay: '0.2s'}}>
            <FiCheckCircle className="w-3 h-3 mr-1" />
            {filters.status}
            <button
              onClick={() => handleChange({ target: { name: 'status', value: '' } })}
              className="ml-2 hover:text-purple-600 transition-colors"
            >
              <FiX className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>
    </div>
    
  );
}