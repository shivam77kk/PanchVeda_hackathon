import React, { useState } from 'react';
import { Calendar, List, Plus, Filter, Search } from 'lucide-react';
import AppointmentsList from './AppointmentsList';
import AppointmentCalendar from './AppointmentCalendar';
import NewAppointmentModal from './NewAppointmentModal';

const Appointments: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
            <p className="text-gray-600">Manage your patient appointments</p>
          </div>
          <button
            onClick={() => setShowNewAppointment(true)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Appointment</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-cyan-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List className="h-4 w-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-cyan-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <AppointmentsList searchTerm={searchTerm} filterStatus={filterStatus} />
      ) : (
        <AppointmentCalendar />
      )}

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <NewAppointmentModal onClose={() => setShowNewAppointment(false)} />
      )}
    </div>
  );
};

export default Appointments;