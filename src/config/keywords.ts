/** Alert keywords that flag a news item as high-priority */
const ALERT_KEYWORDS = [
  'breaking', 'urgent', 'alert', 'emergency', 'crisis',
  'attack', 'explosion', 'shooting', 'missile', 'nuclear',
  'sanctions', 'invasion', 'coup', 'martial law', 'evacuation',
  'crash', 'collapse', 'default', 'recession', 'shutdown',
  'pandemic', 'outbreak', 'cyberattack', 'breach',
];

/** Region detection patterns */
const REGION_PATTERNS: [RegExp, string][] = [
  [/\b(china|chinese|beijing|shanghai|xi jinping)\b/i, 'China'],
  [/\b(russia|russian|moscow|kremlin|putin)\b/i, 'Russia'],
  [/\b(ukraine|ukrainian|kyiv|zelensky)\b/i, 'Ukraine'],
  [/\b(iran|iranian|tehran)\b/i, 'Iran'],
  [/\b(israel|israeli|tel aviv|gaza|hamas|hezbollah)\b/i, 'Middle East'],
  [/\b(north korea|pyongyang|kim jong)\b/i, 'North Korea'],
  [/\b(taiwan|taiwanese|taipei)\b/i, 'Taiwan'],
  [/\b(europe|european|EU|brussels|nato)\b/i, 'Europe'],
  [/\b(india|indian|modi|delhi)\b/i, 'India'],
  [/\b(japan|japanese|tokyo)\b/i, 'Japan'],
];

/** Topic detection patterns */
const TOPIC_PATTERNS: [RegExp, string][] = [
  [/\b(AI|artificial intelligence|machine learning|GPT|LLM)\b/i, 'AI'],
  [/\b(crypto|bitcoin|ethereum|blockchain)\b/i, 'Crypto'],
  [/\b(climate|carbon|emissions|renewable)\b/i, 'Climate'],
  [/\b(election|vote|ballot|campaign)\b/i, 'Elections'],
  [/\b(military|defense|army|navy|weapons)\b/i, 'Military'],
  [/\b(trade|tariff|import|export|sanctions)\b/i, 'Trade'],
  [/\b(cyber|hack|breach|ransomware)\b/i, 'Cyber'],
  [/\b(space|nasa|satellite|orbit)\b/i, 'Space'],
];

export function containsAlertKeyword(text: string): { keyword: string } | null {
  const lower = text.toLowerCase();
  for (const kw of ALERT_KEYWORDS) {
    if (lower.includes(kw)) return { keyword: kw };
  }
  return null;
}

export function detectRegion(text: string): string | undefined {
  for (const [pattern, region] of REGION_PATTERNS) {
    if (pattern.test(text)) return region;
  }
  return undefined;
}

export function detectTopics(text: string): string[] {
  const topics: string[] = [];
  for (const [pattern, topic] of TOPIC_PATTERNS) {
    if (pattern.test(text)) topics.push(topic);
  }
  return topics;
}
