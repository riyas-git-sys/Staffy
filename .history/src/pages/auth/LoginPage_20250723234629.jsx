import LoginForm from '../../components/auth/LoginForm';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <img 
            src="https://i.ibb.co/C3r84TzZ/emplogo.png" 
            alt="Staffy-logo" 
            className='h-24 w-32 mb-4 object-contain' 
          />
          <h1 className="text-3xl font-bold text-gray-800">Employee Login</h1>
          <p className="text-gray-500 mt-1">Because people matter</p>
        </div>

        <div className="mb-6">
          <img 
            src="https://cdn.dribbble.com/users/1319343/screenshots/14584578/media/a77349bede651cdf43d49ad531180689.gif" 
            className='w-full h-auto rounded-lg object-cover'
            alt='Employee Login'
          />
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}