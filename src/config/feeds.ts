import type { NewsCategory } from '../types';

export interface FeedSource {
  name: string;
  url: string;
  category: NewsCategory;
}

/** GDELT query templates per category */
export const CATEGORY_QUERIES: Record<NewsCategory, string> = {
  politics: '(politics OR government OR election OR congress)',
  tech: '(technology OR software OR startup OR "silicon valley")',
  finance: '(finance OR "stock market" OR economy OR banking)',
  gov: '("federal government" OR "white house" OR congress OR regulation)',
  ai: '("artificial intelligence" OR "machine learning" OR AI OR ChatGPT)',
  intel: '(intelligence OR security OR military OR defense)',
};

export const ALL_CATEGORIES: NewsCategory[] = [
  'politics', 'tech', 'finance', 'gov', 'ai', 'intel',
];
