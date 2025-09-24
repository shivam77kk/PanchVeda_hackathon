import React, { useState } from 'react';
import PatientPlanCard from './PatientPlanCard';
import PlanFilters from './PlanFilters';
import { mockPatientPlans } from '../../data/mockData';

const PatientPlansOverview: React.FC = () => {
  const [filteredPlans, setFilteredPlans] = useState(mockPatientPlans);

  const handleFilter = (searchTerm: string, status: string) => {
    let filtered = mockPatientPlans;
    
    if (searchTerm) {
      filtered = filtered.filter(plan => 
        plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.planTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (status !== 'all') {
      filtered = filtered.filter(plan => plan.status === status);
    }
    
    setFilteredPlans(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Patient Plans</h1>
        <div className="text-sm text-gray-500">
          {filteredPlans.length} active plans
        </div>
      </div>

      <PlanFilters onFilter={handleFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredPlans.map((plan) => (
          <PatientPlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No plans found</div>
          <div className="text-gray-500 text-sm">Try adjusting your search or filter criteria</div>
        </div>
      )}
    </div>
  );
};

export default PatientPlansOverview;