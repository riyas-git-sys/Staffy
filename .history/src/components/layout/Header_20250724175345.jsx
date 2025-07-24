import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

export default function Header({ onMenuClick, sidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
            className="h-10 w-auto"  // Changed to w-auto for proper aspect ratio
          />
        </div>

        {/* Logout button - fixed on the right */}
        <div className="flex-row justify-end">
          {/* Profile Icon Button */}
          <button 
            onClick={toggleMenu}
            className="rounded-full bg-[#F9CBD6] p-2 hover:bg-[#f5b5c5] transition-colors"
          >
            <Ionicons 
              name="person" 
              size={24} 
              color="#9E182B" 
            />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-md shadow-lg border border-[#F9CBD6] z-10 min-w-[160px]">
              {user ? (
                <button 
                  className="flex items-center px-4 py-3 w-full text-left hover:bg-gray-100 transition-colors"
                  onClick={async () => {
                    await signOut(auth);
                    setUser(null);
                    setShowMenu(false);
                  }}
                >
                  <Ionicons name="log-out" size={18} color="#9E182B" className="mr-2" />
                  <span className="text-[#9E182B] font-semibold">Logout</span>
                </button>
              ) : (
                <button 
                  className="flex items-center px-4 py-3 w-full text-left hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    router.push('/auth');
                    setShowMenu(false);
                  }}
                >
                  <Ionicons name="log-in" size={18} color="#9E182B" className="mr-2" />
                  <span className="text-[#9E182B] font-semibold">Sign In / Sign Up</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}