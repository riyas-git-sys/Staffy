import { NavLink } from 'react-router-dom';

export default function Sidebar({ onLinkClick }) {
  const navItems = [
    { path: '/', name: 'Dashboard' },
    { path: '/employees', name: 'Employees' },
    { path: '/departments', name: 'Departments' },
    // Add more menu items as needed
  ];

  return (
    <div className="w-64 h-full bg-white flex flex-col">
      {/* Sidebar header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onLinkClick}
                className={({ isActive }) => 
                  `block px-4 py-3 rounded-md transition-colors
                  ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Sidebar footer (optional) */}
      <div className="p-4 border-t text-sm text-gray-500">
        © {new Date().getFullYear()} Staffy
      </div>
    </div>
  );
}