import React from 'react';

interface PhaseProgressBarProps {
  progress: number;
  color: string;
}

const PhaseProgressBar: React.FC<PhaseProgressBarProps> = ({ progress, color }) => {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    gray: 'bg-gray-400'
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default PhaseProgressBar;