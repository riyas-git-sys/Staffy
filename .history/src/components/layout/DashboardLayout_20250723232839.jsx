import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking a link (mobile only)
  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - fixed on mobile, static on desktop */}
      <div 
        className={`
          fixed md:static inset-y-0 z-50 w-64 transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transition-transform duration-300 ease-in-out
        `}
      >
        <Sidebar onLinkClick={handleLinkClick} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full md:w-[calc(100%-16rem)] ml-0 md:ml-64">
        <Header onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
}