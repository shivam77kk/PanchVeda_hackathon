import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, FileText, Activity, History } from 'lucide-react';
import PatientHistory from './PatientHistory';

interface PatientRecordViewerProps {
  patient: any;
}

const PatientRecordViewer: React.FC<PatientRecordViewerProps> = ({ patient }) => {
  const { setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState('vitals');

  const tabs = [
    { id: 'vitals', label: 'Vitals', icon: Activity },
    { id: 'history', label: 'History', icon: History },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Patient Record</h1>
          <p className="text-gray-600">{patient.patientName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <PatientHistory patient={patient} />
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="border-b border-gray-100">
              <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-green-600 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon size={16} className="inline mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === 'vitals' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Blood Pressure</h3>
                    <div className="text-2xl font-bold text-green-600">120/80</div>
                    <div className="text-sm text-gray-500">Normal</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Heart Rate</h3>
                    <div className="text-2xl font-bold text-green-600">72 bpm</div>
                    <div className="text-sm text-gray-500">Normal</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Weight</h3>
                    <div className="text-2xl font-bold text-green-600">68 kg</div>
                    <div className="text-sm text-gray-500">Stable</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">BMI</h3>
                    <div className="text-2xl font-bold text-green-600">22.5</div>
                    <div className="text-sm text-gray-500">Normal</div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-2">
                      <h3 className="font-medium text-gray-900">Previous Treatment</h3>
                      <span className="text-sm text-gray-500">2023-10-15</span>
                    </div>
                    <p className="text-gray-600">21-day Panchakarma therapy completed successfully. Patient showed significant improvement in digestive health.</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-2">
                      <h3 className="font-medium text-gray-900">Consultation</h3>
                      <span className="text-sm text-gray-500">2023-09-20</span>
                    </div>
                    <p className="text-gray-600">Initial assessment for chronic digestive issues. Recommended Panchakarma therapy.</p>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-32 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Add your notes about the patient..."
                  ></textarea>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Save Notes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecordViewer;