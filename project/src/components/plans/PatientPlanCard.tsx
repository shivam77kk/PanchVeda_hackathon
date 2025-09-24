import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, User, Activity, Pill, BarChart3 } from 'lucide-react';

interface Plan {
  id: string;
  patientName: string;
  patientEmail: string;
  patientAvatar: string;
  planTitle: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: string;
  currentPhase: string;
}

interface PatientPlanCardProps {
  plan: Plan;
}

const PatientPlanCard: React.FC<PatientPlanCardProps> = ({ plan }) => {
  const { setCurrentView, setSelectedPatient } = useApp();

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800'
  };

  const handleViewDaily = () => {
    setSelectedPatient(plan);
    setCurrentView('daily-schedule');
  };

  const handleViewRecord = () => {
    setSelectedPatient(plan);
    setCurrentView('patient-record');
  };

  const handleViewPhases = () => {
    setSelectedPatient(plan);
    setCurrentView('phases');
  };

  const handleViewMeds = () => {
    setSelectedPatient(plan);
    setCurrentView('medications');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
          <User className="text-green-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{plan.patientName}</h3>
          <p className="text-sm text-gray-500">{plan.patientEmail}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[plan.status as keyof typeof statusColors]}`}>
          {plan.status}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">{plan.planTitle}</h4>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{plan.startDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{plan.endDate}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-green-600">{plan.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${plan.progress}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Current: {plan.currentPhase}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={handleViewDaily}
          className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
        >
          <Activity size={14} />
          <span>Daily</span>
        </button>
        <button 
          onClick={handleViewRecord}
          className="border border-green-600 text-green-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors flex items-center justify-center space-x-1"
        >
          <User size={14} />
          <span>Record</span>
        </button>
        <button 
          onClick={handleViewPhases}
          className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1"
        >
          <BarChart3 size={14} />
          <span>Phases</span>
        </button>
        <button 
          onClick={handleViewMeds}
          className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1"
        >
          <Pill size={14} />
          <span>Meds</span>
        </button>
      </div>
    </div>
  );
};

export default PatientPlanCard;