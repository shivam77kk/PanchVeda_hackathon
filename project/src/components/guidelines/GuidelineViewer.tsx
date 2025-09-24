import React from 'react';
import { X, Download, Edit, Clock, Globe } from 'lucide-react';

interface GuidelineViewerProps {
  guideline: {
    id: number;
    title: string;
    category: string;
    language: string;
    duration: string;
    description: string;
    content: string;
    lastUpdated: string;
  };
  onClose: () => void;
  onEdit: () => void;
}

const GuidelineViewer: React.FC<GuidelineViewerProps> = ({ guideline, onClose, onEdit }) => {
  const categoryColors = {
    Purvakarma: 'bg-blue-100 text-blue-800',
    Pradhankarma: 'bg-green-100 text-green-800',
    Paschatkarma: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            categoryColors[guideline.category as keyof typeof categoryColors]
          }`}>
            {guideline.category}
          </span>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Globe size={14} />
              <span>{guideline.language}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{guideline.duration}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
          >
            <Edit size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
            <Download size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{guideline.title}</h1>
        <p className="text-gray-600 mb-6">{guideline.description}</p>
        
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {guideline.content || 'No content available for this guideline.'}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Last updated: {guideline.lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuidelineViewer;