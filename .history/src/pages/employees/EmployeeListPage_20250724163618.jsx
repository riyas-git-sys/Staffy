// src/pages/employees/EmployeeListPage.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../../components/ui/Loader';
import { getEmployees, deleteEmployee } from '../../services/employeeService';
import EmployeeCard from '../../components/employees/EmployeeCard';
import { 
  FiFilter, 
  FiSearch, 
  FiPlus, 
  FiUsers, 
  FiAlertTriangle,
  FiX,
  FiTrash2,
  FiEye,
  FiFilterX
} from 'react-icons/fi';
import EmployeeFilters from './EmployeeFilters';

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    status: ''
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

  // Extract unique departments and roles for filter dropdowns
  const departments = [...new Set(employees.map(emp => emp?.department))].filter(Boolean);
  const roles = [...new Set(employees.map(emp => emp?.role))].filter(Boolean);

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteEmployee(employeeToDelete.id);
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      department: '',
      role: '',
      status: ''
    });
    setSearchTerm('');
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
    
    return nameMatch && departmentMatch && roleMatch && statusMatch;
  });

  // Check if any filters are active
  const hasActiveFilters = searchTerm || filters.department || filters.role || filters.status;
  const filterCount = [searchTerm, filters.department, filters.role, filters.status].filter(Boolean).length;

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <Loader />
        <p className="mt-4 text-gray-600 animate-pulse">Loading employees...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500 rounded-lg shadow-lg">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
                <p className="text-gray-600 text-sm">
                  Manage your team of {employees.length} employee{employees.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <Link
              to="/employees/add"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Employee</span>
            </Link>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Clear search"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative inline-flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  showFilters 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Toggle filters"
              >
                <FiFilter className="w-5 h-5" />
                <span>Filters</span>
                {filterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {filterCount}
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all duration-200 transform hover:scale-105"
                  title="Clear all filters"
                >
                  <FiFilterX className="w-5 h-5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          {(searchTerm || hasActiveFilters) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Showing {filteredEmployees.length} of {employees.length} employees
                </span>
                {hasActiveFilters && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <FiEye className="w-4 h-4" />
                    <span>Filters active</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="animate-slideDown">
            <EmployeeFilters 
              onFilterChange={handleFilterChange} 
              currentFilters={filters}
            />
          </div>
        )}

        {/* Employee Grid */}
        <div className="animate-fadeIn">
          {filteredEmployees.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {employees.length === 0 ? 'No Employees Yet' : 'No Matching Employees'}
              </h3>
              <p className="text-gray-600 mb-6">
                {employees.length === 0 
                  ? 'Get started by adding your first employee to the system.' 
                  : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                }
              </p>
              {employees.length === 0 ? (
                <Link
                  to="/employees/add"
                  className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Add First Employee</span>
                </Link>
              ) : (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  <FiFilterX className="w-5 h-5" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEmployees.map((employee, index) => (
                <div 
                  key={employee.id} 
                  className="animate-slideUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <EmployeeCard 
                    employee={employee}
                    onDelete={() => handleDeleteClick(employee)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <FiAlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-gray-900">
                  {employeeToDelete?.firstName} {employeeToDelete?.lastName}
                </span>
                ? All associated data will be permanently removed from the system.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <FiTrash2 className="w-4 h-4" />
                    <span>Delete Employee</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out both;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}