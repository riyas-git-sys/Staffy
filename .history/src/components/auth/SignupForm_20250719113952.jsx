import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function SignupForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      // 1. Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Update profile with display name (combines first + last)
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });

      // 3. Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName,
        lastName,
        email,
        createdAt: new Date(),
        role: 'employee' // Default role
      });

      console.log("Signup successful:", userCredential.user);
      navigate('/dashboard');
    } catch (err) {
      console.error("Signup error:", err);
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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          placeholder="John"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          autoComplete="given-name"
        />
        
        <Input
          label="Last Name"
          type="text"
          placeholder="Doe"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          autoComplete="family-name"
        />
      </div>
      
      <Input
        label="Email"
        type="email"
        placeholder="employee@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength="6"
        autoComplete="new-password"
      />
      
      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        autoComplete="new-password"
      />
      
      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full hover:bg-blue-700 bg-blue-600 text-white font-semibold py-2 px-4 rounded transform transition-transform duration-200 hover:scale-[1.02]"
      >
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