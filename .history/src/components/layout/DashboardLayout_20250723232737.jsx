import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Close sidebar when switching to mobile view if it was open
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static z-50 w-64 h-full bg-white shadow-lg lg:shadow-none
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'left-0' : '-left-64'} 
          lg:left-0
        `}
      >
        <Sidebar onLinkClick={handleLinkClick} />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col w-full lg:w-[calc(100%-16rem)] lg:ml-64">
        <Header 
          onMenuClick={toggleSidebar} 
          sidebarOpen={sidebarOpen} 
          isMobile={isMobile}
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
}