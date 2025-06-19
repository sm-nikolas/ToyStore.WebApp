import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import ClientList from '../components/Clients/ClientList';
import StatisticsPage from '../components/Statistics/StatisticsPage';

const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'clients':
        return <ClientList />;
      case 'statistics':
        return <StatisticsPage />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        {/* Sidebar para desktop */}
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        
        {/* Sidebar móvel */}
        <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
          <div 
            className={`fixed inset-0 bg-gray-600 transition-all duration-300 ease-in-out ${
              sidebarOpen ? 'bg-opacity-75 backdrop-blur-sm' : 'bg-opacity-0'
            }`}
            onClick={() => setSidebarOpen(false)} 
          />
          <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <Sidebar activeTab={activeTab} onTabChange={(tab) => {
              setActiveTab(tab);
              setSidebarOpen(false);
            }} />
          </div>
        </div>
        
        <main className="flex-1 p-4 lg:p-6 w-full lg:w-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainPage;