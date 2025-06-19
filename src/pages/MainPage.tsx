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
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
              <Sidebar activeTab={activeTab} onTabChange={(tab) => {
                setActiveTab(tab);
                setSidebarOpen(false);
              }} />
            </div>
          </div>
        )}
        
        <main className="flex-1 p-4 lg:p-6 w-full lg:w-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainPage;