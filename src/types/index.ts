export interface Module {
  id: string;
  name: string;
  icon: any;
  type: 'external' | 'secure';
  url: string;
}

export interface Video {
  id: number;
  title: string;
  url: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  image?: string;
  active: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image?: string;
  category: string;
  author: string;
  date: string;
}

export type CompanyCode = 'SX' | 'SO' | 'PL';

export interface PartyPhoto {
  id: number;
  url: string;
}
