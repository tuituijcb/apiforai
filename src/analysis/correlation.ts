import type { NewsItem, CorrelationResult } from '../types';
import { CORRELATION_TOPICS } from '../config/analysis';

export function analyzeCorrelations(allNews: NewsItem[]): CorrelationResult[] {
  const results: CorrelationResult[] = [];

  for (const { topic, patterns } of CORRELATION_TOPICS) {
    const matched = allNews.filter(item =>
      patterns.some(p => p.test(item.title)),
    );
    if (matched.length === 0) continue;

    const sources = [...new Set(matched.map(m => m.source))];
    const categories = [...new Set(matched.map(m => m.category))];

    const momentum: CorrelationResult['momentum'] =
      categories.length >= 3 ? 'rising' : categories.length >= 2 ? 'stable' : 'falling';

    results.push({ topic, count: matched.length, sources: sources.slice(0, 5), momentum });
  }

  return results.sort((a, b) => b.count - a.count);
}
