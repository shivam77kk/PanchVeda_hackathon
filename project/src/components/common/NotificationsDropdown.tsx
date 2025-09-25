import React from 'react';
import { Bell, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';

interface NotificationsDropdownProps {
  onClose: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onClose }) => {
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Upcoming Appointment',
      message: 'Rajesh Kumar - Panchakarma in 30 minutes',
      time: '30 min ago',
      icon: Calendar,
      color: 'text-blue-600 bg-blue-100',
      unread: true
    },
    {
      id: 2,
      type: 'patient',
      title: 'New Patient Registration',
      message: 'Sunita Desai has registered for consultation',
      time: '2 hours ago',
      icon: User,
      color: 'text-green-600 bg-green-100',
      unread: true
    },
    {
      id: 3,
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'Sesame Oil running low (5 bottles left)',
      time: '4 hours ago',
      icon: AlertCircle,
      color: 'text-orange-600 bg-orange-100',
      unread: true
    },
    {
      id: 4,
      type: 'completed',
      title: 'Treatment Completed',
      message: 'Amit Patel completed Shirodhara session',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'text-cyan-600 bg-cyan-100',
      unread: false
    }
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          <button className="text-sm text-cyan-600 hover:text-cyan-700">
            Mark all read
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => {
          const IconComponent = notification.icon;
          return (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                notification.unread ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${notification.color}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-800">
                      {notification.title}
                    </h4>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-cyan-600 hover:text-cyan-700 font-medium">
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsDropdown;