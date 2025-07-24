import LoginForm from '../../components/auth/LoginForm';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md lg:max-w-4xl border border-gray-200 overflow-hidden">
        {/* Desktop Layout - Side by side */}
        <div className="lg:flex lg:min-h-[600px]">
          {/* Left Side - Branding & Image */}
          <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Logo and Branding */}
            <div className="text-center lg:text-left mb-6 lg:mb-8">
              <img
                src="https://i.ibb.co/C3r84TzZ/emplogo.png"
                alt="Staffy-logo"
                className="h-16 sm:h-20 lg:h-24 w-auto mx-auto lg:mx-0 mb-4 object-contain"
              />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Welcome to Staffy
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Because people matter
              </p>
            </div>

            {/* Illustration */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src="https://cdn.dribbble.com/users/1319343/screenshots/14584578/media/a77349bede651cdf43d49ad531180689.gif"
                className="w-full max-w-xs lg:max-w-sm h-auto rounded-lg object-cover shadow-lg"
                alt="Employee Login Illustration"
              />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto">
              {/* Mobile Header (hidden on desktop) */}
              <div className="text-center mb-6 lg:hidden">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Employee Login
                </h2>
                <p className="text-gray-600 text-sm">
                  Sign in to your account
                </p>
              </div>

              {/* Desktop Header (hidden on mobile) */}
              <div className="hidden lg:block text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Sign In
                </h2>
                <p className="text-gray-600">
                  Access your employee dashboard
                </p>
              </div>

              {/* Login Form Component */}
              <LoginFormContent />

              {/* Sign up link */}
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

// Simplified LoginForm Content (without the full-screen wrapper)
function LoginFormContent() {
  // You'll need to extract the form logic from your LoginForm component
  // and remove the full-screen wrapper. Here's a simplified version:
  
  return (
    <form className="space-y-6">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="employee@company.com"
        />
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <button
            type="button"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            Forgot password?
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.02]"
      >
        Sign in
      </button>
    </form>
  );
}