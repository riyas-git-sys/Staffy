export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-white shadow">
      {/* Sidebar content */}
      <nav>
        <ul className="space-y-2">
          <li><a href="/employees" className="block px-4 py-2 hover:bg-gray-700 rounded">Employees</a></li>
          <nav>
            <Link to="/" className="block py-2">Dashboard</Link>
            <Link to="/employees" className="block py-2">Employees</Link>
            <Link to="/employees/add" className="block py-2">Add Employee</Link>
          </nav>
        </ul>
      </nav>
    </div>
  )
}