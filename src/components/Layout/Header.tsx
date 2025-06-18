import React from 'react';
import { Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../utils/auth';

const Header: React.FC = () => {
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

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bom dia, {user?.name}
            </h1>
            <p className="text-sm text-gray-500 capitalize">{currentDate}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>ToyStore Dashboard</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;