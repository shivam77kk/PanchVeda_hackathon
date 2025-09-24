export const mockPatientPlans = [
  {
    id: 'P001',
    patientName: 'Ravi Kumar',
    patientEmail: 'ravi.kumar@email.com',
    patientAvatar: '',
    planTitle: 'Comprehensive Digestive Health Recovery',
    startDate: '2024-01-15',
    endDate: '2024-02-04',
    progress: 45,
    status: 'active',
    currentPhase: 'Pradhankarma - Day 7'
  },
  {
    id: 'P002',
    patientName: 'Priya Sharma',
    patientEmail: 'priya.sharma@email.com',
    patientAvatar: '',
    planTitle: 'Stress Management & Mental Wellness',
    startDate: '2024-01-20',
    endDate: '2024-02-10',
    progress: 30,
    status: 'active',
    currentPhase: 'Purvakarma - Day 5'
  },
  {
    id: 'P003',
    patientName: 'Suresh Patel',
    patientEmail: 'suresh.patel@email.com',
    patientAvatar: '',
    planTitle: 'Joint Pain Relief Protocol',
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    progress: 0,
    status: 'upcoming',
    currentPhase: 'Not started'
  },
  {
    id: 'P004',
    patientName: 'Meera Reddy',
    patientEmail: 'meera.reddy@email.com',
    patientAvatar: '',
    planTitle: 'Weight Management & Detox',
    startDate: '2023-12-01',
    endDate: '2023-12-21',
    progress: 100,
    status: 'completed',
    currentPhase: 'Treatment completed'
  }
];

export const mockDailySchedule = [
  {
    id: 'S001',
    time: '09:00 AM',
    therapy: 'Abhyanga (Full Body Oil Massage)',
    instructions: 'Use warm sesame oil. Focus on marma points. Duration: 45 minutes.',
    duration: '45 mins',
    completed: true
  },
  {
    id: 'S002',
    time: '11:00 AM',
    therapy: 'Swedana (Steam Therapy)',
    instructions: 'Use eucalyptus and neem leaves. Temperature: 40-45°C. Duration: 15 minutes.',
    duration: '15 mins',
    completed: true
  },
  {
    id: 'S003',
    time: '02:00 PM',
    therapy: 'Virechana Preparation',
    instructions: 'Administer prescribed purgative medicines with warm water. Monitor closely.',
    duration: '30 mins',
    completed: false
  },
  {
    id: 'S004',
    time: '04:00 PM',
    therapy: 'Diet Counseling',
    instructions: 'Review current diet chart. Adjust according to constitution and season.',
    duration: '20 mins',
    completed: false
  }
];

export const mockAppointments = [
  {
    id: 'A001',
    patientName: 'Ravi Kumar',
    time: '09:00 AM',
    duration: '30 mins',
    status: 'scheduled',
    type: 'consultation',
    notes: 'Follow-up for ongoing Panchakarma treatment. Check vitals and progress.'
  },
  {
    id: 'A002',
    patientName: 'Priya Sharma',
    time: '10:30 AM',
    duration: '45 mins',
    status: 'in-progress',
    type: 'follow-up',
    notes: 'Initial assessment for stress management protocol.'
  },
  {
    id: 'A003',
    patientName: 'Suresh Patel',
    time: '02:00 PM',
    duration: '60 mins',
    status: 'scheduled',
    type: 'consultation',
    notes: 'New patient consultation for joint pain management.'
  }
];