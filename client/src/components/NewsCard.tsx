import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { formatTimeAgo } from "@/lib/utils";
import SentimentBadge from "./SentimentBadge";

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <div className="news-card bg-white dark:bg-surface-dark rounded-lg shadow-md overflow-hidden transition-all duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {article.title}
          </h3>
          <SentimentBadge type={article.sentiment} className="ml-2 whitespace-nowrap" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {article.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span>{article.source}</span>
            <span className="mx-2">•</span>
            <span>{formatTimeAgo(article.publishedAt as Date)}</span>
          </div>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary text-sm font-medium flex items-center"
          >
            Read more
            <ArrowRight className="h-4 w-4 ml-1" />
          </a>
        </div>
        {article.keywords && article.keywords.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {article.keywords.map((keyword, index) => (
              <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
