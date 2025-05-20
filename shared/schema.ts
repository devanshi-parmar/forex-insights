import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (keeping the existing one)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// News articles schema
export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  url: text("url").notNull(),
  source: text("source").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  sentiment: text("sentiment").notNull(), // positive, negative, neutral
  sentimentScore: integer("sentiment_score"), // from -10 to 10
  keywords: text("keywords").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;

// Forex signals schema
export const forexSignals = pgTable("forex_signals", {
  id: serial("id").primaryKey(),
  currencyPair: varchar("currency_pair", { length: 7 }).notNull(),
  signal: text("signal").notNull(), // buy, sell, hold
  sentiment: text("sentiment").notNull(), // positive, negative, neutral
  sentimentScore: integer("sentiment_score"), // from -10 to 10
  newsArticleIds: integer("news_article_ids").array(),
  newsArticleCount: integer("news_article_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertForexSignalSchema = createInsertSchema(forexSignals).omit({
  id: true,
  createdAt: true,
});

export type InsertForexSignal = z.infer<typeof insertForexSignalSchema>;
export type ForexSignal = typeof forexSignals.$inferSelect;

// Export enums for type safety
export const SentimentType = {
  POSITIVE: "positive",
  NEGATIVE: "negative",
  NEUTRAL: "neutral",
} as const;

export type SentimentType = typeof SentimentType[keyof typeof SentimentType];

export const SignalType = {
  BUY: "buy",
  SELL: "sell",
  HOLD: "hold",
} as const;

export type SignalType = typeof SignalType[keyof typeof SignalType];
