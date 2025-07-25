import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { 
  IoClose, 
  IoHome, 
  IoPeople, 
  IoMegaphoneOutline, 
  IoFolderOutline,
  IoChevronDown,
  IoChevronUp
} from 'react-icons/io5';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [user] = useAuthState(auth);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const menuItems = [
    { 
      to: "/", 
      label: "Dashboard", 
      icon: IoHome,
    },
    { 
      to: "/employees", 
      label: "Employees", 
      icon: IoPeople,
    },
    { 
      to: "/projects", 
      label: "Projects", 
      icon: IoFolderOutline,
      restricted: false
    },
    { 
      to: "/announcements", 
      label: "Announcements", 
      icon: IoMegaphoneOutline,
      badge: announcementCount > 0 ? announcementCount.toString() : null
    }
  ];

  // Check if a menu item is active
  const isActive = (path) => {
    // Special case for dashboard since it's the root path
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Fetch active employees count
  useEffect(() => {
    try {
      const q = query(
        collection(db, 'employees'),
        where('status', '==', 'Active')
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          setActiveEmployees(snapshot.size);
          setLoading(false);
        },
        (err) => {
          setError('Failed to load employee data');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      setError('Connection error');
      setLoading(false);
    }
  }, []);

  // Fetch announcements count
  useEffect(() => {
    const q = query(collection(db, 'announcements'));
    
    const unsubscribeAnnouncements = onSnapshot(q, 
      (snapshot) => {
        setAnnouncementCount(snapshot.size);
        setLoading(false);
      },
      (err) => {
        console.error('Announcement count error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribeAnnouncements();
  }, []);

  const toggleMenu = (index) => {
    setExpandedMenu(expandedMenu === index ? null : index);
  };

  return (
    <div className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg z-50 transition-all duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3 mb-1 mt-1 hover:cursor-pointer" onClick={() => navigate('/')}>
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
            if (item.restricted && !user?.isAdmin) return null;
            
            const IconComponent = item.icon;
            const active = isActive(item.to);
            
            return (
              <li key={index}>
                <Link 
                  to={item.to}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    active 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  <div className={`p-2 rounded-lg mr-3 ${
                    active 
                      ? index === 0 ? 'bg-blue-700' : 
                        index === 1 ? 'bg-green-700' :
                        index === 2 ? 'bg-purple-700' :
                        'bg-orange-700'
                      : index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 
                        index === 1 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                        index === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                        'bg-gradient-to-r from-orange-500 to-orange-600'
                  }`}>
                    <IconComponent size={18} color="white" />
                  </div>
                  <span className={`font-medium ${active ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                      active ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div 
          className="bg-blue-50 rounded-lg p-3 cursor-pointer hover:bg-blue-100 transition-colors group"
          onClick={() => navigate('/employees')}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <IoPeople size={20} color="white" />
              </div>
              {loading && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Team Status</p>
              {error ? (
                <p className="text-xs text-red-500">{error}</p>
              ) : loading ? (
                <p className="text-xs text-gray-500">Loading...</p>
              ) : (
                <p className="text-xs text-gray-600">
                  <span className="font-medium text-blue-600">{activeEmployees}</span> {activeEmployees === 1 ? 'employee' : 'employees'} active
                </p>
              )}
            </div>
          </div>
          <div className="absolute bottom-5 right-6 flex items-center">
            <div className={`w-2 h-2 rounded-full mr-1 ${
              error ? 'bg-red-500' : 'bg-green-500'
            }`}></div>
            <span className="text-[10px] text-gray-500">
              {error ? 'Offline' : 'Live'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}