import React, { useState } from 'react';
import { Calendar, List, Plus } from 'lucide-react';
import AppointmentRow from './AppointmentRow';
import CalendarView from './CalendarView';
import { mockAppointments } from '../../data/mockData';

const Appointments: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [appointments, setAppointments] = useState(mockAppointments);

  const handleStatusUpdate = (id: string, status: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={16} className="inline mr-2" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar size={16} className="inline mr-2" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center">
            <Plus size={20} />
            <span className="hidden sm:inline">New Appointment</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {appointments.map((appointment) => (
              <AppointmentRow 
                key={appointment.id} 
                appointment={appointment}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </div>
      ) : (
        <CalendarView appointments={appointments} />
      )}
    </div>
  );
};

export default Appointments;