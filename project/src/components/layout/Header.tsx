import React, { useState } from 'react';
import { Bell, Search, Settings, User, Menu, Stethoscope, LogOut, ChevronDown } from 'lucide-react';
import SearchModal from '../common/SearchModal';
import NotificationsDropdown from '../common/NotificationsDropdown';
import SettingsModal from '../common/SettingsModal';

interface HeaderProps {
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: string) => void;
}

export default function Header({ 
  onSearchClick, 
  onNotificationsClick, 
  onSettingsClick, 
  onProfileClick,
  setSidebarOpen,
  setCurrentView
}: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      // In a real app, this would clear authentication tokens and redirect
      alert('Signing out... (In a real app, this would redirect to login)');
      // window.location.href = '/login';
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">PanchVeda</h1>
                <p className="text-sm text-teal-100">Dr. Atharva Yesji</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-colors"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-colors relative"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"></span>
              </button>
              {showNotifications && (
                <NotificationsDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            
            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 text-white hover:text-gray-200 hover:bg-white/10 rounded-lg transition-colors"
                title="Profile Menu"
              >
                <User className="h-5 w-5" />
                <ChevronDown className="h-4 w-4 hidden sm:block" />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="font-medium text-gray-800">Dr. Demo User</p>
                    <p className="text-sm text-gray-600">demo@panchveda.com</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setCurrentView('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowSettings(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}