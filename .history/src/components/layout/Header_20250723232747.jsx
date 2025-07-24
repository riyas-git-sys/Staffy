import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

export default function Header({ onMenuClick, sidebarOpen, isMobile }) {
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
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          {isMobile && (
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
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
          )}

          {/* Logo - centered on mobile, left on desktop */}
          <div className={`${isMobile ? 'mx-auto' : 'ml-4'}`}>
            <img 
              src="https://i.ibb.co/C3r84TzZ/emplogo.png" 
              alt="Staffy-logo" 
              className="h-10 w-auto"
            />
          </div>
        </div>

        {/* Logout button */}
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}