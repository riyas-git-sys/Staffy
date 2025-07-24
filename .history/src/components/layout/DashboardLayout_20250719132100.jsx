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
      {/* Sidebar - fixed width when open */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 fixed md:relative z-50 h-full overflow-hidden md:w-64 md:overflow-visible`}>
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}