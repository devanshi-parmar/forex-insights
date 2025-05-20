import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Format sentiment score to a readable string with +/- sign
export function formatSentimentScore(score: number): string {
  if (score > 0) {
    return `+${score}`;
  }
  return `${score}`;
}

// Get sentiment text based on score
export function getSentimentText(score: number): string {
  if (score > 1) return 'Positive';
  if (score < -1) return 'Negative';
  return 'Neutral';
}

// Get sentiment color based on type
export function getSentimentColor(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'bg-positive-light text-positive-dark';
    case 'negative':
      return 'bg-negative-light text-negative-dark';
    case 'neutral':
      return 'bg-neutral-light text-gray-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}

// Get signal color based on type
export function getSignalColor(signal: string): string {
  switch (signal.toLowerCase()) {
    case 'buy':
      return 'bg-positive-light text-positive-dark';
    case 'sell':
      return 'bg-negative-light text-negative-dark';
    case 'hold':
      return 'bg-neutral-light text-gray-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
}

// Calculate the percentage for progress bars
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Extract currency code from a currency pair
export function extractCurrencies(pair: string): [string, string] {
  const [base, quote] = pair.split('/');
  return [base, quote];
}
