import React from 'react';
import { Newspaper } from 'lucide-react';
import NewsCard from './NewsCard';

const NewsFeed: React.FC = () => {
  const newsArticles = [
    {
      id: 1,
      title: 'Latest Research on Panchakarma Efficacy in Diabetes Management',
      summary: 'New clinical study shows significant improvement in blood sugar control through systematic Panchakarma therapy.',
      url: 'https://example.com/article1',
      publishedAt: '2 days ago',
      category: 'Research',
      imageUrl: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Government Recognition of Ayurveda in National Healthcare Policy',
      summary: 'Ministry of Health announces new guidelines for integrating traditional medicine in modern healthcare.',
      url: 'https://example.com/article2',
      publishedAt: '1 week ago',
      category: 'Policy',
      imageUrl: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Advanced Pulse Diagnosis Techniques in Modern Practice',
      summary: 'Expert practitioners share insights on combining traditional Nadi Pariksha with contemporary diagnostic methods.',
      url: 'https://example.com/article3',
      publishedAt: '2 weeks ago',
      category: 'Techniques',
      imageUrl: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Newspaper className="text-green-600" size={24} />
        <h1 className="text-2xl font-bold text-gray-900">Healthcare News</h1>
      </div>

      <div className="space-y-4">
        {newsArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      <div className="text-center">
        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
          Load More Articles
        </button>
      </div>
    </div>
  );
};

export default NewsFeed;