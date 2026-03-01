/** Correlation topic patterns for cross-source analysis */
export const CORRELATION_TOPICS: { topic: string; patterns: RegExp[] }[] = [
  {
    topic: 'US-China Tensions',
    patterns: [/china/i, /tariff/i, /trade war/i, /taiwan/i, /xi jinping/i],
  },
  {
    topic: 'AI Regulation',
    patterns: [/AI regulation/i, /artificial intelligence.*law/i, /AI safety/i, /AI act/i],
  },
  {
    topic: 'Federal Reserve',
    patterns: [/fed\b/i, /interest rate/i, /inflation/i, /monetary policy/i, /powell/i],
  },
  {
    topic: 'Energy Crisis',
    patterns: [/oil price/i, /energy crisis/i, /opec/i, /natural gas/i, /pipeline/i],
  },
  {
    topic: 'Crypto Markets',
    patterns: [/bitcoin/i, /crypto/i, /blockchain/i, /ethereum/i, /defi/i],
  },
  {
    topic: 'Ukraine Conflict',
    patterns: [/ukraine/i, /russia.*war/i, /zelensky/i, /putin.*military/i],
  },
  {
    topic: 'Tech Layoffs',
    patterns: [/layoff/i, /job cut/i, /restructur/i, /workforce reduction/i],
  },
  {
    topic: 'Cybersecurity',
    patterns: [/hack/i, /breach/i, /ransomware/i, /cyber.*attack/i, /vulnerability/i],
  },
];

/** Named entity patterns for main character detection */
export const ENTITY_PATTERNS: { name: string; patterns: RegExp[] }[] = [
  { name: 'Donald Trump', patterns: [/\btrump\b/i, /\bpotus\b/i] },
  { name: 'Joe Biden', patterns: [/\bbiden\b/i] },
  { name: 'Elon Musk', patterns: [/\belon musk\b/i, /\bmusk\b/i] },
  { name: 'Xi Jinping', patterns: [/\bxi jinping\b/i, /\bxi\b/i] },
  { name: 'Vladimir Putin', patterns: [/\bputin\b/i] },
  { name: 'Jerome Powell', patterns: [/\bpowell\b/i, /\bfed chair\b/i] },
  { name: 'Sam Altman', patterns: [/\bsam altman\b/i, /\baltman\b/i] },
  { name: 'Volodymyr Zelensky', patterns: [/\bzelensky\b/i] },
];
