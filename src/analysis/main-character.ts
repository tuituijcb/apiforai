import type { NewsItem, MainCharacterResult } from '../types';
import { ENTITY_PATTERNS } from '../config/analysis';

export function analyzeMainCharacters(allNews: NewsItem[]): MainCharacterResult[] {
  const results: MainCharacterResult[] = [];

  for (const { name, patterns } of ENTITY_PATTERNS) {
    const matched = allNews.filter(item =>
      patterns.some(p => p.test(item.title)),
    );
    if (matched.length === 0) continue;

    const sources = [...new Set(matched.map(m => m.source))];
    const alerts = matched.filter(m => m.isAlert).length;

    let sentiment: MainCharacterResult['sentiment'];
    if (alerts > matched.length * 0.5) {
      sentiment = 'negative';
    } else if (alerts > 0) {
      sentiment = 'mixed';
    } else {
      sentiment = 'neutral';
    }

    results.push({ name, mentions: matched.length, sources: sources.slice(0, 5), sentiment });
  }

  return results.sort((a, b) => b.mentions - a.mentions);
}
