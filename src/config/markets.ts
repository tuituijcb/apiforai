export interface SymbolConfig {
  symbol: string;
  name: string;
}

export const INDICES: SymbolConfig[] = [
  { symbol: '^DJI', name: 'Dow Jones' },
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: '^IXIC', name: 'NASDAQ' },
  { symbol: '^RUT', name: 'Russell 2000' },
];

/** ETF proxies for indices (Finnhub free tier) */
export const INDEX_ETF_MAP: Record<string, string> = {
  '^DJI': 'DIA',
  '^GSPC': 'SPY',
  '^IXIC': 'QQQ',
  '^RUT': 'IWM',
};

export const SECTORS: SymbolConfig[] = [
  { symbol: 'XLK', name: 'Technology' },
  { symbol: 'XLF', name: 'Financials' },
  { symbol: 'XLV', name: 'Healthcare' },
  { symbol: 'XLE', name: 'Energy' },
  { symbol: 'XLI', name: 'Industrials' },
  { symbol: 'XLY', name: 'Consumer Disc.' },
  { symbol: 'XLP', name: 'Consumer Staples' },
  { symbol: 'XLU', name: 'Utilities' },
  { symbol: 'XLRE', name: 'Real Estate' },
  { symbol: 'XLC', name: 'Communication' },
  { symbol: 'XLB', name: 'Materials' },
];

export const COMMODITIES: SymbolConfig[] = [
  { symbol: 'GC=F', name: 'Gold' },
  { symbol: 'CL=F', name: 'Crude Oil' },
  { symbol: 'NG=F', name: 'Natural Gas' },
  { symbol: 'SI=F', name: 'Silver' },
  { symbol: 'HG=F', name: 'Copper' },
];

/** ETF proxies for commodities */
export const COMMODITY_ETF_MAP: Record<string, string> = {
  'GC=F': 'GLD',
  'CL=F': 'USO',
  'NG=F': 'UNG',
  'SI=F': 'SLV',
  'HG=F': 'CPER',
};

export interface CryptoConfig {
  id: string;
  symbol: string;
  name: string;
}

export const CRYPTO: CryptoConfig[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
];
