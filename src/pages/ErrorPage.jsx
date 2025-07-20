import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ErrorPage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found</p>
        <Link
          to={currentUser ? "/" : "/login"}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          {currentUser ? "Go to Dashboard" : "Go to Login"}
        </Link>
      </div>
    </div>
  );
}