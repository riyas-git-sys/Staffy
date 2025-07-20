import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';

export const getEmployees = async () => {
  const snapshot = await getDocs(collection(db, 'employees'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addEmployee = async (employeeData) => {
  await addDoc(collection(db, 'employees'), employeeData);
};

export const updateEmployee = async (id, employeeData) => {
  await updateDoc(doc(db, 'employees', id), employeeData);
};

export const deleteEmployee = async (id) => {
  await deleteDoc(doc(db, 'employees', id));
};

export const getEmployeesByDepartment = async (department) => {
  const q = query(
    collection(db, 'employees'),
    where('department', '==', department)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};