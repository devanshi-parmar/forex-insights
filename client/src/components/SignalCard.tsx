import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { ForexSignal } from "@/lib/types";
import { formatTimeAgo, getSentimentText } from "@/lib/utils";
import SentimentBadge from "./SentimentBadge";

interface SignalCardProps {
  signal: ForexSignal;
}

export default function SignalCard({ signal }: SignalCardProps) {
  return (
    <div className="signal-card bg-white dark:bg-surface-dark rounded-lg shadow-md overflow-hidden transition-all duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="currency-pair">
          <span className="font-medium text-lg">{signal.currencyPair}</span>
        </div>
        <SentimentBadge type={signal.signal} />
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-3">
          <span className="text-gray-600 dark:text-gray-400">Sentiment:</span>
          <span className={`font-medium ${
            signal.sentiment === 'positive' 
              ? 'text-positive' 
              : signal.sentiment === 'negative' 
                ? 'text-negative' 
                : 'text-yellow-600'
          }`}>
            {getSentimentText(signal.sentimentScore)} ({signal.sentimentScore})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Based on:</span>
          <span className="text-gray-800 dark:text-gray-200">{signal.newsArticleCount} news articles</span>
        </div>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 inline mr-1" />
          <span>{formatTimeAgo(signal.createdAt as Date)}</span>
        </div>
      </div>
    </div>
  );
}
