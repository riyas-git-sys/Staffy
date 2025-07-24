import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // You might want to redirect after logout, but that can be handled in the auth context
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">Employee Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}