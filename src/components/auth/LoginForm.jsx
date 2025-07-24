import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error("Login error:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        throw { code: 'auth/user-not-found' };
      }

      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(`Password reset link sent to ${email}`);
      setShowForgotPassword(false);
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code) => {
    switch(code) {
      case 'auth/invalid-email':
        return 'Invalid email format';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Incorrect email or password';
      case 'auth/too-many-requests':
        return 'Account temporarily locked. Try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'Login failed. Please try again';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Messages */}
      {error && (
        <div className="p-3 sm:p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Success Messages */}
      {successMessage && (
        <div className="p-3 sm:p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-200">
          {successMessage}
        </div>
      )}

      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        placeholder="employee@company.com"
        className="w-full"
      />

      {!showForgotPassword && (
        <>
          {/* Password Input */}
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full"
          />

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
                onClick={() => setShowForgotPassword(true)}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center border border-transparent shadow-sm text-sm sm:text-base text-white font-semibold py-3 px-4 rounded-md bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : 'Sign in'}
          </Button>
        </>
      )}

      {/* Forgot Password Section */}
      {showForgotPassword && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="flex-1 justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <Button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              disabled={loading}
              className="flex-1 justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}