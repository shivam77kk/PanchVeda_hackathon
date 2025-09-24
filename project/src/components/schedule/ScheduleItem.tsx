import React from 'react';
import { Clock, CheckCircle, Circle } from 'lucide-react';

interface ScheduleItemProps {
  item: {
    id: string;
    time: string;
    therapy: string;
    instructions: string;
    duration: string;
    completed: boolean;
  };
  onComplete: (id: string) => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ item, onComplete }) => {
  return (
    <div className={`border rounded-lg p-4 transition-all duration-300 ${
      item.completed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-white border-gray-200 hover:border-green-300'
    }`}>
      <div className="flex items-start space-x-4">
        <button
          onClick={() => onComplete(item.id)}
          className="mt-1 text-green-600 hover:text-green-700 transition-colors"
        >
          {item.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
        </button>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {item.time}
            </div>
            <div className="flex items-center space-x-1 text-gray-500 text-sm">
              <Clock size={14} />
              <span>{item.duration}</span>
            </div>
          </div>
          
          <h3 className={`font-semibold mb-2 ${
            item.completed ? 'text-green-800' : 'text-gray-900'
          }`}>
            {item.therapy}
          </h3>
          
          <p className={`text-sm ${
            item.completed ? 'text-green-700' : 'text-gray-600'
          }`}>
            {item.instructions}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleItem;