import React from 'react';
import { useApp } from '../../context/AppContext';
import PatientPlansOverview from '../plans/PatientPlansOverview';
import PatientsList from '../patients/PatientsList';
import Appointments from '../appointments/Appointments';
import TherapyGuidelines from '../guidelines/TherapyGuidelines';
import ConsentLibrary from '../consents/ConsentLibrary';
import DoctorDocuments from '../documents/DoctorDocuments';
import AIRecommendPlan from '../ai/AIRecommendPlan';
import DoctorProfile from '../profile/DoctorProfile';
import NewsFeed from '../misc/NewsFeed';
import DailySchedule from '../schedule/DailySchedule';
import PatientRecordViewer from '../records/PatientRecordViewer';
import PhaseBreakdown from '../phases/PhaseBreakdown';
import PlanMedications from '../medications/PlanMedications';

const MainContent: React.FC = () => {
  const { currentView, selectedPatient } = useApp();

  const renderContent = () => {
    if (selectedPatient && currentView === 'daily-schedule') {
      return <DailySchedule patient={selectedPatient} />;
    }

    if (selectedPatient && currentView === 'patient-record') {
      return <PatientRecordViewer patient={selectedPatient} />;
    }

    if (selectedPatient && currentView === 'phases') {
      return <PhaseBreakdown patient={selectedPatient} />;
    }

    if (selectedPatient && currentView === 'medications') {
      return <PlanMedications patient={selectedPatient} />;
    }

    switch (currentView) {
      case 'plans':
        return <PatientPlansOverview />;
      case 'patients':
        return <PatientsList />;
      case 'appointments':
        return <Appointments />;
      case 'guidelines':
        return <TherapyGuidelines />;
      case 'consents':
        return <ConsentLibrary />;
      case 'documents':
        return <DoctorDocuments />;
      case 'ai-assistant':
        return <AIRecommendPlan />;
      case 'profile':
        return <DoctorProfile />;
      case 'news':
        return <NewsFeed />;
      default:
        return <PatientPlansOverview />;
    }
  };

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6">
      {renderContent()}
    </main>
  );
};

export default MainContent;