import { 
  users, type User, type InsertUser,
  newsArticles, type NewsArticle, type InsertNewsArticle,
  forexSignals, type ForexSignal, type InsertForexSignal
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User methods (keeping existing ones)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // News article methods
  getNewsArticles(limit?: number, offset?: number): Promise<NewsArticle[]>;
  getNewsArticleById(id: number): Promise<NewsArticle | undefined>;
  getNewsArticlesBySentiment(sentiment: string, limit?: number): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  
  // Forex signal methods
  getForexSignals(limit?: number, offset?: number): Promise<ForexSignal[]>;
  getForexSignalById(id: number): Promise<ForexSignal | undefined>;
  getForexSignalsByCurrencyPair(currencyPair: string): Promise<ForexSignal[]>;
  createForexSignal(signal: InsertForexSignal): Promise<ForexSignal>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private newsArticles: Map<number, NewsArticle>;
  private forexSignals: Map<number, ForexSignal>;
  
  private userId: number;
  private newsArticleId: number;
  private forexSignalId: number;
  
  constructor() {
    this.users = new Map();
    this.newsArticles = new Map();
    this.forexSignals = new Map();
    
    this.userId = 1;
    this.newsArticleId = 1;
    this.forexSignalId = 1;
  }
  
  // User methods (keeping existing ones)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // News article methods
  async getNewsArticles(limit = 10, offset = 0): Promise<NewsArticle[]> {
    const articles = Array.from(this.newsArticles.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
    
    return articles;
  }
  
  async getNewsArticleById(id: number): Promise<NewsArticle | undefined> {
    return this.newsArticles.get(id);
  }
  
  async getNewsArticlesBySentiment(sentiment: string, limit = 10): Promise<NewsArticle[]> {
    const articles = Array.from(this.newsArticles.values())
      .filter(article => article.sentiment === sentiment)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    
    return articles;
  }
  
  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const id = this.newsArticleId++;
    const createdAt = new Date();
    const article: NewsArticle = { ...insertArticle, id, createdAt };
    this.newsArticles.set(id, article);
    return article;
  }
  
  // Forex signal methods
  async getForexSignals(limit = 10, offset = 0): Promise<ForexSignal[]> {
    const signals = Array.from(this.forexSignals.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
    
    return signals;
  }
  
  async getForexSignalById(id: number): Promise<ForexSignal | undefined> {
    return this.forexSignals.get(id);
  }
  
  async getForexSignalsByCurrencyPair(currencyPair: string): Promise<ForexSignal[]> {
    const signals = Array.from(this.forexSignals.values())
      .filter(signal => signal.currencyPair === currencyPair)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return signals;
  }
  
  async createForexSignal(insertSignal: InsertForexSignal): Promise<ForexSignal> {
    const id = this.forexSignalId++;
    const createdAt = new Date();
    const signal: ForexSignal = { ...insertSignal, id, createdAt };
    this.forexSignals.set(id, signal);
    return signal;
  }
}

export const storage = new MemStorage();
