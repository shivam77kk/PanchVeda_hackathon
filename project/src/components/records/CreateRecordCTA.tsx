import React from 'react';
import { Plus, FileText } from 'lucide-react';

const CreateRecordCTA: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText size={32} className="text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patient Record Found</h3>
      <p className="text-gray-600 mb-6">
        Create a comprehensive patient record to track medical history, vitals, and treatment progress.
      </p>
      <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto">
        <Plus size={20} />
        <span>Create Patient Record</span>
      </button>
    </div>
  );
};

export default CreateRecordCTA;