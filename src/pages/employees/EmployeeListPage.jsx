import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../../components/ui/Loader';
import { getEmployees, deleteEmployee } from '../../services/employeeService';
import EmployeeCard from '../../components/employees/EmployeeCard';
import { FiFilter, FiChevronLeft, FiChevronRight, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import EmployeeFilters from './EmployeeFilters';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';


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
  const [isVisible, setIsVisible] = useState(false);
  const [user] = useAuthState(auth);
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
    setIsVisible(true);
  }, []);

  // Extract unique departments and roles for filter dropdowns
  const departments = [...new Set(employees.map(emp => emp?.department))].filter(Boolean);
  const roles = [...new Set(employees.map(emp => emp?.role))].filter(Boolean);

  const handleDeleteClick = (employee) => {
    if (employee.createdBy?.uid !== user?.uid && !user?.token?.isAdmin) {
      alert('You can only delete employees you created');
      return;
    }
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
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <Loader />
        <p className="mt-4 text-gray-600 animate-pulse">Loading employees...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 transition-all duration-700">
      {/* Header */}
      <div className={`max-w-7xl mx-auto mb-8 transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Employee Directory
                </h1>
                <p className="text-gray-600 mt-1">Manage your team members</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className={`max-w-7xl mx-auto mb-6 transform transition-all duration-1000 delay-100 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Section */}
            <div className="flex items-center flex-1 max-w-md">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-300"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`group ml-3 p-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  showFilters 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Filter employees"
              >
                <FiFilter className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : 'group-hover:rotate-12'}`} />
              </button>
            </div>

            {/* Add Employee Button */}
            <Link
              to="/employees/add"
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
            >
              <FiPlus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              <span>Add Employee</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className={`max-w-7xl mx-auto mb-6 transform transition-all duration-500 ${
          showFilters ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}>
          <EmployeeFilters 
            onFilterChange={handleFilterChange} 
            currentFilters={filters}
          />
        </div>
      )}

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto transform transition-all duration-1000 delay-200 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        {filteredEmployees.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-12 border border-white/20">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {employees.length === 0 ? 'No employees in database' : 'No employees match your filters'}
              </h3>
              <p className="text-gray-500">
                {employees.length === 0 ? 'Start by adding your first employee' : 'Try adjusting your search or filter criteria'}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* Employee Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEmployees.map((employee, index) => (
                  <div 
                    key={employee.id}
                    className={`transform transition-all duration-500 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                    style={{ transitionDelay: `${300 + (index * 100)}ms` }}
                  >
                    <EmployeeCard 
                      employee={employee}
                      onDelete={() => handleDeleteClick(employee)}
                      currentUser={user} // Add this prop
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50/50 p-6 border-t border-white/20">
                <div className="flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="group p-3 rounded-2xl border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                    >
                      <FiChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-12 h-12 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                          currentPage === number 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                            : 'border-2 border-gray-200 hover:bg-white hover:border-blue-300 hover:shadow-lg'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="group p-3 rounded-2xl border-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                    >
                      <FiChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </nav>
                </div>
                
                <div className="text-center text-sm text-gray-500 mt-4">
                  Showing {indexOfFirstEmployee + 1}-{Math.min(indexOfLastEmployee, filteredEmployees.length)} of {filteredEmployees.length} employees
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 animate-scaleIn border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-8">
                Are you sure you want to delete <span className="font-semibold">{employeeToDelete?.firstName} {employeeToDelete?.lastName}</span>?
                <br />
                <span className="text-sm text-red-500">This action cannot be undone.</span>
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="group flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-2xl font-semibold hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
                >
                  <FiX className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={confirmDelete}
                  className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}