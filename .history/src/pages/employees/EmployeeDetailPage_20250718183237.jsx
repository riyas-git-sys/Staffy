import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      const docRef = doc(db, 'employees', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEmployee({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchEmployee();
  }, [id]);

  if (loading) return <div className="p-4">Loading employee details...</div>;
  if (!employee) return <div className="p-4">Employee not found</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{employee.name}</h1>
            <p className="text-gray-600">{employee.position}</p>
            <p className="text-gray-500">{employee.department} Department</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {employee.status || 'Active'}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold text-gray-700">Contact Information</h2>
            <p className="text-gray-600">Email: {employee.email}</p>
            <p className="text-gray-600">Phone: {employee.phone || 'N/A'}</p>
          </div>
          <div>
            <h2 className="font-semibold text-gray-700">Employment Details</h2>
            <p className="text-gray-600">Hire Date: {employee.hireDate || 'N/A'}</p>
            <p className="text-gray-600">Salary: {employee.salary || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Link
            to="/employees"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Back to List
          </Link>
          <Link
            to={`/employees/edit/${employee.id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit Employee
          </Link>
        </div>
      </div>
    </div>
  );
}