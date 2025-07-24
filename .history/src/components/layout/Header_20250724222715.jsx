import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { IoPerson, IoLogOut, IoLogIn } from 'react-icons/io5'; // Corrected Ionicons import

export default function Header({ onMenuClick, sidebarOpen }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);

  // Properly track auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <header className="bg-gradient-to-r from-white to-gray-50 shadow-lg sticky top-0 z-40 w-full border-b border-gray-200 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center relative">
        {/* Sidebar toggle button with enhanced styling */}
        <button
          type="button"
          className="md:hidden mr-4 p-3 rounded-xl text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          onClick={onMenuClick}
        >
          <span className="sr-only">{sidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
          <div className="relative w-6 h-6">
            {sidebarOpen ? (
              <IoClose 
                className="h-6 w-6 transition-transform duration-300 ease-in-out transform rotate-0 hover:rotate-90" 
              />
            ) : (
              <IoMenu 
                className="h-6 w-6 transition-transform duration-300 ease-in-out transform hover:rotate-6" 
              />
            )}
          </div>
        </button>

        {/* Centered logo with animation */}
        <div className="absolute left-1/2 transform -translate-x-1/2 transition-transform duration-300 hover:scale-105">
          <div className="relative">
            <img
              src="https://i.ibb.co/C3r84TzZ/emplogo.png"
              alt="Staffy-logo"
              className="h-12 w-auto drop-shadow-md transition-all duration-300 hover:drop-shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-lg blur-lg -z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center space-x-3">
          {/* Notifications button */}
          <button className="relative p-2 rounded-xl text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            <IoNotifications size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-pulse">
              3
            </span>
          </button>

          {/* Profile dropdown with enhanced styling */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="group relative rounded-full bg-gradient-to-r from-[#5fd1ee] to-[#4fb3d3] p-3 hover:from-[#3c73a7] hover:to-[#2c5a87] transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 shadow-lg hover:shadow-xl"
              aria-label="User menu"
            >
              <IoPerson size={22} color="#0c28a3" className="transition-transform duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
            </button>

            {/* Enhanced Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl py-2 z-50 border border-gray-200/50 animate-in slide-in-from-top-2 duration-200">
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white/95 backdrop-blur-md border-l border-t border-gray-200/50 rotate-45 rounded-tl-sm"></div>
                
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100/80">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">user@example.com</p>
                    </div>
                    <button
                      className="group flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 w-full text-left transition-all duration-200 rounded-xl mx-2 my-1"
                      onClick={handleLogout}
                    >
                      <div className="p-1 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-200 mr-3">
                        <IoLogOut size={16} className="text-red-600 group-hover:animate-pulse" />
                      </div>
                      <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 w-full text-left transition-all duration-200 rounded-xl mx-2 my-1"
                    onClick={() => navigate('/login')}
                  >
                    <div className="p-1 rounded-lg bg-gray-100 group-hover:bg-blue-200 transition-colors duration-200 mr-3">
                      <IoLogIn size={16} className="text-gray-600 group-hover:text-blue-600 group-hover:animate-bounce" />
                    </div>
                    <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">Sign In</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Animated bottom border */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-gradient-x"></div>
      
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </header>
  );
}