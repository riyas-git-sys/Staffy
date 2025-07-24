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

        {/* Dashboard title - properly centered */}
        <img src="https://i.ibb.co/C3r84TzZ/emplogo.png" alt="Staffy-logo" className='h-10 w-18 text-center' />
        <h1 className="text-xl font-semibold text-gray-900 flex-1 text-center">
          Employee Dashboard
        </h1>

        {/* Logout button - fixed on the right */}
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