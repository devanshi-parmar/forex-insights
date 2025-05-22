import { 
  users, type User, type InsertUser,
  newsArticles, type NewsArticle, type InsertNewsArticle,
  forexSignals, type ForexSignal, type InsertForexSignal
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // News article methods
  async getNewsArticles(limit = 10, offset = 0): Promise<NewsArticle[]> {
    const articles = await db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.createdAt))
      .limit(limit)
      .offset(offset);
    
    return articles;
  }
  
  async getNewsArticleById(id: number): Promise<NewsArticle | undefined> {
    const [article] = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.id, id));
    
    return article;
  }
  
  async getNewsArticlesBySentiment(sentiment: string, limit = 10): Promise<NewsArticle[]> {
    const articles = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.sentiment, sentiment))
      .orderBy(desc(newsArticles.createdAt))
      .limit(limit);
    
    return articles;
  }
  
  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    // Set default values for nullable fields if not provided
    const articleToInsert = {
      ...insertArticle,
      content: insertArticle.content || null,
      sentimentScore: insertArticle.sentimentScore !== undefined ? insertArticle.sentimentScore : null,
      keywords: insertArticle.keywords || null
    };
    
    const [article] = await db
      .insert(newsArticles)
      .values(articleToInsert)
      .returning();
    
    return article;
  }
  
  // Forex signal methods
  async getForexSignals(limit = 10, offset = 0): Promise<ForexSignal[]> {
    const signals = await db
      .select()
      .from(forexSignals)
      .orderBy(desc(forexSignals.createdAt))
      .limit(limit)
      .offset(offset);
    
    return signals;
  }
  
  async getForexSignalById(id: number): Promise<ForexSignal | undefined> {
    const [signal] = await db
      .select()
      .from(forexSignals)
      .where(eq(forexSignals.id, id));
    
    return signal;
  }
  
  async getForexSignalsByCurrencyPair(currencyPair: string): Promise<ForexSignal[]> {
    const signals = await db
      .select()
      .from(forexSignals)
      .where(eq(forexSignals.currencyPair, currencyPair))
      .orderBy(desc(forexSignals.createdAt));
    
    return signals;
  }
  
  async createForexSignal(insertSignal: InsertForexSignal): Promise<ForexSignal> {
    // Set default values for nullable fields if not provided
    const signalToInsert = {
      ...insertSignal,
      sentimentScore: insertSignal.sentimentScore !== undefined ? insertSignal.sentimentScore : null,
      newsArticleIds: insertSignal.newsArticleIds || null
    };
    
    const [signal] = await db
      .insert(forexSignals)
      .values(signalToInsert)
      .returning();
    
    return signal;
  }
}

// Export the database storage implementation
export const storage = new DatabaseStorage();
