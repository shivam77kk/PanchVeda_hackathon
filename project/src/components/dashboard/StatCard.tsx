import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: 'cyan' | 'blue' | 'green' | 'orange';
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, progress }) => {
  const colorClasses = {
    cyan: {
      icon: 'text-cyan-600 bg-cyan-100',
      value: 'text-cyan-600',
      progress: 'bg-cyan-500',
    },
    blue: {
      icon: 'text-blue-600 bg-blue-100',
      value: 'text-blue-600',
      progress: 'bg-blue-500',
    },
    green: {
      icon: 'text-green-600 bg-green-100',
      value: 'text-green-600',
      progress: 'bg-green-500',
    },
    orange: {
      icon: 'text-orange-600 bg-orange-100',
      value: 'text-orange-600',
      progress: 'bg-orange-500',
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color].icon}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className={`text-3xl font-bold ${colorClasses[color].value}`}>{value}</div>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>

      {progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color].progress}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;