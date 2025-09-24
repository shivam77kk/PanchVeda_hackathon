import React, { useState } from 'react';
import { Brain, Sparkles, Copy, Check } from 'lucide-react';
import AIOutcomePrediction from './AIOutcomePrediction';

const AIRecommendPlan: React.FC = () => {
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const recommendations = [
    {
      id: 1,
      title: "Digestive Health Recovery Plan",
      duration: "21 days",
      confidence: 92,
      phases: [
        { phase: "Purvakarma", duration: "5 days", treatments: ["Snehapana", "Swedana"] },
        { phase: "Pradhankarma", duration: "7 days", treatments: ["Virechana", "Basti"] },
        { phase: "Paschatkarma", duration: "9 days", treatments: ["Rasayana", "Satvavajaya"] }
      ],
      reasoning: "Based on patient's chronic digestive issues and constitutional analysis, this plan focuses on toxin elimination and digestive strengthening."
    },
    {
      id: 2,
      title: "Stress & Anxiety Management",
      duration: "14 days",
      confidence: 87,
      phases: [
        { phase: "Purvakarma", duration: "3 days", treatments: ["Abhyanga", "Shirodhara"] },
        { phase: "Pradhankarma", duration: "5 days", treatments: ["Nasya", "Akshi Tarpana"] },
        { phase: "Paschatkarma", duration: "6 days", treatments: ["Meditation", "Yoga Therapy"] }
      ],
      reasoning: "AI analysis of patient symptoms suggests nervous system imbalance. This plan targets mental wellness and stress reduction."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Brain className="text-purple-600" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
          <p className="text-gray-600">Personalized treatment recommendations powered by AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="text-purple-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">Recommended Plans</h2>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedRecommendation === rec.id 
                      ? 'border-purple-300 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                  onClick={() => setSelectedRecommendation(rec.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <p className="text-sm text-gray-600">{rec.duration} treatment plan</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-sm font-medium text-purple-600">{rec.confidence}% match</div>
                      <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-1 bg-purple-600 rounded-full"
                          style={{ width: `${rec.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    {rec.phases.map((phase, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs font-medium text-gray-700">{phase.phase}</div>
                        <div className="text-xs text-gray-500">{phase.duration}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {phase.treatments.slice(0, 2).join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{rec.reasoning}</p>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors text-center">
                      Apply to Patient
                    </button>
                    <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors flex items-center justify-center space-x-1">
                      <Copy size={16} className="inline mr-1" />
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <AIOutcomePrediction />
        </div>
      </div>
    </div>
  );
};

export default AIRecommendPlan;