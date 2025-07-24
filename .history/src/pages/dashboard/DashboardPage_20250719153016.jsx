// Updated DashboardPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees } from '../../services/employeeService';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    departments: new Set()
  });

  useEffect(() => {
    const fetchData = async () => {
      const employees = await getEmployees();
      setStats({
        total: employees.length,
        active: employees.filter(e => e.status === 'Active').length,
        departments: new Set(employees.map(e => e.department))
      });
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/employees/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add New Employee
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Employees" value={stats.total} />
        <StatCard title="Active" value={stats.active} />
        <StatCard title="Departments" value={stats.departments.size} />
      </div>

      {/* Recent Employees List */}
      <EmployeeListPreview />
    </div>
  );
}