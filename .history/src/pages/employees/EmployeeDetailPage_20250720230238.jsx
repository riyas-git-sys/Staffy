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
      <div className="max-w-4xl mx-auto mb-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-2xl font-bold">Staffy</h1>
          <p className="text-blue-100">Employee Management System</p>
        </div>
      </div>

      {/* Employee Detail Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Employee Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
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
              <button 
                onClick={() => navigate('/employees')}
                className="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800 transition"
              >
                Back to List
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
    </div>
  );
}