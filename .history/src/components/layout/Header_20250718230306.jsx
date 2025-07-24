export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-900">Employee Dashboard</h1>
        <button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </header>
  )
}