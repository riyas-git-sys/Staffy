export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-white shadow">
      {/* Sidebar content */}
      <div className="p-4 border-b flex items-end">
        <p className="flex-1 text-right text-xl font-bold text-red-800 ">Close</p>
      </div>
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