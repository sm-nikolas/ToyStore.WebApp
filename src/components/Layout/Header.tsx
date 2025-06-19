import React from 'react';
import { Calendar, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../utils/auth';
import { getGreeting } from '../../utils/helpers';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, setUser } = useAuth();
  
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const greeting = getGreeting();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Botão de menu para mobile */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
                {greeting}, {user?.name}
              </h1>
              <p className="text-xs lg:text-sm text-gray-500 capitalize">{currentDate}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>ToyStore Dashboard</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-2 lg:px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;