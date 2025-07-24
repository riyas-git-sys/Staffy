import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - fixed position on mobile, overlay behavior */}
      <div className={`fixed inset-y-0 z-50 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar />
      </div>

      {/* Main content area - never moves */}
      <div className="flex-1 flex flex-col w-full">
        <Header onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 p-6">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
}