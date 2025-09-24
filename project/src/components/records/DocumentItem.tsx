import React from 'react';
import { FileText, Download, Eye, Calendar } from 'lucide-react';

interface DocumentItemProps {
  document: {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
    category: string;
  };
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document }) => {
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'image':
        return '🖼️';
      case 'lab':
        return '🧪';
      default:
        return '📋';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{getFileIcon(document.type)}</div>
        <div>
          <h4 className="font-medium text-gray-900 text-sm">{document.name}</h4>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>{document.size}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Calendar size={10} />
              <span>{document.uploadDate}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
          <Eye size={16} />
        </button>
        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};

export default DocumentItem;