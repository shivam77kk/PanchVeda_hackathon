import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';

interface NewsCardProps {
  article: {
    id: number;
    title: string;
    summary: string;
    url: string;
    publishedAt: string;
    category: string;
    imageUrl?: string;
  };
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {article.imageUrl && (
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      )}
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
          {article.category}
        </span>
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock size={12} />
          <span>{article.publishedAt}</span>
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
        {article.title}
      </h3>
      
      <p className="text-xs text-gray-600 mb-3 line-clamp-3">
        {article.summary}
      </p>
      
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-1 text-xs text-green-600 hover:text-green-700 font-medium"
      >
        <span>Read more</span>
        <ExternalLink size={12} />
      </a>
    </div>
  );
};

export default NewsCard;