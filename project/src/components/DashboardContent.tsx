import React from 'react';
import Dashboard from './Dashboard';
import Appointments from './appointments/Appointments';
import PatientRecords from './patient-records/PatientRecords';
import Inventory from './inventory/Inventory';
import AIAssistant from './ai-assistant/AIAssistant';
import DoctorDocuments from './documents/DoctorDocuments';
import DoctorProfile from './profile/DoctorProfile';

interface DashboardContentProps {
  currentView?: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ currentView = 'dashboard' }) => {
  const renderContent = () => {
    switch (currentView) {
      case 'appointments':
        return <Appointments />;
      case 'patient-history':
        return <PatientRecords />;
      case 'inventory':
        return <Inventory />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'documents':
        return <DoctorDocuments />;
      case 'profile':
        return <DoctorProfile />;
      default:
        return <Dashboard />;
    }
  };

  return renderContent();
};

export default DashboardContent;