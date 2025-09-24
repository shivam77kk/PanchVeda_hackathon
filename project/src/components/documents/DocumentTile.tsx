import React from 'react';
import { FileText, Image, Download, Trash2, Eye } from 'lucide-react';

interface DocumentTileProps {
  document: {
    id: number;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
    preview: string | null;
  };
}

const DocumentTile: React.FC<DocumentTileProps> = ({ document }) => {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return Image;
      default:
        return FileText;
    }
  };

  const FileIcon = getFileIcon(document.type);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
        {document.preview ? (
          <img 
            src={document.preview} 
            alt={document.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileIcon size={48} className="text-gray-400" />
        )}
        
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors">
            <Eye size={14} className="text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm truncate" title={document.name}>
          {document.name}
        </h3>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>{document.size}</span>
          <span>{document.uploadDate}</span>
        </div>
        
        <div className="flex space-x-1 mt-3">
          <button className="flex-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-100 transition-colors flex items-center justify-center space-x-1">
            <Download size={12} />
            <span>Download</span>
          </button>
          <button className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs hover:bg-red-100 transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentTile;