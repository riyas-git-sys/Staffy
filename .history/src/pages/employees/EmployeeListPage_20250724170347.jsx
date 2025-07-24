import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../../components/ui/Loader';
import { getEmployees, deleteEmployee } from '../../services/employeeService';
import EmployeeCard from '../../components/employees/EmployeeCard';
import { FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
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
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 12;

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
    try {
      await deleteEmployee(employeeToDelete.id);
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      setShowDeleteModal(false);
      // Reset to first page if the current page might be empty after deletion
      if (filteredEmployees.length % employeesPerPage === 1) {
        setCurrentPage(Math.max(1, currentPage - 1));
      }
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
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

  // Get current employees for pagination
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when search changes
            }}
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
          onFilterChange={handleFilterChange} 
          currentFilters={filters}
        />
      )}

      {filteredEmployees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {employees.length === 0 ? 'No employees in database' : 'No employees match your filters'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentEmployees.map(employee => (
              <EmployeeCard 
                key={employee.id} 
                employee={employee}
                onDelete={() => handleDeleteClick(employee)}
              />
            ))}
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-10 h-10 rounded-md ${
                      currentPage === number 
                        ? 'bg-blue-500 text-white' 
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}
          
          <div className="text-center text-sm text-gray-500 mt-4">
            Showing {indexOfFirstEmployee + 1}-{Math.min(indexOfLastEmployee, filteredEmployees.length)} of {filteredEmployees.length} employees
          </div>
        </>
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