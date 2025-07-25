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
  orderBy,
  getDoc
} from 'firebase/firestore';

// Reference to the employees collection
const employeesRef = collection(db, 'employees');

// Add a new employee with creator info
export const addEmployee = async (employeeData, currentUser) => {
  try {
    if (!currentUser?.uid) {
      throw new Error('User authentication information is incomplete');
    }

    const docRef = await addDoc(employeesRef, {
      ...employeeData,
      fullName: `${employeeData.firstName} ${employeeData.lastName}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Active',
      createdBy: {
        uid: currentUser.uid,
        name: currentUser.displayName || `${employeeData.firstName} ${employeeData.lastName}`,
        email: currentUser.email || 'unknown@email.com',
        timestamp: new Date()
      },
      lastModifiedBy: {
        uid: currentUser.uid,
        name: currentUser.displayName || `${employeeData.firstName} ${employeeData.lastName}`,
        email: currentUser.email || 'unknown@email.com',
        timestamp: new Date()
      }
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
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      // Include createdBy data if it exists
      createdBy: doc.data().createdBy || null,
      lastModifiedBy: doc.data().lastModifiedBy || null
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
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        // Include createdBy data if it exists
        createdBy: data.createdBy || null,
        lastModifiedBy: data.lastModifiedBy || null
      };
    } else {
      throw new Error("Employee not found");
    }
  } catch (error) {
    console.error("Error getting employee: ", error);
    throw error;
  }
};

// Update an employee with modifier info
export const updateEmployee = async (id, updates, currentUser) => {
  try {
    const docRef = doc(db, 'employees', id);
    
    await updateDoc(docRef, {
      ...updates,
      fullName: `${updates.firstName} ${updates.lastName}`,
      updatedAt: new Date(),
      lastModifiedBy: {
        uid: currentUser.uid,
        name: currentUser.displayName || 'Admin',
        email: currentUser.email,
        timestamp: new Date()
      }
    });
    
    // Return the updated employee data
    return getEmployeeById(id);
  } catch (error) {
    console.error("Error updating employee: ", error);
    throw new Error("Failed to update employee");
  }
};

// Delete an employee (permission check should be done before calling this)
export const deleteEmployee = async (id) => {
  try {
    const docRef = doc(db, 'employees', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting employee: ", error);
    throw new Error("Failed to delete employee");
  }
};

// Check if current user can modify an employee
export const canModifyEmployee = async (employeeId, currentUser) => {
  try {
    if (!currentUser) return false;
    
    // Admins can modify any employee
    if (currentUser.token?.isAdmin) return true;
    
    const employee = await getEmployeeById(employeeId);
    
    // Creator can modify their own employees
    if (employee.createdBy?.uid === currentUser.uid) return true;
    
    return false;
  } catch (error) {
    console.error("Error checking permissions: ", error);
    return false;
  }
};