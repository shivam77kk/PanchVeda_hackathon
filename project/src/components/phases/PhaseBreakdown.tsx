import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Calendar, CheckCircle, Clock } from 'lucide-react';
import PhaseTimeline from './PhaseTimeline';
import PhaseProgressBar from './PhaseProgressBar';

interface PhaseBreakdownProps {
  patient: any;
}

const PhaseBreakdown: React.FC<PhaseBreakdownProps> = ({ patient }) => {
  const { setCurrentView } = useApp();
  const [activePhase, setActivePhase] = useState('purvakarma');

  const phases = [
    {
      id: 'purvakarma',
      name: 'Purvakarma',
      description: 'Preparatory procedures to prepare body for main treatments',
      duration: '5 days',
      progress: 100,
      status: 'completed',
      color: 'green'
    },
    {
      id: 'pradhankarma',
      name: 'Pradhankarma',
      description: 'Main panchakarma procedures for detoxification',
      duration: '7 days',
      progress: 60,
      status: 'active',
      color: 'blue'
    },
    {
      id: 'paschatkarma',
      name: 'Paschatkarma',
      description: 'Post-treatment rehabilitation and rejuvenation',
      duration: '9 days',
      progress: 0,
      status: 'upcoming',
      color: 'gray'
    }
  ];

  const currentPhase = phases.find(p => p.id === activePhase);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCurrentView('plans')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Phase Breakdown</h1>
          <p className="text-gray-600">{patient.patientName} - {patient.planTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Treatment Phases</h3>
            <div className="space-y-2">
              {phases.map((phase) => {
                const statusColors = {
                  completed: 'bg-green-50 border-green-200 text-green-800',
                  active: 'bg-blue-50 border-blue-200 text-blue-800',
                  upcoming: 'bg-gray-50 border-gray-200 text-gray-600'
                };

                return (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(phase.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                      activePhase === phase.id 
                        ? statusColors[phase.status as keyof typeof statusColors]
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{phase.name}</span>
                      {phase.status === 'completed' && (
                        <CheckCircle size={16} className="text-green-600" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{phase.duration}</div>
                    <PhaseProgressBar progress={phase.progress} color={phase.color} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{currentPhase?.name}</h2>
                <p className="text-gray-600 mt-1">{currentPhase?.description}</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-2xl font-bold text-green-600">{currentPhase?.progress}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>

            <PhaseTimeline phaseId={activePhase} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseBreakdown;