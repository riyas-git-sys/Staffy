import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          navigate('/employees', { state: { error: 'Employee not found' } });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  if (loading) return <Loader />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!employee) return <div className="p-4">Employee not found</div>;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-blue-100">{employee.role}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => navigate(`/employees/edit/${employee.id}`)}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Edit
              </Button>
              <Button
                onClick={() => navigate('/employees')}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Back to List
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center">
              {employee.profileImage ? (
                <img
                  src={employee.profileImage}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                  No Photo
                </div>
              )}
              <div className="mt-4 text-center">
                <h2 className="text-xl font-semibold">
                  {employee.firstName} {employee.lastName}
                </h2>
                <p className="text-gray-600">{employee.role}</p>
                <p className="text-gray-500">{employee.department}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Employee ID</p>
                <p className="font-medium">{employee.id}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
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

            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
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
                  <p className="text-sm text-gray-500">Hire Date</p>
                  <p className="font-medium">{formatDate(employee.hireDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium">
                    {employee.salary ? `$${employee.salary}` : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">
                  {employee.updatedAt ? formatDate(employee.updatedAt.toDate()) : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-100 px-6 py-4 flex justify-end space-x-3">
          <Button
            onClick={() => navigate(`/employees/edit/${employee.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Edit Profile
          </Button>
          <Button
            onClick={() => navigate('/employees')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Back to List
          </Button>
        </div>
      </div>
    </div>
  );
}