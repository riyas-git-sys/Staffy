import LoginForm from '../../components/auth/LoginForm';
import { Link } from 'react-router-dom'; // Update from <a> to <Link>

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Employee Login</h1>
        <image src="https://cdn.dribbble.com/users/238327/screenshots/2380321/confused_director.gif" />
        <LoginForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}