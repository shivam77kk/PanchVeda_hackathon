import React from 'react';
import { Clock, User, Phone, Video } from 'lucide-react';

interface AppointmentRowProps {
  appointment: {
    id: string;
    patientName: string;
    time: string;
    duration: string;
    status: string;
    type: string;
    notes: string;
  };
  onStatusUpdate: (id: string, status: string) => void;
}

const AppointmentRow: React.FC<AppointmentRowProps> = ({ appointment, onStatusUpdate }) => {
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    'in-progress': 'bg-yellow-100 text-yellow-800'
  };

  const typeIcons = {
    consultation: User,
    'follow-up': Phone,
    online: Video
  };

  const TypeIcon = typeIcons[appointment.type as keyof typeof typeIcons] || User;

  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <TypeIcon size={18} className="text-green-600" />
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{appointment.time}</span>
              </div>
              <span>•</span>
              <span>{appointment.duration}</span>
              <span>•</span>
              <span className="capitalize">{appointment.type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[appointment.status as keyof typeof statusColors]
          }`}>
            {appointment.status.replace('-', ' ')}
          </span>
          
          <div className="flex space-x-1">
            <button
              onClick={() => onStatusUpdate(appointment.id, 'completed')}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            >
              Complete
            </button>
            <button
              onClick={() => onStatusUpdate(appointment.id, 'cancelled')}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      {appointment.notes && (
        <div className="mt-3 pl-14">
          <p className="text-sm text-gray-600">{appointment.notes}</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentRow;