import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { IoMenu } from 'react-icons/io5';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile menu button (only shows on small screens) */}
      <button 
        onClick={toggleSidebar}
        className="fixed lg:hidden z-50 top-4 left-4 p-2 rounded-md text-gray-700 bg-white shadow-md"
      >
        <IoMenu size={24} />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full overflow-x-hidden">
        <Header />
        
        <main className="flex-1 p-6 mt-14">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
}