import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmployeeById, updateEmployee } from '../../services/employeeService';
import EmployeeForm from './EmployeeForm';
import Loader from '../ui/Loader';
import Alert from '../ui/Alert';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeById(id);
        setEmployee(data);
      } catch (err) {
        setError(err.message || 'Failed to load employee data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployee();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await updateEmployee(id, formData);
      navigate('/employees', { state: { message: 'Employee updated successfully!' } });
    } catch (err) {
      setError(err.message || 'Failed to update employee');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;
  if (!employee) return <Alert type="warning" message="Employee not found" />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>
      <EmployeeForm 
        employeeData={employee} 
        onSuccess={() => navigate('/employees')}
        onSubmit={handleSubmit}
      />
    </div>
  );
}