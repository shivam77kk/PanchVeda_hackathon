import React, { useState } from 'react';
import { FileCheck, Search, Plus } from 'lucide-react';
import ConsentCard from './ConsentCard';

const ConsentLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const consentTemplates = [
    {
      id: 1,
      title: 'Panchakarma Treatment Consent',
      description: 'Comprehensive consent form for all Panchakarma therapies including risks, benefits, and patient responsibilities.',
      category: 'Treatment',
      language: 'English',
      lastUpdated: '2024-01-15',
      isActive: true,
      usageCount: 156
    },
    {
      id: 2,
      title: 'Virechana Therapy Consent',
      description: 'Specific consent form for Virechana (purgation) therapy with detailed procedure explanation.',
      category: 'Pradhankarma',
      language: 'Hindi',
      lastUpdated: '2024-01-10',
      isActive: true,
      usageCount: 89
    },
    {
      id: 3,
      title: 'Photography & Documentation Consent',
      description: 'Permission form for taking photographs and documenting treatment progress for medical records.',
      category: 'Documentation',
      language: 'English',
      lastUpdated: '2024-01-08',
      isActive: false,
      usageCount: 234
    }
  ];

  const filteredTemplates = consentTemplates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <FileCheck className="text-green-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Consent Library</h1>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center">
          <Plus size={20} />
          <span>Create Template</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search consent templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <ConsentCard key={template.id} template={template} />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentLibrary;