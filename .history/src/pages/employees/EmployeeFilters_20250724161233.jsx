// src/pages/employees/EmployeeFilters.jsx
import { useState, useEffect } from 'react';

export default function EmployeeFilters({ 
  departments, 
  roles, 
  onFilterChange,
  currentFilters,
  salaryRange 
}) {
  const [filters, setFilters] = useState(currentFilters);
  const [localSalaryRange, setLocalSalaryRange] = useState({
    min: currentFilters.minSalary || salaryRange.min,
    max: currentFilters.maxSalary || salaryRange.max
  });

  useEffect(() => {
    setFilters(currentFilters);
    setLocalSalaryRange({
      min: currentFilters.minSalary || salaryRange.min,
      max: currentFilters.maxSalary || salaryRange.max
    });
  }, [currentFilters, salaryRange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    // Update local state immediately for responsive UI
    const newRange = { ...localSalaryRange, [name]: numValue };
    setLocalSalaryRange(newRange);
    
    // Prevent min from being higher than max and vice versa
    if (name === 'min' && numValue > localSalaryRange.max) {
      const correctedRange = { min: localSalaryRange.max, max: numValue };
      setLocalSalaryRange(correctedRange);
      onFilterChange({ ...filters, minSalary: correctedRange.min, maxSalary: correctedRange.max });
    } else if (name === 'max' && numValue < localSalaryRange.min) {
      const correctedRange = { min: numValue, max: localSalaryRange.min };
      setLocalSalaryRange(correctedRange);
      onFilterChange({ ...filters, minSalary: correctedRange.min, maxSalary: correctedRange.max });
    } else {
      // Update filters with debounce to avoid excessive re-renders
      setTimeout(() => {
        onFilterChange({ ...filters, [`${name}Salary`]: numValue });
      }, 300);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      department: '',
      role: '',
      status: '',
      minSalary: '',
      maxSalary: '',
      startDate: '',
      endDate: ''
    };
    setFilters(resetFilters);
    setLocalSalaryRange({
      min: salaryRange.min,
      max: salaryRange.max
    });
    onFilterChange(resetFilters);
  };

  // Format salary for display
  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 200000,
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Salary Range Filter */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Salary Range: {formatSalary(localSalaryRange.min)} - {formatSalary(localSalaryRange.max)}
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{formatSalary(salaryRange.min)}</span>
            <div className="flex-1 space-y-4">
              <input
                type="range"
                min={salaryRange.min}
                max={salaryRange.max}
                value={localSalaryRange.min}
                onChange={(e) => handleSalaryChange({ target: { name: 'min', value: e.target.value }})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min={salaryRange.min}
                max={salaryRange.max}
                value={localSalaryRange.max}
                onChange={(e) => handleSalaryChange({ target: { name: 'max', value: e.target.value }})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <span className="text-sm text-gray-500">{formatSalary(salaryRange.max)}</span>
          </div>
        </div>

        {/* Hire Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hired After</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleDateChange}
            max={filters.endDate || ''}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hired Before</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleDateChange}
            min={filters.startDate || ''}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
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