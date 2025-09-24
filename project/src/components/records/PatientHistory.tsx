import React from 'react';
import { User, Phone, Mail, Calendar } from 'lucide-react';

interface PatientHistoryProps {
  patient: any;
}

const PatientHistory: React.FC<PatientHistoryProps> = ({ patient }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <User size={32} className="text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{patient.patientName}</h2>
        <p className="text-sm text-gray-500">Patient ID: #P{patient.id}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Mail size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{patient.patientEmail}</span>
        </div>
        <div className="flex items-center space-x-3">
          <Phone size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">+91 98765 43210</span>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">Age: 32 years</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="font-medium text-gray-900 mb-3">Current Plan</h3>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-sm font-medium text-green-800">{patient.planTitle}</p>
          <p className="text-xs text-green-600 mt-1">Day 7 of 21</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="font-medium text-gray-900 mb-3">Documents</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Medical History</span>
            <button className="text-green-600 hover:text-green-700">View</button>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Lab Reports</span>
            <button className="text-green-600 hover:text-green-700">View</button>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Consent Forms</span>
            <button className="text-green-600 hover:text-green-700">View</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;