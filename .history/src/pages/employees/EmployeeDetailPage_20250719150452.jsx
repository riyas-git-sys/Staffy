// src/pages/employees/EmployeeDetailPage.jsx
import { useParams } from 'react-router-dom';
import { getEmployeeById } from '../../services/employeeService';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      const data = await getEmployeeById(id);
      setEmployee(data);
    };
    fetchEmployee();
  }, [id]);

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-start space-x-6">
        <img 
          src={employee.profileImage} 
          className="w-32 h-32 rounded-full object-cover"
        />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {employee.firstName} {employee.lastName}
          </h1>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          {/* Add other fields */}
        </div>
      </div>
    </div>
  );
}