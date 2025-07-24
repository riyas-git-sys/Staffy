import { 
  IoClose, 
  IoHome, 
  IoPeople, 
  IoBusiness, 
  IoChevronRight
} from 'react-icons/io5';

export default function Sidebar({ setShowSidebar }) {
  const menuItems = [
    { 
      href: "/", 
      label: "Dashboard", 
      icon: IoHome,
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "hover:from-blue-600 hover:to-blue-700"
    },
    { 
      href: "/employees", 
      label: "Employees", 
      icon: IoPeople,
      gradient: "from-green-500 to-green-600",
      hoverGradient: "hover:from-green-600 hover:to-green-700"
    }
  ];

  return (
    <div className="w-64 h-full bg-white shadow-lg border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow">
              <IoBusiness size={18} color="white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Staffy</h2>
          </div>
          <button 
            className="p-2 text-red-600 hover:text-white hover:bg-red-500 rounded-full transition-colors duration-200"
            onClick={() => setShowSidebar(false)}
          >
            <IoClose size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Employee Management</p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Menu
          </h3>
        </div>
        
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index}>
                <a 
                  href={item.href} 
                  className={`
                    flex items-center px-4 py-3 rounded-lg text-gray-700 
                    hover:text-white hover:bg-gradient-to-r ${item.hoverGradient}
                    transition-all duration-200
                  `}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${item.gradient} mr-3`}>
                    <IconComponent size={18} color="white" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                  <IoChevronRight 
                    size={16} 
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <IoPeople size={20} color="white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Team Status</p>
              <p className="text-xs text-gray-600">24 employees online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}