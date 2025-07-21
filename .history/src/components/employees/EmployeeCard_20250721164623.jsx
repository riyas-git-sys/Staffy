// src/components/employees/EmployeeCard.jsx
import {useState} from 'react';
import { Link } from 'react-router-dom';

export default function EmployeeCard({ employee, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Delete Employee Handler function
  const deleteEmployee = async () => {
    try {
      await deleteDoc(doc(db, 'employees', id));
      navigate('/employees');
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {employee.profileImage ? (
            <img 
              src={employee.profileImage} 
              alt={`${employee.firstName} ${employee.lastName}`}
              className="h-16 w-16 rounded-full object-cover border"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs">No image</span>
            </div>
          )}
        </div>

        {/* Employee Info */}
        <div className="flex-1">
          <h3 className="font-medium text-lg">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-gray-600">{employee.role}</p>
          <p className="text-gray-500 text-sm">{employee.department}</p>
          <p className="text-gray-500 text-sm">{employee.email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-4">
        <Link
          to={`/employees/edit/${employee.id}`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-150"
        >
          Edit
        </Link>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-white border border-red-500 text-red-600 hover:bg-red-50 text-sm font-medium rounded-md shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete
        </button>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete {employee.firstName} {employee.lastName}'s profile parmantly?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  deleteEmployee();
                }}
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