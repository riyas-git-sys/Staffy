// src/components/employees/EmployeeCard.jsx
import { Link } from 'react-router-dom';

export default function EmployeeCard({ employee, onDelete }) {
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
      <div className="flex justify-end space-x-2 mt-4">
        <button
          to={`/employees/edit/${employee.id}`}
          className="text-white bg-blue-500 hover:text-white hover:bg-blue-700 text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(employee.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}