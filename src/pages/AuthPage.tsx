import React from 'react';
import LoginForm from '../components/Auth/LoginForm';

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm lg:max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-200">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;