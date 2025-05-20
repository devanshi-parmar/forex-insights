import { useState } from "react";
import { RefreshCw, Circle } from "lucide-react";
import { useNews } from "../hooks/useNews";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { formatTimeAgo } from "@/lib/utils";
import NewsCard from "../components/NewsCard";
import { SentimentType } from "@/lib/types";

export default function NewsPage() {
  const [selectedFilter, setSelectedFilter] = useState<SentimentType | 'all'>('all');
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useNews(selectedFilter);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const refreshNews = async () => {
    setIsRefreshing(true);
    try {
      await apiRequest("POST", "/api/fetchAndAnalyze");
      await refetch();
      toast({
        title: "Success",
        description: "Financial news has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update news. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const filterNews = (sentiment: SentimentType | 'all') => {
    setSelectedFilter(sentiment);
  };

  return (
    <section id="news" className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Financial News</h2>
        <div className="flex items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Last updated:</span>
          <span className="text-sm font-medium">
            {dataUpdatedAt ? formatTimeAgo(new Date(dataUpdatedAt)) : "Never"}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={refreshNews}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-5 w-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          className={`rounded-full ${selectedFilter === 'all' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          onClick={() => filterNews('all')}
        >
          All News
        </Button>
        <Button 
          className={`rounded-full ${selectedFilter === 'positive' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          onClick={() => filterNews('positive')}
        >
          <Circle className="h-2 w-2 fill-positive mr-2" />
          Positive
        </Button>
        <Button 
          className={`rounded-full ${selectedFilter === 'negative' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          onClick={() => filterNews('negative')}
        >
          <Circle className="h-2 w-2 fill-negative mr-2" />
          Negative
        </Button>
        <Button 
          className={`rounded-full ${selectedFilter === 'neutral' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          onClick={() => filterNews('neutral')}
        >
          <Circle className="h-2 w-2 fill-yellow-500 mr-2" />
          Neutral
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="animate-spin mb-4 mx-auto">
            <RefreshCw className="h-8 w-8 text-primary" />
          </div>
          <p>Loading news...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-10 text-negative">
          <p>Failed to load news. Please try refreshing.</p>
        </div>
      ) : (
        <>
          {/* News list */}
          <div className="space-y-4">
            {data?.articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {/* Load more button */}
          <div className="mt-6 text-center">
            <Button 
              className="px-6 py-2 bg-white dark:bg-gray-700 text-primary dark:text-gray-200 rounded-full shadow hover:shadow-md transition-all"
              variant="outline"
            >
              Load More News
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
