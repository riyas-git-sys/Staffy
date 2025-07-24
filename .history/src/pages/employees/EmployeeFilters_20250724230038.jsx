// src/pages/employees/EmployeeFilters.jsx
import { useState, useEffect } from 'react';
import { 
  IoBusiness, 
  IoPersonOutline, 
  IoCheckmarkCircle, 
  IoRefreshOutline,
  IoChevronDown,
  IoOptionsOutline,
  IoTimeOutline,
  IoCloseCircle
} from 'react-icons/io5';

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
    <div className="bg-gradient-to-r from-white via-blue-50/30 to-white p-6 rounded-2xl shadow-xl mb-6 border-2 border-blue-100/50 backdrop-blur-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
  
  {/* Animated background pattern */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-pulse"></div>
    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
  </div>

  {/* Header with icon */}
  <div className="flex items-center space-x-3 mb-6 relative z-10">
    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
      <IoOptionsOutline size={20} color="white" className="animate-pulse" />
    </div>
    <h3 className="text-lg font-bold text-gray-800">Filter Options</h3>
    <div className="flex space-x-1 ml-auto">
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-300"></div>
      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-600"></div>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
    {/* Enhanced Department Filter */}
    <div className="group/field">
      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
        <div className="p-1 bg-blue-100 rounded-lg group-hover/field:bg-blue-200 transition-colors duration-300">
          <IoBusiness size={14} className="text-blue-600" />
        </div>
        <span className="group-hover/field:text-blue-600 transition-colors duration-300">Department</span>
      </label>
      <div className="relative">
        <select
          name="department"
          value={filters.department}
          onChange={handleChange}
          className="w-full p-3 pr-10 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-blue-300 focus:border-blue-500 hover:border-blue-300 transition-all duration-300 appearance-none cursor-pointer shadow-sm hover:shadow-md font-medium"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <IoChevronDown size={16} className="text-gray-400 group-hover/field:text-blue-500 transition-colors duration-300" />
        </div>
        {/* Animated underline */}
        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover/field:w-full transition-all duration-500"></div>
      </div>
    </div>

    {/* Enhanced Role Filter */}
    <div className="group/field">
      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
        <div className="p-1 bg-green-100 rounded-lg group-hover/field:bg-green-200 transition-colors duration-300">
          <IoPersonOutline size={14} className="text-green-600" />
        </div>
        <span className="group-hover/field:text-green-600 transition-colors duration-300">Role</span>
      </label>
      <div className="relative">
        <select
          name="role"
          value={filters.role}
          onChange={handleChange}
          className="w-full p-3 pr-10 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-green-300 focus:border-green-500 hover:border-green-300 transition-all duration-300 appearance-none cursor-pointer shadow-sm hover:shadow-md font-medium"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <IoChevronDown size={16} className="text-gray-400 group-hover/field:text-green-500 transition-colors duration-300" />
        </div>
        {/* Animated underline */}
        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover/field:w-full transition-all duration-500"></div>
      </div>
    </div>

    {/* Enhanced Status Filter */}
    <div className="group/field">
      <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
        <div className="p-1 bg-purple-100 rounded-lg group-hover/field:bg-purple-200 transition-colors duration-300">
          <IoCheckmarkCircle size={14} className="text-purple-600" />
        </div>
        <span className="group-hover/field:text-purple-600 transition-colors duration-300">Status</span>
      </label>
      <div className="relative">
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full p-3 pr-10 border-2 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-purple-300 focus:border-purple-500 hover:border-purple-300 transition-all duration-300 appearance-none cursor-pointer shadow-sm hover:shadow-md font-medium"
        >
          <option value="">All Statuses</option>
          <option value="Active">✅ Active</option>
          <option value="On Leave">⏰ On Leave</option>
          <option value="Terminated">❌ Terminated</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <IoChevronDown size={16} className="text-gray-400 group-hover/field:text-purple-500 transition-colors duration-300" />
        </div>
        {/* Animated underline */}
        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover/field:w-full transition-all duration-500"></div>
      </div>
    </div>

    {/* Enhanced Reset Button */}
    <div className="md:col-span-3 flex justify-end mt-4">
      <button
        type="button"
        onClick={handleReset}
        className="group/reset flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:text-gray-800 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-gray-200 hover:border-gray-300"
      >
        <div className="p-1 bg-white/60 rounded-lg group-hover/reset:bg-white/80 group-hover/reset:rotate-180 transition-all duration-500">
          <IoRefreshOutline size={16} />
        </div>
        <span>Reset Filters</span>
        
        {/* Loading dots animation on hover */}
        <div className="flex space-x-1 opacity-0 group-hover/reset:opacity-100 transition-opacity duration-300">
          <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </button>
    </div>
  </div>

  {/* Floating filter count indicator */}
  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-pulse">
      3 Filters
    </div>
  </div>

  <style jsx>{`
    .animation-delay-200 {
      animation-delay: 200ms;
    }
    
    .animation-delay-300 {
      animation-delay: 300ms;
    }
    
    .animation-delay-400 {
      animation-delay: 400ms;
    }
    
    .animation-delay-600 {
      animation-delay: 600ms;
    }
    
    .animation-delay-1000 {
      animation-delay: 1000ms;
    }
    
    /* Custom scrollbar for select options */
    select option {
      padding: 8px 12px;
      background: white;
      color: #374151;
    }
    
    select option:hover {
      background: #f3f4f6;
    }
    
    /* Enhanced focus styles */
    select:focus {
      transform: translateY(-1px);
    }
  `}</style>
</div>
  );
}