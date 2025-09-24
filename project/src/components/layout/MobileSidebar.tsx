import React from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';
import { 
  Calendar, 
  Users, 
  FileText, 
  Brain, 
  Newspaper, 
  ClipboardList,
  User,
  Book,
  FileCheck
} from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { currentView, setCurrentView } = useApp();

  const menuItems = [
    { id: 'plans', icon: ClipboardList, label: 'Patient Plans' },
    { id: 'patients', icon: Users, label: 'Patients' },
    { id: 'appointments', icon: Calendar, label: 'Appointments' },
    { id: 'guidelines', icon: Book, label: 'Guidelines' },
    { id: 'consents', icon: FileCheck, label: 'Consents' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'ai-assistant', icon: Brain, label: 'AI Assistant' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'news', icon: Newspaper, label: 'News' }
  ];

  const handleItemClick = (itemId: string) => {
    setCurrentView(itemId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PanchVeda</h1>
                <p className="text-sm text-gray-500">Doctor Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="mt-6 px-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 mb-1 ${
                  currentView === item.id
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;