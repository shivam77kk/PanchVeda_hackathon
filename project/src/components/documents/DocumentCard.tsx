import React from 'react';
import { FileText, Download, Eye, Trash2, Calendar, Tag } from 'lucide-react';

interface DocumentCardProps {
  document: any;
  viewMode: 'grid' | 'list';
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, viewMode }) => {
  const getFileIcon = (type: string) => {
    // In a real app, you'd have different icons for different file types
    return FileText;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'protocol':
        return 'bg-blue-100 text-blue-700';
      case 'form':
        return 'bg-green-100 text-green-700';
      case 'reference':
        return 'bg-purple-100 text-purple-700';
      case 'template':
        return 'bg-orange-100 text-orange-700';
      case 'patient':
        return 'bg-cyan-100 text-cyan-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const FileIcon = getFileIcon(document.type);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 hover:shadow-lg transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <FileIcon className="h-6 w-6 text-cyan-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{document.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span>{document.category}</span>
                <span>•</span>
                <span>{document.size}</span>
                <span>•</span>
                <span>{document.uploadDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(document.type)}`}>
              {document.type}
            </span>
            <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-cyan-100 rounded-lg">
          <FileIcon className="h-8 w-8 text-cyan-600" />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(document.type)}`}>
          {document.type}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{document.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{document.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{document.uploadDate}</span>
          </div>
          <span>•</span>
          <span>{document.size}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-1 mb-2">
          <Tag className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">Tags:</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {document.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
        <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors text-sm">
          <Eye className="h-4 w-4" />
          <span>View</span>
        </button>
        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
          <Download className="h-4 w-4" />
        </button>
        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;