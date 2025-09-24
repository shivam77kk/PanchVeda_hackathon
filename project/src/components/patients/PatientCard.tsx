import React from 'react';
import { User, Phone, Mail, Calendar, Clock } from 'lucide-react';

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
    age: number;
    gender: string;
    status: string;
    currentPlan: string;
    lastVisit: string | null;
    nextAppointment: string | null;
    avatar: string;
  };
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <User className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500">{patient.age} years, {patient.gender}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusColors[patient.status as keyof typeof statusColors]
        }`}>
          {patient.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail size={14} />
          <span className="truncate">{patient.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone size={14} />
          <span>{patient.phone}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium text-gray-900 mb-1">Current Plan</p>
        <p className="text-sm text-gray-600">{patient.currentPlan}</p>
      </div>

      <div className="space-y-2 text-xs text-gray-500">
        {patient.lastVisit && (
          <div className="flex items-center space-x-2">
            <Clock size={12} />
            <span>Last visit: {patient.lastVisit}</span>
          </div>
        )}
        {patient.nextAppointment && (
          <div className="flex items-center space-x-2">
            <Calendar size={12} />
            <span>Next: {patient.nextAppointment}</span>
          </div>
        )}
      </div>

      <div className="flex space-x-2 mt-4">
        <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
          View Details
        </button>
        <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Contact
        </button>
      </div>
    </div>
  );
};

export default PatientCard;