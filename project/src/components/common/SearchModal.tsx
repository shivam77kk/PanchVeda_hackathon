import React, { useState } from 'react';
import { Search, X, User, Calendar, FileText, Package } from 'lucide-react';

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = [
    { type: 'patient', name: 'Rajesh Kumar', subtitle: 'Active Patient - Panchakarma', icon: User },
    { type: 'appointment', name: 'Today 2:00 PM', subtitle: 'Priya Sharma - Abhyanga', icon: Calendar },
    { type: 'document', name: 'Treatment Protocol.pdf', subtitle: 'Updated 2 days ago', icon: FileText },
    { type: 'inventory', name: 'Sesame Oil', subtitle: '15 bottles remaining', icon: Package },
  ].filter(item => 
    searchTerm === '' || 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Search className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, appointments, documents..."
              className="flex-1 text-lg outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-4 space-y-2">
              {searchResults.map((result, index) => {
                const IconComponent = result.icon;
                return (
                  <button
                    key={index}
                    className="w-full flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    onClick={onClose}
                  >
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <IconComponent className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{result.name}</h3>
                      <p className="text-sm text-gray-600">{result.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : searchTerm ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No results found for "{searchTerm}"</p>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Start typing to search...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;