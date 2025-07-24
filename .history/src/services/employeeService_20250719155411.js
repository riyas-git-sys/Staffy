import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';

// Reference to the employees collection
const employeesRef = collection(db, 'employees');

// Add a new employee
export const addEmployee = async (employeeData) => {
  try {
    const docRef = await addDoc(collection(db, 'employees'), {
      ...employeeData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Active'
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding employee: ", error);
    throw error;
  }
};

// Get all employees (with optional filters)
export const getEmployees = async (filters = {}) => {
  try {
    // Start with base query
    let q = query(employeesRef, orderBy('createdAt', 'desc'));
    
    // Apply filters if provided
    if (filters.department && filters.department !== 'all') {
      q = query(q, where('department', '==', filters.department));
    }
    
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting employees: ", error);
    throw new Error("Failed to fetch employees");
  }
};

// Get a single employee by ID
export const getEmployeeById = async (id) => {
  try {
    const docRef = doc(db, 'employees', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Employee not found");
    }
  } catch (error) {
    console.error("Error getting employee: ", error);
    throw error;
  }
};

// Update an employee
export const updateEmployee = async (id, updates) => {
  try {
    const docRef = doc(db, 'employees', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date() // Add update timestamp
    });
  } catch (error) {
    console.error("Error updating employee: ", error);
    throw new Error("Failed to update employee");
  }
};

// Delete an employee
export const deleteEmployee = async (id) => {
  try {
    const docRef = doc(db, 'employees', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting employee: ", error);
    throw new Error("Failed to delete employee");
  }
};