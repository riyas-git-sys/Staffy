import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';

export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const register = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};