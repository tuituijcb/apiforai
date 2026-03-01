export interface LeaderConfig {
  id: string;
  name: string;
  title: string;
  country: string;
  flag: string;
  keywords: string[];
}

export const WORLD_LEADERS: LeaderConfig[] = [
  { id: 'trump', name: 'Donald Trump', title: 'President', country: 'United States', flag: '🇺🇸', keywords: ['Trump', 'POTUS'] },
  { id: 'xi', name: 'Xi Jinping', title: 'President', country: 'China', flag: '🇨🇳', keywords: ['Xi Jinping', 'Xi'] },
  { id: 'putin', name: 'Vladimir Putin', title: 'President', country: 'Russia', flag: '🇷🇺', keywords: ['Putin'] },
  { id: 'starmer', name: 'Keir Starmer', title: 'Prime Minister', country: 'United Kingdom', flag: '🇬🇧', keywords: ['Starmer'] },
  { id: 'macron', name: 'Emmanuel Macron', title: 'President', country: 'France', flag: '🇫🇷', keywords: ['Macron'] },
  { id: 'modi', name: 'Narendra Modi', title: 'Prime Minister', country: 'India', flag: '🇮🇳', keywords: ['Modi'] },
  { id: 'zelensky', name: 'Volodymyr Zelensky', title: 'President', country: 'Ukraine', flag: '🇺🇦', keywords: ['Zelensky'] },
];
