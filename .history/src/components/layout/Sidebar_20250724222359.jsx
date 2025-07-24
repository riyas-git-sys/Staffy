import { IoClose, IoHome, IoPeople } from 'react-icons/io5';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const menuItems = [
    { 
      href: "/", 
      label: "Dashboard", 
      icon: IoHome,
    },
    { 
      href: "/employees", 
      label: "Employees", 
      icon: IoPeople,
    }
  ];

  return (
    <div className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg z-40 transition-all duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow">
            <IoPeople size={18} color="white" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Staffy</h2>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors lg:hidden"
        >
          <IoClose size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 overflow-y-auto h-[calc(100vh-120px)]">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                  className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                  }`}>
                    <IconComponent size={18} color="white" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-3">
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