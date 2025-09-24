import React from 'react';
import { Calendar } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedule Today</h3>
      <p className="text-gray-500 mb-6">
        There are no therapy sessions scheduled for this date.
      </p>
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
        Add Session
      </button>
    </div>
  );
};

export default EmptyState;