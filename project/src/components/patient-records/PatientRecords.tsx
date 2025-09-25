import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, User } from 'lucide-react';
import PatientCard from './PatientCard';
import PatientDetailsModal from './PatientDetailsModal';

const PatientRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const patients = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'rajesh@example.com',
      condition: 'Chronic Back Pain',
      lastVisit: '2024-01-15',
      status: 'active',
      treatments: ['Panchakarma', 'Abhyanga'],
      avatar: 'RK',
      medicalHistory: {
        allergies: ['None'],
        medications: ['Ashwagandha tablets'],
        conditions: ['Chronic back pain', 'Mild hypertension'],
        notes: 'Patient responds well to oil therapies'
      }
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: 38,
      gender: 'Female',
      phone: '+91 87654 32109',
      email: 'priya@example.com',
      condition: 'Anxiety & Insomnia',
      lastVisit: '2024-01-14',
      status: 'active',
      treatments: ['Shirodhara', 'Meditation'],
      avatar: 'PS',
      medicalHistory: {
        allergies: ['Peanuts'],
        medications: ['Brahmi capsules', 'Jatamansi powder'],
        conditions: ['Anxiety disorder', 'Chronic insomnia'],
        notes: 'Prefers evening appointments'
      }
    },
    {
      id: 3,
      name: 'Amit Patel',
      age: 52,
      gender: 'Male',
      phone: '+91 76543 21098',
      email: 'amit@example.com',
      condition: 'Digestive Issues',
      lastVisit: '2024-01-10',
      status: 'completed',
      treatments: ['Detox Program', 'Dietary Counseling'],
      avatar: 'AP',
      medicalHistory: {
        allergies: ['Dairy products'],
        medications: ['Triphala churna'],
        conditions: ['IBS', 'Acid reflux'],
        notes: 'Completed full detox program successfully'
      }
    }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
            <p className="text-gray-600">Manage patient medical history and records</p>
          </div>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Patient</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name or condition..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="all">All Patients</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onViewDetails={() => setSelectedPatient(patient)}
          />
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-600 mb-2">No patients found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
};

export default PatientRecords;