import type { NewsItem, NarrativeResult } from '../types';
import { CORRELATION_TOPICS } from '../config/analysis';

export function analyzeNarratives(allNews: NewsItem[]): NarrativeResult[] {
  const results: NarrativeResult[] = [];

  for (const { topic, patterns } of CORRELATION_TOPICS) {
    const matched = allNews.filter(item =>
      patterns.some(p => p.test(item.title)),
    );
    if (matched.length === 0) continue;

    const sources = [...new Set(matched.map(m => m.source))];
    const categories = [...new Set(matched.map(m => m.category))];

    let trend: NarrativeResult['trend'];
    if (sources.length >= 5 && categories.length >= 3) {
      trend = 'established';
    } else if (matched.length >= 3) {
      trend = 'emerging';
    } else {
      trend = 'fading';
    }

    results.push({
      narrative: topic,
      mentions: matched.length,
      trend,
      relatedTopics: categories as string[],
    });
  }

  return results.sort((a, b) => b.mentions - a.mentions);
}
