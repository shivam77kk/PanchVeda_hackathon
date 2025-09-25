import React from 'react';
import { Clock, Calendar, TrendingUp, MoreVertical } from 'lucide-react';

interface PatientPlanCardProps {
  id: number;
  name: string;
  age: number;
  plan: string;
  progress: number;
  status: 'active' | 'upcoming' | 'completed';
  sessionsCompleted: number;
  totalSessions: number;
  nextSession: string;
  condition: string;
  avatar: string;
}

const PatientPlanCard: React.FC<PatientPlanCardProps> = ({
  name,
  age,
  plan,
  progress,
  status,
  sessionsCompleted,
  totalSessions,
  nextSession,
  condition,
  avatar
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-700',
          label: 'Completed',
          progressColor: 'bg-green-500'
        };
      case 'upcoming':
        return {
          color: 'bg-yellow-100 text-yellow-700',
          label: 'Upcoming',
          progressColor: 'bg-yellow-500'
        };
      default:
        return {
          color: 'bg-blue-100 text-blue-700',
          label: 'Active',
          progressColor: 'bg-blue-500'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {avatar}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{name}, {age}</h3>
            <p className="text-sm text-gray-600">{condition}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-800 text-sm">{plan}</h4>
          <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
            <span>{sessionsCompleted}/{totalSessions} sessions</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${config.progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{nextSession}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <button className="flex-1 px-3 py-2 bg-cyan-50 text-cyan-600 rounded-md hover:bg-cyan-100 transition-colors text-xs font-medium">
            View Details
          </button>
          <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors text-xs font-medium">
            {status === 'active' ? 'Schedule' : status === 'upcoming' ? 'Start Plan' : 'Follow-up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientPlanCard;