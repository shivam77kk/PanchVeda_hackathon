import React from 'react';
import { Phone, Mail, Calendar, Eye, Edit, FileText } from 'lucide-react';

interface PatientCardProps {
  patient: any;
  onViewDetails: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onViewDetails }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {patient.avatar}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{patient.name}</h3>
            <p className="text-sm text-gray-600">{patient.age} years, {patient.gender}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          <span>{patient.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>Last visit: {patient.lastVisit}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Primary Condition</h4>
        <p className="text-sm text-cyan-600 font-medium">{patient.condition}</p>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-800 mb-2">Current Treatments</h4>
        <div className="flex flex-wrap gap-2">
          {patient.treatments.map((treatment: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded-md text-xs"
            >
              {treatment}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
        <button
          onClick={onViewDetails}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors text-sm"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </button>
        <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
          <Edit className="h-4 w-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
          <FileText className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PatientCard;