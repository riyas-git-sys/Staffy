// src/components/employees/EmployeeCard.jsx
export default function EmployeeCard({ employee, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <img 
            src={employee.profileImage || '/default-avatar.png'} 
            alt={`${employee.firstName}'s profile`}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold">{employee.firstName} {employee.lastName}</h3>
            <p className="text-sm text-gray-600">{employee.position}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {employee.department}
          </span>
          <button 
            onClick={() => onDelete(employee.id)} 
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}