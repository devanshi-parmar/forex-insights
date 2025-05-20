import { useQuery } from "@tanstack/react-query";
import { NewsArticle, SentimentType } from "@/lib/types";

interface NewsResponse {
  articles: NewsArticle[];
}

export function useNews(sentiment: SentimentType | 'all' = 'all', limit = 10, offset = 0) {
  const queryParams = sentiment === 'all' 
    ? `limit=${limit}&offset=${offset}` 
    : `sentiment=${sentiment}&limit=${limit}`;
    
  return useQuery<NewsResponse>({
    queryKey: [`/api/news?${queryParams}`],
    refetchOnWindowFocus: false,
  });
}
