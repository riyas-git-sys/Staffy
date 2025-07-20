import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.AIzaSyB5ah5l_yc2UakBfhuYNbkmvU3w0DdqhAc,
  authDomain: "employee-data-594df.firebaseapp.com",
  projectId: "employee-data-594df",
  storageBucket: "employee-data-594df.firebasestorage.app",
  messagingSenderId: "37083992735",
  appId: "1:37083992735:web:fc482473db8f61486348aa",
  measurementId: "G-E07V23Z60S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);