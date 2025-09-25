import React, { useState } from 'react';
import { Bot, Send, Lightbulb, TrendingUp, Users, Calendar } from 'lucide-react';
import ChatInterface from './ChatInterface';
import RecommendationCard from './RecommendationCard';

const AIAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const recommendations = [
    {
      id: 1,
      type: 'treatment',
      title: 'Optimize Panchakarma Schedule',
      description: 'Based on patient data, consider scheduling Abhyanga sessions in the morning for better oil absorption.',
      priority: 'high',
      impact: 'Patient satisfaction could increase by 15%',
      action: 'Review morning slots'
    },
    {
      id: 2,
      type: 'inventory',
      title: 'Restock Sesame Oil',
      description: 'Current stock is running low. Historical data shows increased demand in winter months.',
      priority: 'medium',
      impact: 'Avoid treatment delays',
      action: 'Order 20 bottles'
    },
    {
      id: 3,
      type: 'patient',
      title: 'Follow-up Reminder',
      description: 'Amit Patel completed detox program 2 weeks ago. Schedule follow-up consultation.',
      priority: 'low',
      impact: 'Maintain patient engagement',
      action: 'Schedule appointment'
    }
  ];

  const insights = [
    {
      icon: TrendingUp,
      title: 'Treatment Success Rate',
      value: '94%',
      trend: '+5% from last month',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Users,
      title: 'Patient Retention',
      value: '87%',
      trend: '+2% from last month',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Calendar,
      title: 'Appointment Efficiency',
      value: '92%',
      trend: 'Stable',
      color: 'text-cyan-600 bg-cyan-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Assistant</h1>
              <p className="text-gray-600">Get intelligent insights and recommendations</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'chat'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>Chat Assistant</span>
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Lightbulb className="h-4 w-4" />
            <span>Recommendations</span>
          </button>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${insight.color}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{insight.title}</h3>
              <div className="text-2xl font-bold text-gray-800 mb-1">{insight.value}</div>
              <p className="text-sm text-gray-500">{insight.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      {activeTab === 'chat' ? (
        <ChatInterface />
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">AI Recommendations</h2>
            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;