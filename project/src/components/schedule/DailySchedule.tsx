import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ScheduleItem from './ScheduleItem';
import EmptyState from './EmptyState';
import { mockDailySchedule } from '../../data/mockData';

interface DailyScheduleProps {
  patient: any;
}

const DailySchedule: React.FC<DailyScheduleProps> = ({ patient }) => {
  const { setCurrentView } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedule, setSchedule] = useState(mockDailySchedule);

  const handleCompleteItem = (id: string) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedCount = schedule.filter(item => item.completed).length;
  const progressPercentage = schedule.length > 0 ? (completedCount / schedule.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView('plans')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Schedule</h1>
            <p className="text-gray-600">{patient.patientName} - {patient.planTitle}</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-500">Progress Today</p>
          <p className="text-2xl font-bold text-green-600">{Math.round(progressPercentage)}%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="text-green-600" size={20} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="text-sm text-gray-500">
            {completedCount} of {schedule.length} completed
          </div>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {schedule.length > 0 ? (
          <div className="space-y-4">
            {schedule.map((item) => (
              <ScheduleItem 
                key={item.id} 
                item={item} 
                onComplete={handleCompleteItem}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default DailySchedule;