// ─── Env Bindings ───
export type Bindings = {
  FINNHUB_API_KEY?: string;
  FRED_API_KEY?: string;
  CACHE: KVNamespace;
};

// ─── News ───
export type NewsCategory = 'politics' | 'tech' | 'finance' | 'gov' | 'ai' | 'intel';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  timestamp: number;
  source: string;
  category: NewsCategory;
  isAlert: boolean;
  alertKeyword?: string;
  region?: string;
  topics: string[];
}

// ─── Markets ───
export interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  type: 'index' | 'sector' | 'commodity';
}

// ─── Crypto ───
export interface CryptoItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
}

// ─── FRED ───
export interface EconomicIndicator {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
}

// ─── Leaders ───
export interface LeaderNews {
  source: string;
  title: string;
  link: string;
}

export interface WorldLeader {
  id: string;
  name: string;
  title: string;
  country: string;
  flag: string;
  news: LeaderNews[];
}

// ─── Analysis ───
export interface CorrelationResult {
  topic: string;
  count: number;
  sources: string[];
  momentum: 'rising' | 'stable' | 'falling';
}

export interface NarrativeResult {
  narrative: string;
  mentions: number;
  trend: 'emerging' | 'established' | 'fading';
  relatedTopics: string[];
}

export interface MainCharacterResult {
  name: string;
  mentions: number;
  sources: string[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
}

// ─── API Response ───
export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  ts: number;
  cached?: boolean;
  error?: string;
}
