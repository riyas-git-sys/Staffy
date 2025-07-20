// src/pages/employees/EmployeeListPage.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../../services/employeeService';
import EmployeeCard from '../../components/employees/EmployeeCard';

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search employees..."
          className="border p-2 rounded flex-1 max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link
          to="/employees/add"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-4"
        >
          Add Employee
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map(employee => (
          <EmployeeCard 
            key={employee.id} 
            employee={employee}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
