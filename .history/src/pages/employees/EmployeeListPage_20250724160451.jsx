// src/pages/employees/EmployeeListPage.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../../components/ui/Loader';
import { getEmployees, deleteEmployee } from '../../services/employeeService';
import EmployeeCard from '../../components/employees/EmployeeCard';
import { FiFilter } from 'react-icons/fi';
import EmployeeFilters from './EmployeeFilters';

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    status: '',
    minSalary: '',
    maxSalary: '',
    startDate: '',
    endDate: ''
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate min/max salary for range slider
  const salaryRange = employees.reduce((acc, emp) => {
    const salary = parseFloat(emp.salary) || 0;
    return {
      min: Math.min(acc.min, salary),
      max: Math.max(acc.max, salary)
    };
  }, { min: Infinity, max: -Infinity });

  // Extract unique departments and roles for filter dropdowns
  const departments = [...new Set(employees.map(emp => emp?.department))].filter(Boolean);
  const roles = [...new Set(employees.map(emp => emp?.role))].filter(Boolean);

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteEmployee(employeeToDelete.id);
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredEmployees = employees.filter(emp => {
    if (!emp) return false;
    
    // Search term filter
    const fullName = `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase();
    const nameMatch = fullName.includes(searchTerm.toLowerCase());
    
    // Apply other filters
    const departmentMatch = !filters.department || emp.department === filters.department;
    const roleMatch = !filters.role || emp.role === filters.role;
    const statusMatch = !filters.status || emp.status === filters.status;
    
    // Salary filter
    const empSalary = parseFloat(emp.salary) || 0;
    const minSalary = filters.minSalary ? parseFloat(filters.minSalary) : salaryRange.min;
    const maxSalary = filters.maxSalary ? parseFloat(filters.maxSalary) : salaryRange.max;
    const salaryMatch = empSalary >= minSalary && empSalary <= maxSalary;
    
    // Date filter
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;
    const hireDate = emp.hireDate ? new Date(emp.hireDate) : null;
    
    let dateMatch = true;
    if (startDate && hireDate) dateMatch = hireDate >= startDate;
    if (endDate && hireDate) dateMatch = dateMatch && hireDate <= endDate;
    
    return nameMatch && departmentMatch && roleMatch && statusMatch && salaryMatch && dateMatch;
  });

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Loader />
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search employees..."
            className="border p-2 rounded-l flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border-t border-b border-r rounded-r ${
              showFilters 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-gray-200 hover:bg-gray-300 border-gray-300'
            }`}
            title="Filter employees"
          >
            <FiFilter className="w-5 h-5" />
          </button>
        </div>
        <Link
          to="/employees/add"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-4"
        >
          Add Employee
        </Link>
      </div>

      {showFilters && (
        <EmployeeFilters 
          departments={departments} 
          roles={roles} 
          onFilterChange={handleFilterChange} 
          currentFilters={filters}
          salaryRange={salaryRange}
        />
      )}

      {filteredEmployees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {employees.length === 0 ? 'No employees in database' : 'No employees match your filters'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map(employee => (
            <EmployeeCard 
              key={employee.id} 
              employee={employee}
              onDelete={() => handleDeleteClick(employee)}
            />
          )}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete {employeeToDelete?.firstName} {employeeToDelete?.lastName}?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}