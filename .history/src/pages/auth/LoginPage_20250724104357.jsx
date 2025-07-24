import LoginForm from '../../components/auth/LoginForm';
import { Link } from 'react-router-dom'; // Update from <a> to <Link>

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Employee Login</h1>
        <img src="https://i.ibb.co/C3r84TzZ/emplogo.png" alt="Staffy-logo" className='h-25 w-40 mb-1 mx-auto rounded-xl' />
        <img src="https://cdn.dribbble.com/users/1319343/screenshots/14584578/media/a77349bede651cdf43d49ad531180689.gif" className='mx-auto rounded-xl' alt='Employee Login'/>
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