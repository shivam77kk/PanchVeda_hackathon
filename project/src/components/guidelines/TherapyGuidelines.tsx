import React, { useState } from 'react';
import { Book, Search, Plus, Filter } from 'lucide-react';
import GuidelineCard from './GuidelineCard';
import GuidelineForm from './GuidelineForm';
import GuidelineViewer from './GuidelineViewer';

const TherapyGuidelines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedGuideline, setSelectedGuideline] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'form' | 'view'>('list');

  const guidelines = [
    {
      id: 1,
      title: 'Abhyanga (Oil Massage) Protocol',
      category: 'Purvakarma',
      language: 'English',
      duration: '45 minutes',
      description: 'Complete guide for full body oil massage therapy including preparation, technique, and post-treatment care.',
      lastUpdated: '2024-01-15',
      downloads: 234
    },
    {
      id: 2,
      title: 'Virechana Preparation Guidelines',
      category: 'Pradhankarma',
      language: 'English',
      duration: '3-5 days',
      description: 'Detailed protocol for preparing patients for Virechana therapy including dietary restrictions and medications.',
      lastUpdated: '2024-01-10',
      downloads: 189
    },
    {
      id: 3,
      title: 'Basti Therapy Administration',
      category: 'Pradhankarma',
      language: 'Hindi',
      duration: '7-15 days',
      description: 'Comprehensive guide for administering various types of Basti treatments with safety protocols.',
      lastUpdated: '2024-01-08',
      downloads: 156
    }
  ];

  const categories = ['all', 'Purvakarma', 'Pradhankarma', 'Paschatkarma'];

  const filteredGuidelines = guidelines.filter(guideline => {
    const matchesSearch = guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guideline.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guideline.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNew = () => {
    setSelectedGuideline(null);
    setViewMode('form');
  };

  const handleEdit = (guideline: any) => {
    setSelectedGuideline(guideline);
    setViewMode('form');
  };

  const handleView = (guideline: any) => {
    setSelectedGuideline(guideline);
    setViewMode('view');
  };

  const handleSave = (guidelineData: any) => {
    // Handle save logic here
    setViewMode('list');
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedGuideline(null);
  };

  if (viewMode === 'form') {
    return (
      <div className="space-y-6">
        <GuidelineForm
          onSave={handleSave}
          onCancel={handleCancel}
          initialData={selectedGuideline}
        />
      </div>
    );
  }

  if (viewMode === 'view' && selectedGuideline) {
    return (
      <div className="space-y-6">
        <GuidelineViewer
          guideline={selectedGuideline}
          onClose={handleCancel}
          onEdit={() => handleEdit(selectedGuideline)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Book className="text-green-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Therapy Guidelines</h1>
        </div>
        <button onClick={handleCreateNew} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 w-full sm:w-auto justify-center">
          <Plus size={20} />
          <span>Add Guideline</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search guidelines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredGuidelines.map((guideline) => (
            <GuidelineCard 
              key={guideline.id} 
              guideline={guideline}
              onView={() => handleView(guideline)}
              onEdit={() => handleEdit(guideline)}
            />
          ))}
        </div>

        {filteredGuidelines.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Guidelines Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapyGuidelines;