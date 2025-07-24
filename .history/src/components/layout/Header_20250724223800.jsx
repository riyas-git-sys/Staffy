import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { IoPerson, IoLogOut, IoLogIn, IoMenu, IoClose, IoNotifications } from 'react-icons/io5';

export default function Header({ onMenuClick, sidebarOpen }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);

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
    <header className="bg-white shadow-lg sticky top-0 z-40 w-full border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center relative">
        {/* Sidebar toggle button */}
        <button
          type="button"
          className="md:hidden mr-4 p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
          onClick={onMenuClick}
        >
          <span className="sr-only">{sidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
          {sidebarOpen ? (
            <IoClose className="h-6 w-6" />
          ) : (
            <IoMenu className="h-6 w-6" />
          )}
        </button>

        {/* Centered logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img
            src="https://i.ibb.co/C3r84TzZ/emplogo.png"
            alt="Staffy-logo"
            className="h-12 w-auto"
          />
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

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
              aria-label="User menu"
            >
              <IoPerson size={22} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.email || 'user@example.com'}
                      </p>
                    </div>
                    <button
                      className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      onClick={handleLogout}
                    >
                      <IoLogOut size={16} className="mr-3" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <button
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => navigate('/login')}
                  >
                    <IoLogIn size={16} className="mr-3" />
                    <span className="font-medium">Sign In</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}