import React from 'react';
import { Clock, CheckCircle, Play, Calendar } from 'lucide-react';

interface ScheduleItemProps {
  id: number;
  patientName: string;
  treatment: string;
  time: string;
  duration: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  avatar: string;
  notes: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  patientName,
  treatment,
  time,
  duration,
  status,
  avatar,
  notes
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          label: 'Completed',
          labelColor: 'bg-green-100 text-green-700'
        };
      case 'in-progress':
        return {
          icon: Play,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          label: 'In Progress',
          labelColor: 'bg-blue-100 text-blue-700'
        };
      default:
        return {
          icon: Calendar,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          label: 'Scheduled',
          labelColor: 'bg-gray-100 text-gray-700'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${config.bg} ${config.border} border-l-4`}>
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {avatar}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{patientName}</h3>
              <p className="text-cyan-600 font-medium">{treatment}</p>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.labelColor}`}>
                {config.label}
              </span>
              <StatusIcon className={`h-5 w-5 ${config.color}`} />
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>
            <span>•</span>
            <span>{duration}</span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed">{notes}</p>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center space-x-3">
            {status === 'scheduled' && (
              <>
                <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium">
                  Start Session
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Reschedule
                </button>
              </>
            )}
            
            {status === 'in-progress' && (
              <>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                  Complete Session
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Add Notes
                </button>
              </>
            )}
            
            {status === 'completed' && (
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                View Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleItem;