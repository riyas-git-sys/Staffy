import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const authService = {
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if email is verified (optional)
      if (!userCredential.user.emailVerified) {
        console.warn('Email not verified');
        // You might want to handle this differently
      }
      
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: this._getAuthErrorMessage(error.code)
      };
    }
  },

  async signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      
      // Update user profile
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: this._getAuthErrorMessage(error.code)
      };
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: this._getAuthErrorMessage(error.code)
      };
    }
  },

  _getAuthErrorMessage(code) {
    switch(code) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'Account disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'Email already in use';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts not enabled';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later';
      default:
        return 'Authentication error. Please try again';
    }
  }
};