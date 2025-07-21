import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Loader from '../../components/ui/Loader';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const docRef = doc(db, 'employees', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setEmployee({
            id: docSnap.id,
            ...docSnap.data()
          });
        } else {
          navigate('/employees');
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  if (loading) return <Loader />;
  if (!employee) return <div className="p-4">Employee not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Company Header Card */}
      <div className="w-xl max-w-xl flex flex-col items-center justify-between mx-auto mb-6 p-6 rounded-xl shadow-md bg-gradient-to-r from-red-500 to-purple-500 transform transition-transform duration-300 hover:scale-[1.03]">
        {/* Top Section */}
        <div className="w-full mb-4">
          <h1 className="text-3xl font-bold text-white">STAFFY</h1>
        </div>
        
        {/* Middle Section */}
        <div className="w-full flex items-center mb-6 p-4 backdrop-blur-sm rounded-xl">
          {/* Employee Image */}
          <div className="w-40 h-40 border-4 border-white rounded-xl overflow-hidden mr-6">
            {employee.profileImage ? (
              <img 
                src={employee.profileImage} 
                alt={`${employee.firstName} ${employee.lastName}`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                Upload Your Photo
              </div>
            )}
          </div>
          
          {/* Employee Details */}
          <div className="text-white">
            <h2 className="text-2xl font-bold">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-sm opacity-90">Employee ID: {employee.id}</p>
            <p className="text-lg font-semibold">{employee.role}</p>
            <p className="text-sm opacity-90">{employee.department}</p>
          </div>
        </div>
        
        {/* Bottom Section - Social Links */}
        <div className="w-full flex justify-end space-x-8 pt-4">
          {employee.linkedIn && (
            <a 
              href={employee.linkedIn} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          )}
          {employee.github && (
            <a 
              href={employee.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Employee Detail Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Employee Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex flex-row justify-between items-center space-x-4">
            <div>
              <h2 className="text-xl font-bold">
                {employee.firstName} {employee.lastName}
              </h2>
              <p className="text-blue-100">{employee.role}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button 
                onClick={() => navigate(`/employees/edit/${employee.id}`)}
                className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Employee Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Column */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center">
              {employee.profileImage ? (
                <img
                  src={employee.profileImage}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Photo
                </div>
              )}
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold">
                  {employee.firstName} {employee.lastName}
                </h3>
                <p className="text-gray-600">{employee.department}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  employee.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : employee.status === 'On Leave' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-medium">{employee.id}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="font-medium">
                  {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-medium">{employee.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-medium">{employee.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{employee.phone || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 border-b pb-2">Employment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{employee.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium">
                    {employee.salary ? `$${employee.salary}` : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex ">
              <button onClick={() => navigate('/employees')} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                Delete
              </button>
              <button 
                onClick={() => navigate('/employees')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 px-6 py-3 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            STAFFY
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {employee.updatedAt ? new Date(employee.updatedAt.toDate()).toLocaleString() : 'Unknown'}
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={() => navigate('/employees')} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
          Delete
        </button>
      </div>
    </div>
  );
}