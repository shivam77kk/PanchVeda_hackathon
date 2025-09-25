import React, { useState } from 'react';
import { X, User, Phone, Mail, Calendar, FileText, Pill, AlertTriangle } from 'lucide-react';

interface PatientDetailsModalProps {
  patient: any;
  onClose: () => void;
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'history', label: 'Medical History', icon: FileText },
    { id: 'treatments', label: 'Treatments', icon: Pill },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">Personal Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{patient.name}, {patient.age} years</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{patient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{patient.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Last visit: {patient.lastVisit}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-3">Current Status</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Status: </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Primary Condition: </span>
                    <span className="text-sm font-medium text-cyan-600">{patient.condition}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                Allergies
              </h4>
              <div className="flex flex-wrap gap-2">
                {patient.medicalHistory.allergies.map((allergy: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                <Pill className="h-4 w-4 mr-2 text-blue-500" />
                Current Medications
              </h4>
              <div className="space-y-2">
                {patient.medicalHistory.medications.map((medication: string, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-800">{medication}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                Medical Conditions
              </h4>
              <div className="space-y-2">
                {patient.medicalHistory.conditions.map((condition: string, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{condition}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'treatments':
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-800">Treatment History</h4>
            {patient.treatments.map((treatment: string, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-800">{treatment}</h5>
                  <span className="text-sm text-gray-500">Ongoing</span>
                </div>
                <p className="text-sm text-gray-600">
                  Treatment started on {patient.lastVisit}. Patient showing good progress.
                </p>
              </div>
            ))}
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h5 className="font-medium text-yellow-800 mb-2">Doctor's Notes</h5>
              <p className="text-sm text-yellow-700">{patient.medicalHistory.notes}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-800 mb-3">Add New Note</h4>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Enter your notes here..."
              />
              <button className="mt-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm">
                Add Note
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {patient.avatar}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{patient.name}</h2>
              <p className="text-gray-600">{patient.condition}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-cyan-50 text-cyan-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;