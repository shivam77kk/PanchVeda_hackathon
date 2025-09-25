import React, { useState } from 'react';
import PatientPlanCard from './PatientPlanCard';
import PlanFilters from './PlanFilters';
import { Users, Plus } from 'lucide-react';

const PatientPlansOverview: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const patientsData = [
    {
      id: 1,
      name: "Rajesh Kumar",
      age: 45,
      plan: "Complete Panchakarma",
      progress: 40,
      status: "active",
      sessionsCompleted: 6,
      totalSessions: 15,
      nextSession: "Tomorrow, 9:00 AM",
      condition: "Chronic Back Pain",
      avatar: "RK"
    },
    {
      id: 2,
      name: "Priya Sharma",
      age: 38,
      plan: "Stress Relief Package",
      progress: 75,
      status: "active",
      sessionsCompleted: 9,
      totalSessions: 12,
      nextSession: "Friday, 2:00 PM",
      condition: "Anxiety & Insomnia",
      avatar: "PS"
    },
    {
      id: 3,
      name: "Amit Patel",
      age: 52,
      plan: "Detox Program",
      progress: 100,
      status: "completed",
      sessionsCompleted: 10,
      totalSessions: 10,
      nextSession: "Follow-up scheduled",
      condition: "Digestive Issues",
      avatar: "AP"
    },
    {
      id: 4,
      name: "Sunita Desai",
      age: 41,
      plan: "Weight Management",
      progress: 20,
      status: "upcoming",
      sessionsCompleted: 0,
      totalSessions: 20,
      nextSession: "Next Monday, 10:00 AM",
      condition: "Obesity",
      avatar: "SD"
    }
  ];

  const filteredPatients = patientsData.filter(patient => {
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Patient Plans</h2>
              <p className="text-gray-600 text-sm">{filteredPatients.length} patients</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Plan</span>
          </button>
        </div>
        
        <PlanFilters 
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-4 p-6">
          {filteredPatients.map((patient) => (
            <PatientPlanCard key={patient.id} {...patient} />
          ))}
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No patients found</p>
              <p className="text-sm">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientPlansOverview;