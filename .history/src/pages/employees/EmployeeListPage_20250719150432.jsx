// src/pages/employees/EmployeeListPage.jsx
import { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../../services/employeeService';
import EmployeeCard from '../../components/employees/EmployeeCard';

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEmployees();
      setEmployees(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this employee?')) {
      await deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {employees.map(employee => (
        <EmployeeCard 
          key={employee.id} 
          employee={employee}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}