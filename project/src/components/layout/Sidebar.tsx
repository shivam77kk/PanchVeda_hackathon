import React from 'react';
import { useApp } from '../../context/AppContext';
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

const Sidebar: React.FC = () => {
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

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex-shrink-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">PanchVeda</h1>
            <p className="text-sm text-gray-500">Doctor Portal</p>
          </div>
        </div>
      </div>

      <nav className="mt-6 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
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
  );
};

export default Sidebar;