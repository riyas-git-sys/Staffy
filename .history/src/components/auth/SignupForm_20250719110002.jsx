import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        return setError("Passwords don't match");
    }

    setError('');
    setLoading(true);
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Signup successful:", userCredential.user);
        navigate('/');
    } catch (err) {
        console.error("Signup error:", err); // Add this line
        setError(getErrorMessage(err.code));
    } finally {
        setLoading(false);
    }
    };

  const getErrorMessage = (code) => {
    switch(code) {
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'auth/invalid-email':
        return 'Invalid email';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      default:
        return 'Signup failed. Please try again';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength="6"
      />
      
      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      
      <Button type="submit" disabled={loading} className="w-full hover:bg-blue-700 bg-blue-600 text-white font-semibold py-2 px-4 rounded transform transition-transform duration-200 hover:scale-[1.02] ">
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>
      
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:text-blue-500">
          Log in
        </a>
      </p>
    </form>
  );
}