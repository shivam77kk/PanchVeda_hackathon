import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardContent from '../DashboardContent';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  // Close sidebar when clicking outside on mobile
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-teal-700">
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <div className="flex">
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        <main className="flex-1 p-3 sm:p-4 lg:p-6 min-h-screen">
          <DashboardContent currentView={currentView} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;