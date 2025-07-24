import { 
  IoClose, 
  IoHome, 
  IoPeople, 
  IoBusiness, 
  IoStatsChart,
  IoSettings,
  IoCalendar,
  IoDocument,
  IoCard,
  IoChevronRight
} from 'react-icons/io5';

const Sidebar = ({ setShowSidebar }) => {
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
    },
    { 
      href: "/departments", 
      label: "Departments", 
      icon: IoBusiness,
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "hover:from-purple-600 hover:to-purple-700"
    },
    { 
      href: "/analytics", 
      label: "Analytics", 
      icon: IoStatsChart,
      gradient: "from-orange-500 to-orange-600",
      hoverGradient: "hover:from-orange-600 hover:to-orange-700"
    },
    { 
      href: "/calendar", 
      label: "Calendar", 
      icon: IoCalendar,
      gradient: "from-red-500 to-red-600",
      hoverGradient: "hover:from-red-600 hover:to-red-700"
    },
    { 
      href: "/reports", 
      label: "Reports", 
      icon: IoDocument,
      gradient: "from-cyan-500 to-cyan-600",
      hoverGradient: "hover:from-cyan-600 hover:to-cyan-700"
    },
    { 
      href: "/payroll", 
      label: "Payroll", 
      icon: IoCard,
      gradient: "from-pink-500 to-pink-600",
      hoverGradient: "hover:from-pink-600 hover:to-pink-700"
    },
    { 
      href: "/settings", 
      label: "Settings", 
      icon: IoSettings,
      gradient: "from-gray-500 to-gray-600",
      hoverGradient: "hover:from-gray-600 hover:to-gray-700"
    }
  ];

  return (
    <div className="w-64 h-full bg-gradient-to-b from-white via-gray-50 to-white shadow-2xl border-r border-gray-200/50 backdrop-blur-sm">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-gray-200/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <IoBusiness size={18} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Staffy</h2>
              <p className="text-xs text-gray-500">Employee Management</p>
            </div>
          </div>
          <button 
            className="group p-2 rounded-xl text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md hover:shadow-lg" 
            onClick={() => setShowSidebar(false)}
          >
            <IoClose size={20} className="transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <nav className="p-4 space-y-2">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Main Menu
          </h3>
        </div>
        
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index} className="group">
                <a 
                  href={item.href} 
                  className={`
                    relative flex items-center px-4 py-3 rounded-xl text-gray-700 
                    hover:text-white hover:bg-gradient-to-r ${item.hoverGradient}
                    transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-x-2
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    shadow-sm hover:shadow-lg
                  `}
                >
                  {/* Icon container with gradient background */}
                  <div className={`
                    relative p-2 rounded-lg bg-gradient-to-r ${item.gradient} shadow-md mr-4
                    group-hover:shadow-lg group-hover:scale-110 transition-all duration-300
                  `}>
                    <IconComponent size={18} color="white" />
                    <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Text */}
                  <span className="font-medium group-hover:font-semibold transition-all duration-300">
                    {item.label}
                  </span>
                  
                  {/* Arrow indicator */}
                  <IoChevronRight 
                    size={16} 
                    className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                  />
                  
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Enhanced Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/80">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <IoPeople size={20} color="white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Team Status</p>
              <p className="text-xs text-gray-600">24 employees online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated border */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 animate-gradient-y"></div>
      
      <style jsx>{`
        @keyframes gradient-y {
          0%, 100% {
            background-size: 200% 200%;
            background-position: center top;
          }
          50% {
            background-size: 200% 200%;
            background-position: center bottom;
          }
        }
        .animate-gradient-y {
          animation: gradient-y 4s ease infinite;
        }
      `}</style>
    </div>
  );
};