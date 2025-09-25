import React from 'react';
import StatCard from './dashboard/StatCard';
import TodaysSchedule from './dashboard/TodaysSchedule';
import PatientPlansOverview from './dashboard/PatientPlansOverview';
import { Calendar, Users, TrendingUp, FileCheck } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: "Today's Appointments",
      value: "4",
      subtitle: "3 completed",
      icon: Calendar,
      color: "cyan",
      progress: 75,
    },
    {
      title: "Active Patients",
      value: "28",
      subtitle: "12 new this month",
      icon: Users,
      color: "blue",
    },
    {
      title: "Success Rate",
      value: "94%",
      subtitle: "Patient satisfaction",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Pending Reviews",
      value: "7",
      subtitle: "Treatment plans",
      icon: FileCheck,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Schedule - Takes up 2/3 on large screens */}
        <div className="xl:col-span-2">
          <TodaysSchedule />
        </div>
        
        {/* Patient Plans Overview - Takes up 1/3 on large screens */}
        <div className="xl:col-span-1">
          <PatientPlansOverview />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;