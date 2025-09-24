import React from 'react';
import { Download, Eye, Edit, Clock, Globe } from 'lucide-react';

interface GuidelineCardProps {
  guideline: {
    id: number;
    title: string;
    category: string;
    language: string;
    duration: string;
    description: string;
    lastUpdated: string;
    downloads: number;
  };
  onView?: () => void;
  onEdit?: () => void;
}

const GuidelineCard: React.FC<GuidelineCardProps> = ({ guideline, onView, onEdit }) => {
  const categoryColors = {
    Purvakarma: 'bg-blue-100 text-blue-800',
    Pradhankarma: 'bg-green-100 text-green-800',
    Paschatkarma: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          categoryColors[guideline.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'
        }`}>
          {guideline.category}
        </span>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Globe size={12} />
          <span>{guideline.language}</span>
        </div>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {guideline.title}
      </h3>

      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {guideline.description}
      </p>

      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <Clock size={12} />
          <span>{guideline.duration}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Download size={12} />
          <span>{guideline.downloads} downloads</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button 
          onClick={onView}
          className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center space-x-1"
        >
          <Eye size={14} />
          <span>View</span>
        </button>
        <button 
          onClick={onEdit}
          className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Edit size={14} />
        </button>
        <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <Download size={14} />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Last updated: {guideline.lastUpdated}
        </p>
      </div>
    </div>
  );
};

export default GuidelineCard;