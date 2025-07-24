import LoginForm from '../../components/auth/LoginForm';
import { Link } from 'react-router-dom'; // Update from <a> to <Link>

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-md 
        w-[95%] h-[95vh] sm:w-[95%] sm:h-[95vh]
        md:w-full md:h-auto md:max-w-lg
        lg:max-w-4xl lg:h-auto
        overflow-auto p-4 sm:p-6 lg:p-8">
        
        {/* Mobile Layout - Single Column */}
        <div className="lg:hidden">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Employee Login</h1>
          <img
            src="https://i.ibb.co/C3r84TzZ/emplogo.png"
            alt="Staffy-logo"
            className="h-20 w-32 mb-4 mx-auto object-contain rounded-xl"
          />
          <img
            src="https://cdn.dribbble.com/users/1319343/screenshots/14584578/media/a77349bede651cdf43d49ad531180689.gif"
            className="w-full max-w-xs mx-auto rounded-xl mb-6"
            alt="Employee Login"
          />
          <LoginForm />
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:flex lg:min-h-[500px]">
          {/* Left Side - Branding & Image */}
          <div className="lg:w-1/2 p-6 flex flex-col justify-center">
            {/* Logo and Branding */}
            <div className="text-center lg:text-left mb-8">
              <img
                src="https://i.ibb.co/C3r84TzZ/emplogo.png"
                alt="Staffy-logo"
                className="h-20 lg:h-24 w-auto mx-auto lg:mx-0 mb-4 object-contain"
              />
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Welcome to Staffy
              </h1>
              <p className="text-gray-600 text-base">
                Because people matter
              </p>
            </div>

            {/* Illustration */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src="https://cdn.dribbble.com/users/1319343/screenshots/14584578/media/a77349bede651cdf43d49ad531180689.gif"
                className="w-full max-w-sm h-auto rounded-lg object-cover shadow-lg"
                alt="Employee Login Illustration"
              />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 p-6 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto">
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Sign In
                </h2>
                <p className="text-gray-600">
                  Access your employee dashboard
                </p>
              </div>

              <LoginForm />

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 