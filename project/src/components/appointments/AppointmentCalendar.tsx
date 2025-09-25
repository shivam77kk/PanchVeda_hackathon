import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const AppointmentCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const appointments = [
    { id: 1, date: '2024-01-15', time: '09:00', patient: 'Rajesh Kumar', treatment: 'Consultation' },
    { id: 2, date: '2024-01-15', time: '10:30', patient: 'Priya Sharma', treatment: 'Abhyanga' },
    { id: 3, date: '2024-01-15', time: '12:00', patient: 'Amit Patel', treatment: 'Shirodhara' },
    { id: 4, date: '2024-01-16', time: '14:00', patient: 'Sunita Desai', treatment: 'Follow-up' },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(apt => apt.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100">
      {/* Calendar Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth(currentDate).map((day, index) => {
            if (!day) {
              return <div key={index} className="p-2 h-24"></div>;
            }

            const dayAppointments = getAppointmentsForDate(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === currentDate.getMonth() && 
                           new Date().getFullYear() === currentDate.getFullYear();

            return (
              <div
                key={day}
                className={`p-2 h-24 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${
                  isToday ? 'bg-cyan-50 border-cyan-200' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-cyan-600' : 'text-gray-800'
                }`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map(apt => (
                    <div
                      key={apt.id}
                      className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded truncate"
                      title={`${apt.time} - ${apt.patient}`}
                    >
                      {apt.time} {apt.patient}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayAppointments.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="p-6 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Appointments</h3>
        <div className="space-y-3">
          {appointments
            .filter(apt => apt.date === new Date().toISOString().split('T')[0])
            .map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{apt.patient}</div>
                  <div className="text-sm text-gray-600">{apt.treatment}</div>
                </div>
                <div className="text-sm font-medium text-cyan-600">{apt.time}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;