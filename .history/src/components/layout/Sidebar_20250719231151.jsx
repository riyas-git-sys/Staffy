export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-white shadow">
      {/* Sidebar content */}
      <nav>
        <ul className="space-y-2">
          <li><a href="/employees" className="block px-4 py-2 hover:bg-gray-700 rounded">Employees</a></li>
          <li><a href="/departments" className="block px-4 py-2 hover:bg-gray-700 rounded">Departments</a></li>
          <p>More menu items...</p>
          <p>More menu items...</p>
          <p>More menu items...</p>
          <p>More menu items...</p>
          <p>More menu items...</p>
          <p>More menu items...</p>
        </ul>
      </nav>
    </div>
  )
}