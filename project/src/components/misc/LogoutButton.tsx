import React from 'react';
import { LogOut } from 'lucide-react';

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <button
      onClick={handleLogout}
      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
      title="Logout"
    >
      <LogOut size={20} />
    </button>
  );
};

export default LogoutButton;