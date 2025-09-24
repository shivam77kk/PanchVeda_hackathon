import React from 'react';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';

const AIOutcomePrediction: React.FC = () => {
  const predictions = [
    {
      metric: "Recovery Success",
      probability: 89,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      metric: "Patient Compliance",
      probability: 76,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      metric: "Side Effects Risk",
      probability: 15,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  const insights = [
    "Patient shows high compatibility with Panchakarma treatments",
    "Constitutional analysis suggests good response to oil-based therapies",
    "Recommend close monitoring during Virechana phase"
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="text-green-600" size={20} />
          <h3 className="font-semibold text-gray-900">Outcome Predictions</h3>
        </div>

        <div className="space-y-4">
          {predictions.map((pred, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{pred.metric}</span>
                <span className={`text-sm font-bold ${pred.color}`}>{pred.probability}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${pred.bgColor.replace('bg-', 'bg-')} ${pred.color.replace('text-', 'bg-').replace('600', '500')}`}
                  style={{ width: `${pred.probability}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900">AI Insights</h3>
        </div>

        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2">
              <AlertCircle className="text-blue-500 mt-0.5" size={14} />
              <p className="text-sm text-gray-600">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 p-6">
        <h4 className="font-medium text-gray-900 mb-2">AI Recommendation Score</h4>
        <div className="flex items-center space-x-3">
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3"
                strokeDasharray="89, 100"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-purple-600">89</span>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-900">Excellent Match</p>
            <p className="text-sm text-gray-600">High confidence in treatment success</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIOutcomePrediction;