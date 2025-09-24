import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface PhaseTimelineProps {
  phaseId: string;
}

const PhaseTimeline: React.FC<PhaseTimelineProps> = ({ phaseId }) => {
  const timelineData = {
    purvakarma: [
      { day: 1, date: '2024-01-15', therapy: 'Consultation & Assessment', completed: true },
      { day: 2, date: '2024-01-16', therapy: 'Snehapana (Internal Oleation)', completed: true },
      { day: 3, date: '2024-01-17', therapy: 'Abhyanga (Oil Massage)', completed: true },
      { day: 4, date: '2024-01-18', therapy: 'Swedana (Steam Therapy)', completed: true },
      { day: 5, date: '2024-01-19', therapy: 'Preparation Assessment', completed: true }
    ],
    pradhankarma: [
      { day: 6, date: '2024-01-20', therapy: 'Virechana Preparation', completed: true },
      { day: 7, date: '2024-01-21', therapy: 'Virechana (Purgation)', completed: true },
      { day: 8, date: '2024-01-22', therapy: 'Recovery & Monitoring', completed: true },
      { day: 9, date: '2024-01-23', therapy: 'Basti Preparation', completed: true },
      { day: 10, date: '2024-01-24', therapy: 'Niruha Basti', completed: false },
      { day: 11, date: '2024-01-25', therapy: 'Anuvasana Basti', completed: false },
      { day: 12, date: '2024-01-26', therapy: 'Assessment & Adjustment', completed: false }
    ],
    paschatkarma: [
      { day: 13, date: '2024-01-27', therapy: 'Rasayana (Rejuvenation)', completed: false },
      { day: 14, date: '2024-01-28', therapy: 'Dietary Rehabilitation', completed: false },
      { day: 15, date: '2024-01-29', therapy: 'Lifestyle Counseling', completed: false },
      { day: 16, date: '2024-01-30', therapy: 'Yoga & Meditation', completed: false },
      { day: 17, date: '2024-01-31', therapy: 'Progress Assessment', completed: false },
      { day: 18, date: '2024-02-01', therapy: 'Home Care Instructions', completed: false },
      { day: 19, date: '2024-02-02', therapy: 'Follow-up Planning', completed: false },
      { day: 20, date: '2024-02-03', therapy: 'Final Assessment', completed: false },
      { day: 21, date: '2024-02-04', therapy: 'Discharge Planning', completed: false }
    ]
  };

  const timeline = timelineData[phaseId as keyof typeof timelineData] || [];

  return (
    <div className="space-y-4">
      {timeline.map((item, index) => (
        <div key={index} className="flex items-start space-x-4">
          <div className="flex items-center justify-center mt-1">
            {item.completed ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <Circle size={20} className="text-gray-300" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.completed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  Day {item.day}
                </span>
                <span className="text-sm text-gray-500">{item.date}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <Clock size={14} />
                <span className="text-xs">2 hours</span>
              </div>
            </div>
            
            <h3 className={`font-medium ${
              item.completed ? 'text-gray-900' : 'text-gray-600'
            }`}>
              {item.therapy}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhaseTimeline;