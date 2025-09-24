import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import LogoutButton from '../misc/LogoutButton';
import MobileSidebar from './MobileSidebar';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search patients, plans..."
              className="pl-10 pr-4 py-2 w-64 sm:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          <div className="hidden sm:flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">DR</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Dr. Rajesh Sharma</p>
              <p className="text-xs text-gray-500">Panchakarma Specialist</p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default Header;