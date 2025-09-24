import React from 'react';
import { Eye, Share2, Edit, Copy, Globe, Users } from 'lucide-react';

interface ConsentCardProps {
  template: {
    id: number;
    title: string;
    description: string;
    category: string;
    language: string;
    lastUpdated: string;
    isActive: boolean;
    usageCount: number;
  };
}

const ConsentCard: React.FC<ConsentCardProps> = ({ template }) => {
  const categoryColors = {
    Treatment: 'bg-green-100 text-green-800',
    Pradhankarma: 'bg-blue-100 text-blue-800',
    Documentation: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          categoryColors[template.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
        }`}>
          {template.category}
        </span>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Globe size={12} />
            <span>{template.language}</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${
            template.isActive ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {template.title}
      </h3>

      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {template.description}
      </p>

      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <Users size={12} />
          <span>{template.usageCount} uses</span>
        </div>
        <span>•</span>
        <span>Updated {template.lastUpdated}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center space-x-1">
          <Eye size={14} />
          <span>Preview</span>
        </button>
        <button className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1">
          <Share2 size={14} />
          <span>Share</span>
        </button>
        <button className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1">
          <Edit size={14} />
          <span>Edit</span>
        </button>
        <button className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1">
          <Copy size={14} />
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
};

export default ConsentCard;