import React, { useState } from 'react';
import { Users, Search, Plus, Filter } from 'lucide-react';
import PatientCard from './PatientCard';

const PatientsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const patients = [
    {
      id: 'P001',
      name: 'Ravi Kumar',
      email: 'ravi.kumar@email.com',
      phone: '+91 98765 43210',
      age: 32,
      gender: 'Male',
      status: 'active',
      currentPlan: 'Comprehensive Digestive Health Recovery',
      lastVisit: '2024-01-22',
      nextAppointment: '2024-01-25',
      avatar: ''
    },
    {
      id: 'P002',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43211',
      age: 28,
      gender: 'Female',
      status: 'active',
      currentPlan: 'Stress Management & Mental Wellness',
      lastVisit: '2024-01-21',
      nextAppointment: '2024-01-24',
      avatar: ''
    },
    {
      id: 'P003',
      name: 'Suresh Patel',
      email: 'suresh.patel@email.com',
      phone: '+91 98765 43212',
      age: 45,
      gender: 'Male',
      status: 'upcoming',
      currentPlan: 'Joint Pain Relief Protocol',
      lastVisit: null,
      nextAppointment: '2024-02-01',
      avatar: ''
    },
    {
      id: 'P004',
      name: 'Meera Reddy',
      email: 'meera.reddy@email.com',
      phone: '+91 98765 43213',
      age: 35,
      gender: 'Female',
      status: 'completed',
      currentPlan: 'Weight Management & Detox',
      lastVisit: '2023-12-21',
      nextAppointment: null,
      avatar: ''
    }
  ];

  const statusOptions = [
    { id: 'all', label: 'All Patients', count: patients.length },
    { id: 'active', label: 'Active', count: patients.filter(p => p.status === 'active').length },
    { id: 'upcoming', label: 'Upcoming', count: patients.filter(p => p.status === 'upcoming').length },
    { id: 'completed', label: 'Completed', count: patients.filter(p => p.status === 'completed').length }
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.currentPlan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Users className="text-green-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center">
          <Plus size={20} />
          <span>Add Patient</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status.id}
                onClick={() => setStatusFilter(status.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.label} ({status.count})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Patients Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsList;