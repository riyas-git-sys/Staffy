import { useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import { getEmployees } from '../../services/employeeService';
import { Link } from 'react-router-dom';
import { 
  IoAlertCircle, 
  IoPeople, 
  IoCheckmarkCircle, 
  IoBusiness,
  IoEye,
  IoAdd,
  IoTrendingUp,
  IoTime,
  IoStatsChart
} from 'react-icons/io5';

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Starting employee fetch...");
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        console.log("Employee data received:", data);
        setEmployees(data || []); // Ensure we always have an array
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load employee data");
      } finally {
        console.log("Fetch completed");
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  // Get employees for display
  const displayedEmployees = showAll ? employees : employees.slice(0, 4);

  return (
    <div className="p-6 space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
      {error ? (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="p-1 bg-red-200 rounded-full">
                <IoAlertCircle className="h-5 w-5 text-red-600 animate-pulse" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animation-delay-150"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Staffy Logo */}
          <div className="flex flex-row justify-center items-center bg-gradient-to-r from-white via-blue-50 to-white rounded-2xl shadow-xl p-8 border border-blue-100/50 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            
            <div className="absolute top-4 right-4 flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-400"></div>
            </div>
            <div className="flex items-center space-x-4">
              <img
                src="https://i.ibb.co/4wYbwyXM/staffylogo.png"
                alt="Staffy-logo"
                className="h-45 w-auto"
              />
            </div>
          </div>

          {/* Enhanced Dashboard Welcome Section */}
          <div className="bg-gradient-to-r from-white via-blue-50 to-white rounded-2xl shadow-xl p-8 border border-blue-100/50 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <IoStatsChart size={32} color="white" className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Welcome to your Employee Dashboard!</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-400"></div>
            </div>
          </div>

          {/* Enhanced Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Employees Card */}
            <div className="group bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-6 border border-blue-100/50 transform hover:scale-105 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-2 flex items-center">
                    <IoPeople size={16} className="mr-2 text-blue-500" />
                    Total Employees
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {employees.length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <IoPeople size={24} color="white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <IoTrendingUp size={16} className="mr-1" />
                <span>All employees</span>
              </div>
            </div>

            {/* Active Employees Card */}
            <div className="group bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg p-6 border border-green-100/50 transform hover:scale-105 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-2 flex items-center">
                    <IoCheckmarkCircle size={16} className="mr-2 text-green-500" />
                    Active
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                    {employees.filter(e => e.status === 'Active').length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <IoCheckmarkCircle size={24} color="white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <IoTime size={16} className="mr-1" />
                <span>Currently active</span>
              </div>
            </div>

            {/* Departments Card */}
            <div className="group bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-6 border border-purple-100/50 transform hover:scale-105 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-2 flex items-center">
                    <IoBusiness size={16} className="mr-2 text-purple-500" />
                    Departments
                  </h3>
                  <p className="text-3xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                    {[...new Set(employees.map(e => e.department))].length}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <IoBusiness size={24} color="white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-purple-600">
                <IoStatsChart size={16} className="mr-1" />
                <span>Total departments</span>
              </div>
            </div>
          </div>

          {/* Enhanced Employee Cards Section */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100/50 transform hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <IoPeople size={24} color="white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Recent Employees
                </h2>
              </div>
              {employees.length > 4 && (
                <button 
                  onClick={() => setShowAll(!showAll)}
                  className="group flex items-center space-x-2 text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <IoEye size={16} className="group-hover:animate-pulse" />
                  <span>{showAll ? 'Show Less' : 'View All'}</span>
                </button>
              )}
            </div>

            {employees.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <IoPeople size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No employees found</p>
                <p className="text-gray-400 text-sm mt-2">Add your first employee to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedEmployees.map((employee, index) => (
                  <div 
                    key={employee.id} 
                    className="group bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="relative">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                          {employee.firstName?.charAt(0) || employee.lastName?.charAt(0) || '?'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 truncate">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <IoBusiness size={12} className="mr-1" />
                          {employee.department}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        employee.status === 'Active' 
                          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 group-hover:from-green-200 group-hover:to-green-300' 
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 group-hover:from-gray-200 group-hover:to-gray-300'
                      }`}>
                        {employee.status === 'Active' && <IoCheckmarkCircle size={12} className="inline mr-1" />}
                        {employee.status || 'Active'}
                      </span>
                      <Link
                        to={`/employees/${employee.id}`}
                        className="group/link flex items-center space-x-1 text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        <IoEye size={14} className="group-hover/link:animate-pulse" />
                        <span>View</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Enhanced Add New Employee Button */}
      <div className="flex justify-end">
        <Link 
          to="/employees/add" 
          className="group flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
        >
          <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-90">
            <IoAdd size={20} />
          </div>
          <span>Add New Employee</span>
        </Link>
      </div>

      <style jsx>{`
        @keyframes fade-in-50 {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-in-from-bottom-4 {
          from { transform: translateY(1rem); }
          to { transform: translateY(0); }
        }
        
        .animate-in {
          animation: fade-in-50 0.7s ease-out, slide-in-from-bottom-4 0.7s ease-out;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
}