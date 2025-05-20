// Types shared between client and server
export type SentimentType = 'positive' | 'negative' | 'neutral';

export type SignalType = 'buy' | 'sell' | 'hold';

export interface NewsArticle {
  id: number;
  title: string;
  description: string;
  content?: string;
  url: string;
  source: string;
  publishedAt: string | Date;
  sentiment: SentimentType;
  sentimentScore: number;
  keywords?: string[];
  createdAt: string | Date;
}

export interface ForexSignal {
  id: number;
  currencyPair: string;
  signal: SignalType;
  sentiment: SentimentType;
  sentimentScore: number;
  newsArticleIds?: number[];
  newsArticleCount: number;
  createdAt: string | Date;
}

export interface DashboardData {
  signalCounts: {
    buy: number;
    sell: number;
    hold: number;
  };
  topCurrencies: Array<{
    currency: string;
    count: number;
  }>;
  topKeywords: Array<{
    keyword: string;
    count: number;
  }>;
  recentEvents: Array<{
    name: string;
    type: SentimentType;
    timestamp: string | Date;
  }>;
}
