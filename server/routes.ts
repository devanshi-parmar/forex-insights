import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import Sentiment from "sentiment";
import { z } from "zod";
import { SentimentType, SignalType, insertNewsArticleSchema, insertForexSignalSchema } from "@shared/schema";

// Initialize sentiment analyzer
const sentimentAnalyzer = new Sentiment();

// Currency pairs to analyze
const CURRENCY_PAIRS = [
  "EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF", 
  "AUD/USD", "USD/CAD", "NZD/USD"
];

// Keywords that indicate possible market movement
const KEYWORDS = {
  INTEREST_RATE: ["interest rate", "rate hike", "rate cut", "federal reserve", "central bank"],
  INFLATION: ["inflation", "cpi", "consumer price", "deflation"],
  ECONOMIC_GROWTH: ["gdp", "economic growth", "economy", "recession"],
  TRADE: ["trade", "export", "import", "tariff", "trade balance"],
  EMPLOYMENT: ["employment", "unemployment", "jobs", "nonfarm", "labor"]
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API route prefix
  const API_PREFIX = "/api";

  // News API endpoint
  app.get(`${API_PREFIX}/news`, async (req, res) => {
    try {
      const sentimentFilter = req.query.sentiment as string;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      let articles;
      if (sentimentFilter && Object.values(SentimentType).includes(sentimentFilter as SentimentType)) {
        articles = await storage.getNewsArticlesBySentiment(sentimentFilter, limit);
      } else {
        articles = await storage.getNewsArticles(limit, offset);
      }
      
      res.json({ articles });
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news articles" });
    }
  });

  // Forex signals endpoint
  app.get(`${API_PREFIX}/signals`, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const currencyPair = req.query.pair as string;
      
      let signals;
      if (currencyPair) {
        signals = await storage.getForexSignalsByCurrencyPair(currencyPair);
      } else {
        signals = await storage.getForexSignals(limit, offset);
      }
      
      res.json({ signals });
    } catch (error) {
      console.error("Error fetching signals:", error);
      res.status(500).json({ message: "Failed to fetch forex signals" });
    }
  });

  // Fetch news from external API and analyze
  app.post(`${API_PREFIX}/fetchAndAnalyze`, async (req, res) => {
    try {
      const API_KEY = process.env.NEWS_API_KEY || "";
      
      if (!API_KEY) {
        return res.status(400).json({ message: "API key not provided" });
      }
      
      // Fetch financial news
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: "forex OR currency OR (finance AND exchange rate)",
          language: "en",
          sortBy: "publishedAt",
          pageSize: 30,
          apiKey: API_KEY
        }
      });
      
      if (!response.data || !response.data.articles) {
        return res.status(400).json({ message: "Failed to fetch news from external API" });
      }
      
      const newsData = response.data.articles;
      const savedArticles = [];
      const signals = new Map<string, any>();
      
      // Process each news article
      for (const article of newsData) {
        // Analyze sentiment
        const titleSentiment = sentimentAnalyzer.analyze(article.title);
        const descSentiment = article.description ? sentimentAnalyzer.analyze(article.description) : { score: 0 };
        
        // Combine and normalize sentiment to a scale of -10 to 10
        const combinedScore = titleSentiment.score * 2 + descSentiment.score;  // Title has more weight
        const normalizedScore = Math.max(-10, Math.min(10, combinedScore));
        
        let sentimentType: SentimentType;
        if (normalizedScore > 1) {
          sentimentType = SentimentType.POSITIVE;
        } else if (normalizedScore < -1) {
          sentimentType = SentimentType.NEGATIVE;
        } else {
          sentimentType = SentimentType.NEUTRAL;
        }
        
        // Extract keywords
        const text = `${article.title} ${article.description || ''}`.toLowerCase();
        const extractedKeywords = [];
        
        for (const [category, words] of Object.entries(KEYWORDS)) {
          if (words.some(word => text.includes(word))) {
            extractedKeywords.push(category.toLowerCase());
          }
        }
        
        // Save the article to storage
        const newsArticle = await storage.createNewsArticle({
          title: article.title,
          description: article.description || '',
          content: article.content || '',
          url: article.url,
          source: article.source.name || 'Unknown',
          publishedAt: new Date(article.publishedAt),
          sentiment: sentimentType,
          sentimentScore: Math.round(normalizedScore),
          keywords: extractedKeywords,
        });
        
        savedArticles.push(newsArticle);
        
        // Generate forex signals based on the article
        for (const pair of CURRENCY_PAIRS) {
          const [baseCurrency, quoteCurrency] = pair.split('/');
          
          // Check if article mentions these currencies
          if (
            text.includes(baseCurrency.toLowerCase()) || 
            text.includes(quoteCurrency.toLowerCase())
          ) {
            // Create or update signal for this currency pair
            if (!signals.has(pair)) {
              signals.set(pair, {
                currencyPair: pair,
                articleIds: [],
                totalScore: 0,
                count: 0,
              });
            }
            
            const signal = signals.get(pair);
            signal.articleIds.push(newsArticle.id);
            signal.totalScore += normalizedScore;
            signal.count += 1;
          }
        }
      }
      
      // Generate final signals based on aggregated data
      const savedSignals = [];
      
      for (const [pair, data] of signals.entries()) {
        if (data.count === 0) continue;
        
        const avgScore = data.totalScore / data.count;
        let signal: SignalType;
        let sentiment: SentimentType;
        
        // Determine signal type based on avg score
        if (avgScore > 2) {
          signal = SignalType.BUY;
          sentiment = SentimentType.POSITIVE;
        } else if (avgScore < -2) {
          signal = SignalType.SELL;
          sentiment = SentimentType.NEGATIVE;
        } else {
          signal = SignalType.HOLD;
          sentiment = SentimentType.NEUTRAL;
        }
        
        // Save the forex signal
        const forexSignal = await storage.createForexSignal({
          currencyPair: pair,
          signal,
          sentiment,
          sentimentScore: Math.round(avgScore),
          newsArticleIds: data.articleIds,
          newsArticleCount: data.count,
        });
        
        savedSignals.push(forexSignal);
      }
      
      res.json({ 
        message: "Successfully fetched and analyzed news",
        articles: savedArticles.length,
        signals: savedSignals.length
      });
      
    } catch (error) {
      console.error("Error fetching and analyzing news:", error);
      res.status(500).json({ message: "Failed to fetch and analyze news", error: (error as Error).message });
    }
  });

  // Get summary stats for dashboard
  app.get(`${API_PREFIX}/dashboard`, async (req, res) => {
    try {
      const signals = await storage.getForexSignals(100);
      const articles = await storage.getNewsArticles(100);
      
      // Count signals by type
      const signalCounts = {
        buy: signals.filter(s => s.signal === SignalType.BUY).length,
        sell: signals.filter(s => s.signal === SignalType.SELL).length,
        hold: signals.filter(s => s.signal === SignalType.HOLD).length,
      };
      
      // Count mentions of currencies
      const currencyMentions: Record<string, number> = {};
      signals.forEach(signal => {
        const [base, quote] = signal.currencyPair.split('/');
        
        if (!currencyMentions[base]) currencyMentions[base] = 0;
        if (!currencyMentions[quote]) currencyMentions[quote] = 0;
        
        currencyMentions[base] += 1;
        currencyMentions[quote] += 1;
      });
      
      // Sort currencies by mentions
      const topCurrencies = Object.entries(currencyMentions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([currency, count]) => ({ currency, count }));
      
      // Extract keywords from articles
      const keywordCounts: Record<string, number> = {};
      articles.forEach(article => {
        article.keywords?.forEach(keyword => {
          if (!keywordCounts[keyword]) keywordCounts[keyword] = 0;
          keywordCounts[keyword] += 1;
        });
      });
      
      // Sort keywords by counts
      const topKeywords = Object.entries(keywordCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([keyword, count]) => ({ keyword, count }));
      
      // Recent major events (using most recent signals)
      const recentEvents = signals
        .slice(0, 5)
        .map(signal => ({
          name: `${signal.currencyPair} ${signal.signal.toUpperCase()}`,
          type: signal.sentiment,
          timestamp: signal.createdAt
        }));
      
      res.json({
        signalCounts,
        topCurrencies,
        topKeywords,
        recentEvents
      });
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  return httpServer;
}
