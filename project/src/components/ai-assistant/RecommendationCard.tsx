import React from 'react';
import { AlertCircle, TrendingUp, Package, User, CheckCircle, X } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: any;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'treatment':
        return {
          icon: TrendingUp,
          color: 'text-blue-600 bg-blue-100',
          borderColor: 'border-blue-200'
        };
      case 'inventory':
        return {
          icon: Package,
          color: 'text-orange-600 bg-orange-100',
          borderColor: 'border-orange-200'
        };
      case 'patient':
        return {
          icon: User,
          color: 'text-green-600 bg-green-100',
          borderColor: 'border-green-200'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600 bg-gray-100',
          borderColor: 'border-gray-200'
        };
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const typeConfig = getTypeConfig(recommendation.type);
  const TypeIcon = typeConfig.icon;

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${typeConfig.borderColor}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${typeConfig.color}`}>
            <TypeIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{recommendation.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityConfig(recommendation.priority)}`}>
              {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)} Priority
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-3">{recommendation.description}</p>

      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="h-4 w-4 text-cyan-600" />
          <span className="text-sm font-medium text-gray-800">Expected Impact</span>
        </div>
        <p className="text-sm text-gray-600">{recommendation.impact}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Suggested Action:</span>
          <span className="text-sm text-cyan-600 font-medium">{recommendation.action}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Accept">
            <CheckCircle className="h-4 w-4" />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;