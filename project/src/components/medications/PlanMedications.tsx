import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Plus, Pill } from 'lucide-react';
import MedicationRow from './MedicationRow';

interface PlanMedicationsProps {
  patient: any;
}

const PlanMedications: React.FC<PlanMedicationsProps> = ({ patient }) => {
  const { setCurrentView } = useApp();

  const medications = [
    {
      id: 1,
      name: 'Triphala Churna',
      dosage: '1 tsp',
      frequency: 'Twice daily',
      duration: '21 days',
      instructions: 'Take with warm water before meals',
      status: 'active'
    },
    {
      id: 2,
      name: 'Abhayarishta',
      dosage: '20ml',
      frequency: 'After meals',
      duration: '14 days',
      instructions: 'Mix with equal amount of water',
      status: 'active'
    },
    {
      id: 3,
      name: 'Chyawanprash',
      dosage: '1 tbsp',
      frequency: 'Once daily',
      duration: '30 days',
      instructions: 'Take in the morning with warm milk',
      status: 'upcoming'
    }
  ];

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
            <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
            <p className="text-gray-600">{patient.patientName} - {patient.planTitle}</p>
          </div>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center">
          <Plus size={20} />
          <span>Add Medication</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Pill className="text-green-600" size={20} />
            <h2 className="font-semibold text-gray-900">Current Medications</h2>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medication
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosage
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medications.map((medication) => (
                <MedicationRow key={medication.id} medication={medication} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlanMedications;