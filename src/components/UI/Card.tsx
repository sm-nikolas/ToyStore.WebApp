import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md',
  hover = false 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${paddingClasses[padding]} transition-all duration-200 ${
      hover ? 'hover:shadow-lg hover:border-gray-300 transform hover:scale-[1.01]' : 'shadow-sm'
    } ${className}`}>
      {children}
    </div>
  );
};

export default Card;