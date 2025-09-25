import React from 'react';
import { Clock, User, Phone, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface AppointmentsListProps {
  searchTerm: string;
  filterStatus: string;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ searchTerm, filterStatus }) => {
  const appointments = [
    {
      id: 1,
      patientName: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      treatment: 'Panchakarma Consultation',
      date: '2024-01-15',
      time: '09:00 AM',
      duration: '30 mins',
      status: 'scheduled',
      notes: 'Initial consultation for chronic back pain'
    },
    {
      id: 2,
      patientName: 'Priya Sharma',
      phone: '+91 87654 32109',
      treatment: 'Abhyanga Therapy',
      date: '2024-01-15',
      time: '10:30 AM',
      duration: '60 mins',
      status: 'in-progress',
      notes: 'Full body oil massage - Session 3 of 7'
    },
    {
      id: 3,
      patientName: 'Amit Patel',
      phone: '+91 76543 21098',
      treatment: 'Shirodhara Treatment',
      date: '2024-01-15',
      time: '12:00 PM',
      duration: '45 mins',
      status: 'completed',
      notes: 'Stress relief therapy - Final session'
    },
    {
      id: 4,
      patientName: 'Sunita Desai',
      phone: '+91 65432 10987',
      treatment: 'Follow-up Consultation',
      date: '2024-01-16',
      time: '02:00 PM',
      duration: '20 mins',
      status: 'scheduled',
      notes: 'Review progress after 2-week Panchakarma course'
    }
  ];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.treatment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-100 text-green-700', icon: CheckCircle };
      case 'in-progress':
        return { color: 'bg-blue-100 text-blue-700', icon: Clock };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-700', icon: XCircle };
      default:
        return { color: 'bg-yellow-100 text-yellow-700', icon: Clock };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          Appointments ({filteredAppointments.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {filteredAppointments.map((appointment) => {
          const statusConfig = getStatusConfig(appointment.status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {appointment.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {appointment.patientName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <StatusIcon className="inline h-3 w-3 mr-1" />
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-cyan-600">{appointment.treatment}</span>
                        <span>•</span>
                        <span>{appointment.date} at {appointment.time}</span>
                        <span>•</span>
                        <span>{appointment.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{appointment.phone}</span>
                      </div>
                      <p className="text-gray-700 mt-2">{appointment.notes}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-3">
                {appointment.status === 'scheduled' && (
                  <>
                    <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm">
                      Start Session
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Reschedule
                    </button>
                  </>
                )}
                
                {appointment.status === 'in-progress' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Complete Session
                  </button>
                )}
                
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No appointments found</p>
          <p className="text-sm">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;