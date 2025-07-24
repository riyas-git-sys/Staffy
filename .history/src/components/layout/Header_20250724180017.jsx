import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { Ionicons } from 'react-icons/io5'; // Make sure to install react-icons

export default function Header({ onMenuClick, sidebarOpen }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [user] = useState(auth.currentUser); // Or use your auth state management

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
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
        {/* Sidebar toggle button - always on the far left */}
        <button
          type="button"
          className="md:hidden mr-4 p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
          onClick={onMenuClick}
        >
          <span className="sr-only">{sidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Centered logo using absolute positioning */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img 
            src="https://i.ibb.co/C3r84TzZ/emplogo.png" 
            alt="Staffy-logo" 
            className="h-10 w-auto"
          />
        </div>

        {/* Profile dropdown - fixed on the right */}
        <div className="ml-auto relative">
          <button 
            onClick={toggleMenu}
            className="rounded-full bg-[#F9CBD6] p-2 hover:bg-[#f5b5c5] transition-colors"
          >
            <Ionicons name="person" size={20} color="#9E182B" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              {user ? (
                <button
  className="flex items-center px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded w-full text-left justify-center"
  onClick={handleLogout}
>
  <Ionicons name="log-out" size={16} color="white" className="mr-2" />
  Logout
</button>
              ) : (
                <button
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => navigate('/login')}
                >
                  <Ionicons name="log-in" size={16} color="#9E182B" className="mr-2" />
                  <span className="text-[#9E182B] font-medium">Sign In</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}