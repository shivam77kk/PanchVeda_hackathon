import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface PlanFiltersProps {
  onFilter: (searchTerm: string, status: string) => void;
}

const PlanFilters: React.FC<PlanFiltersProps> = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const statuses = [
    { id: 'all', label: 'All Plans', count: 12 },
    { id: 'active', label: 'Active', count: 8 },
    { id: 'upcoming', label: 'Upcoming', count: 3 },
    { id: 'completed', label: 'Completed', count: 1 }
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onFilter(term, selectedStatus);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    onFilter(searchTerm, status);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by patient name or plan title..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        {statuses.map((status) => (
          <button
            key={status.id}
            onClick={() => handleStatusFilter(status.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
              selectedStatus === status.id
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.label} ({status.count})
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlanFilters;