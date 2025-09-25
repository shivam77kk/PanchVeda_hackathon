import React from 'react';
import { Search, Filter } from 'lucide-react';

interface PlanFiltersProps {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const PlanFilters: React.FC<PlanFiltersProps> = ({
  filterStatus,
  setFilterStatus,
  searchTerm,
  setSearchTerm
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Patients', count: 12 },
    { value: 'active', label: 'Active', count: 8 },
    { value: 'upcoming', label: 'Upcoming', count: 3 },
    { value: 'completed', label: 'Completed', count: 1 },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients or conditions..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Status Filters */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <div className="flex space-x-2 overflow-x-auto">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterStatus(option.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterStatus === option.value
                  ? 'bg-cyan-100 text-cyan-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanFilters;