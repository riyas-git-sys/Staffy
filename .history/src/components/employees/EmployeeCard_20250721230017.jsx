import { Link, useNavigate } from 'react-router-dom';

export default function EmployeeCard({ employee, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/employees/${employee.id}`);
  };

  const handleActionClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking actions
  };

  return (
    <div 
      className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow hover:[scale:1.01] duration-500 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between space-x-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {employee.profileImage ? (
            <img 
              src={employee.profileImage} 
              alt={`${employee.firstName} ${employee.lastName}`}
              className="h-20 w-20 rounded-full object-cover border"
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
      <div className="flex items-center justify-between mt-4">
        {/* Status */}
        <div className="flex items-center space-x-2">
          <p className={`px-2 py-1 rounded-full text-xs font-medium ${
            employee.status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : employee.status === 'On Leave' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
          }`}>
            {employee.status}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 mt-4" onClick={handleActionClick}>
          <Link
            to={`/employees/edit/${employee.id}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-150"
          >
            Edit
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="px-4 py-2 bg-white border border-red-500 text-red-600 hover:bg-red-50 text-sm font-medium rounded-md shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}