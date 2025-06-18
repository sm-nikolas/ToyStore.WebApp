import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'green' | 'emerald' | 'teal' | 'lime';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, color = 'green' }) => {
  const colorClasses = {
    green: 'text-green-600 bg-green-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    teal: 'text-teal-600 bg-teal-50',
    lime: 'text-lime-600 bg-lime-50'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {trend && (
            <div className="flex items-center">
              <span className={`text-sm font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]} transition-transform duration-200 hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;