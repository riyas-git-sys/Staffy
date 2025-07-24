import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children, toggleSidebar, sidebarOpen }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Enhanced Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Enhanced Sidebar - with slide and scale animations */}
      <div className={`
        fixed inset-y-0 z-50 w-64 transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0 scale-100' : '-translate-x-full scale-95'} 
        md:relative md:translate-x-0 md:scale-100
      `}>
        <div className="h-full transition-all duration-300 hover:shadow-2xl">
          <Sidebar />
        </div>
      </div>

      {/* Enhanced Main content area */}
      <div className="flex-1 flex flex-col w-full relative z-10">
        {/* Header with enhanced positioning */}
        <div className="relative z-30">
          <Header onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        </div>

        {/* Main content with enhanced styling */}
        <main className="flex-1 p-6 relative z-20 overflow-auto">
          {/* Content wrapper with glassmorphism effect */}
          <div className="relative">
            {/* Floating content container */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 min-h-[calc(100vh-200px)] transition-all duration-300 hover:shadow-2xl hover:bg-white/80">
              {/* Content area with subtle animation */}
              <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
                {children}
                <Outlet />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute top-4 right-8 w-1 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse animation-delay-1000"></div>
              <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse animation-delay-2000"></div>
            </div>

            {/* Floating action elements */}
            <div className="fixed bottom-8 right-8 flex flex-col space-y-4 z-40">
              <button className="group w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 flex items-center justify-center">
                <svg className="w-6 h-6 text-white group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              <button className="group w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-rotate-12 flex items-center justify-center">
                <svg className="w-5 h-5 text-white group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {/* Progress indicator */}
            <div className="fixed top-20 right-6 z-30">
              <div className="w-1 h-20 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full transition-all duration-300 animate-pulse h-1/3"></div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        @keyframes fade-in-50 {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slide-in-from-bottom-4 {
          from {
            transform: translateY(1rem);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation: fade-in-50 0.7s ease-out, slide-in-from-bottom-4 0.7s ease-out;
        }
      `}</style>
    </div>
  );
};