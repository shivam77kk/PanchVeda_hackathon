import React from 'react';
import ScheduleItem from './ScheduleItem';
import { Calendar } from 'lucide-react';

const TodaysSchedule: React.FC = () => {
  const scheduleData = [
    {
      id: 1,
      patientName: "Rajesh Kumar",
      treatment: "Panchakarma Consultation",
      time: "09:00 AM",
      duration: "30 mins",
      status: "scheduled",
      avatar: "RK",
      notes: "Initial consultation for chronic back pain"
    },
    {
      id: 2,
      patientName: "Priya Sharma",
      treatment: "Abhyanga Therapy",
      time: "10:30 AM",
      duration: "60 mins",
      status: "in-progress",
      avatar: "PS",
      notes: "Full body oil massage - Session 3 of 7"
    },
    {
      id: 3,
      patientName: "Amit Patel",
      treatment: "Shirodhara Treatment",
      time: "12:00 PM",
      duration: "45 mins",
      status: "completed",
      avatar: "AP",
      notes: "Stress relief therapy - Final session"
    },
    {
      id: 4,
      patientName: "Sunita Desai",
      treatment: "Follow-up Consultation",
      time: "02:00 PM",
      duration: "20 mins",
      status: "scheduled",
      avatar: "SD",
      notes: "Review progress after 2-week Panchakarma course"
    },
    {
      id: 5,
      patientName: "Vikram Singh",
      treatment: "Nasya Therapy",
      time: "03:30 PM",
      duration: "40 mins",
      status: "scheduled",
      avatar: "VS",
      notes: "Nasal administration for respiratory issues"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Calendar className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Today's Schedule</h2>
              <p className="text-gray-600 text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">3 Completed</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">2 Upcoming</span>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {scheduleData.map((item) => (
          <ScheduleItem key={item.id} {...item} />
        ))}
      </div>
      
      {scheduleData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No appointments scheduled</p>
          <p className="text-sm">Your schedule for today is clear.</p>
        </div>
      )}
    </div>
  );
};

export default TodaysSchedule;