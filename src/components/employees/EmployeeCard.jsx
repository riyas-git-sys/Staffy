import { Link, useNavigate } from 'react-router-dom';
import { 
  IoPersonCircle, 
  IoMail, 
  IoBusiness, 
  IoCheckmarkCircle, 
  IoTimeOutline, 
  IoCloseCircle,
  IoCreateOutline,
  IoTrashOutline,
  IoSparkles
} from 'react-icons/io5';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';

export default function EmployeeCard({ employee, onDelete }) {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleCardClick = () => {
    navigate(`/employees/${employee.id}`);
  };

  const handleActionClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking actions
  };

  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden"
     onClick={handleCardClick}>
  
  {/* Animated background gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/30 group-hover:via-purple-50/20 group-hover:to-pink-50/30 transition-all duration-500 rounded-2xl"></div>
  
  {/* Decorative corner elements */}
  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
    <IoSparkles size={16} className="text-purple-400 animate-pulse" />
  </div>
  
  <div className="relative z-10">
    <div className="flex items-center justify-between space-x-4">
      {/* Enhanced Profile Image */}
      <div className="flex-shrink-0 relative">
        {employee.profileImage ? (
          <div className="relative">
            <img
              src={employee.profileImage}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
            />
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-md animate-pulse flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border-4 border-white">
            <IoPersonCircle size={40} className="text-gray-400 group-hover:text-gray-500 transition-colors duration-300" />
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white shadow-md animate-pulse flex items-center justify-center">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Employee Info */}
      <div className="flex-1 space-y-2">
        <h3 className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300 flex items-center">
          {employee.firstName} {employee.lastName}
          <div className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          </div>
        </h3>
        
        <div className="space-y-1">
          <p className="text-gray-700 font-medium flex items-center group-hover:text-gray-800 transition-colors duration-300">
            <IoBusiness size={14} className="mr-2 text-purple-500 group-hover:animate-pulse" />
            {employee.role}
          </p>
          <p className="text-gray-600 text-sm flex items-center group-hover:text-gray-700 transition-colors duration-300">
            <IoBusiness size={12} className="mr-2 text-indigo-400" />
            {employee.department}
          </p>
          <p className="text-gray-500 text-sm flex items-center group-hover:text-blue-600 transition-colors duration-300">
            <IoMail size={12} className="mr-2 text-blue-400 group-hover:animate-bounce" />
            {employee.email}
          </p>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between mt-6">
      {/* Enhanced Status */}
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-bold shadow-md transition-all duration-300 group-hover:scale-105 ${
          employee.status === 'Active'
            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 group-hover:from-green-200 group-hover:to-green-300'
            : employee.status === 'On Leave'
              ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 group-hover:from-yellow-200 group-hover:to-yellow-300'
              : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 group-hover:from-red-200 group-hover:to-red-300'
        }`}>
          {employee.status === 'Active' && (
            <IoCheckmarkCircle size={14} className="animate-pulse" />
          )}
          {employee.status === 'On Leave' && (
            <IoTimeOutline size={14} className="animate-pulse" />
          )}
          {employee.status !== 'Active' && employee.status !== 'On Leave' && (
            <IoCloseCircle size={14} className="animate-pulse" />
          )}
          {employee.status}
        </div>
      </div>

      {/*name of creator*/}
      {employee.createdBy && (
        <div className="text-xs text-gray-500 mt-2 flex items-center">
          <span>Added by: {employee.createdBy.name}</span>
        </div>
      )}

      {/* Enhanced Actions */}
      {(user?.uid === employee.createdBy?.uid || user?.token?.isAdmin) && (
        <div className="flex justify-end space-x-3 mt-4" onClick={handleActionClick}>
          <Link
            to={`/employees/edit/${employee.id}`}
            className="group/edit flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="p-1 bg-white/20 rounded-lg group-hover/edit:bg-white/30 transition-all duration-300 group-hover/edit:rotate-12">
              <IoCreateOutline size={14} />
            </div>
            <span>Edit</span>
          </Link>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="group/delete flex items-center space-x-2 px-4 py-2 bg-white border-2 border-red-400 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:border-red-500 text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-offset-2"
          >
            <div className="p-1 bg-red-50 rounded-lg group-hover/delete:bg-red-100 transition-all duration-300 group-hover/delete:rotate-12">
              <IoTrashOutline size={14} className="group-hover/delete:animate-pulse" />
            </div>
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  </div>

  {/* Animated border on hover */}
  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 p-0.5">
      <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-2xl"></div>
    </div>
  </div>

  <style jsx>{`
    .border-3 {
      border-width: 3px;
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    .animate-shimmer {
      animation: shimmer 2s infinite;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
      background-size: 200% 100%;
    }
  `}</style>
</div>
  );
}