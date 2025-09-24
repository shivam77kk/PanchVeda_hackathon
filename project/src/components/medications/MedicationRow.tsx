import React from 'react';
import { Edit, Trash2, Info } from 'lucide-react';

interface MedicationRowProps {
  medication: {
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    status: string;
  };
}

const MedicationRow: React.FC<MedicationRowProps> = ({ medication }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    upcoming: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-800',
    discontinued: 'bg-red-100 text-red-800'
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 sm:px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-900">{medication.name}</div>
          <div className="text-sm text-gray-500 hidden sm:block" title={medication.instructions}>
            <Info size={12} className="inline mr-1" />
            {medication.instructions.substring(0, 30)}...
          </div>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {medication.dosage}
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {medication.frequency}
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {medication.duration}
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          statusColors[medication.status as keyof typeof statusColors]
        }`}>
          {medication.status}
        </span>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button className="text-green-600 hover:text-green-900 transition-colors">
            <Edit size={16} />
          </button>
          <button className="text-red-600 hover:text-red-900 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default MedicationRow;