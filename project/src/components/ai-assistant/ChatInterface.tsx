import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you with treatment recommendations, patient insights, inventory management, and scheduling optimization. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputMessage('');
  };

  const getAIResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('patient') || lowerMessage.includes('treatment')) {
      return 'Based on your patient data, I recommend focusing on personalized treatment plans. Rajesh Kumar would benefit from extended Abhyanga sessions due to his chronic back pain. Would you like me to suggest an optimized treatment schedule?';
    } else if (lowerMessage.includes('inventory') || lowerMessage.includes('stock')) {
      return 'Your inventory analysis shows that Sesame Oil and Ashwagandha Powder need restocking. I recommend ordering 20 bottles of Sesame Oil and 5kg of Ashwagandha Powder based on your usage patterns. Shall I prepare a purchase order?';
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('appointment')) {
      return 'Your appointment schedule shows 92% efficiency. I notice gaps on Tuesday afternoons that could be optimized. Consider offering promotional rates for off-peak hours to increase utilization. Would you like specific time slot recommendations?';
    } else {
      return 'I understand you\'re looking for assistance. I can help with treatment recommendations, patient management, inventory optimization, and scheduling. Could you please specify what area you\'d like help with?';
    }
  };

  const quickActions = [
    'Analyze patient trends',
    'Check inventory status',
    'Optimize schedule',
    'Treatment recommendations'
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">PanchVeda AI Assistant</h3>
            <p className="text-sm text-green-600">● Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`p-2 rounded-lg ${
              message.type === 'user' 
                ? 'bg-cyan-500' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}>
              {message.type === 'user' ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <Bot className="h-4 w-4 text-white" />
              )}
            </div>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user'
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.type === 'user' ? 'text-cyan-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-2 mb-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(action)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your practice..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;