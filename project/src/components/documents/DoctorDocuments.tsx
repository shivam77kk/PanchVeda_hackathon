import React, { useState } from 'react';
import { FileText, Upload, Search, Filter, Download, Eye, Trash2, Plus, Folder } from 'lucide-react';
import DocumentCard from './DocumentCard';
import UploadModal from './UploadModal';

const DoctorDocuments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const documents = [
    {
      id: 1,
      name: 'Treatment Protocol - Panchakarma.pdf',
      type: 'protocol',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      category: 'Treatment Protocols',
      tags: ['panchakarma', 'protocol', 'treatment'],
      description: 'Comprehensive guide for Panchakarma treatments'
    },
    {
      id: 2,
      name: 'Patient Consent Form.pdf',
      type: 'form',
      size: '156 KB',
      uploadDate: '2024-01-14',
      category: 'Forms',
      tags: ['consent', 'form', 'legal'],
      description: 'Standard patient consent form template'
    },
    {
      id: 3,
      name: 'Herb Identification Guide.pdf',
      type: 'reference',
      size: '8.7 MB',
      uploadDate: '2024-01-12',
      category: 'Reference Materials',
      tags: ['herbs', 'identification', 'reference'],
      description: 'Visual guide for identifying medicinal herbs'
    },
    {
      id: 4,
      name: 'Insurance Claims Template.xlsx',
      type: 'template',
      size: '45 KB',
      uploadDate: '2024-01-10',
      category: 'Administrative',
      tags: ['insurance', 'claims', 'template'],
      description: 'Template for processing insurance claims'
    },
    {
      id: 5,
      name: 'Patient History - Rajesh Kumar.pdf',
      type: 'patient',
      size: '1.2 MB',
      uploadDate: '2024-01-08',
      category: 'Patient Records',
      tags: ['patient', 'history', 'rajesh'],
      description: 'Complete medical history and treatment records'
    }
  ];

  const categories = ['all', 'Treatment Protocols', 'Forms', 'Reference Materials', 'Administrative', 'Patient Records'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || doc.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const getDocumentStats = () => {
    const total = documents.length;
    const totalSize = documents.reduce((sum, doc) => {
      const size = parseFloat(doc.size);
      const unit = doc.size.includes('MB') ? 1024 : 1;
      return sum + (size * unit);
    }, 0);
    
    return {
      total,
      totalSize: totalSize > 1024 ? `${(totalSize / 1024).toFixed(1)} MB` : `${totalSize.toFixed(0)} KB`,
      categories: [...new Set(documents.map(doc => doc.category))].length
    };
  };

  const stats = getDocumentStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Document Management</h1>
            <p className="text-gray-600">Organize and manage your medical documents</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Documents</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Storage Used</p>
                <p className="text-2xl font-bold text-green-700">{stats.totalSize}</p>
              </div>
              <Folder className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Categories</p>
                <p className="text-2xl font-bold text-purple-700">{stats.categories}</p>
              </div>
              <Filter className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-cyan-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-cyan-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Documents Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'space-y-4'
      }>
        {filteredDocuments.map((document) => (
          <DocumentCard key={document.id} document={document} viewMode={viewMode} />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-600 mb-2">No documents found</p>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} />
      )}
    </div>
  );
};

export default DoctorDocuments;