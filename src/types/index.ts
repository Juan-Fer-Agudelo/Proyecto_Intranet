export interface Module {
  id: string;
  name: string;
  icon: any;
  type: 'external' | 'secure';
  url: string;
}

export interface Video {
  id: string | number;
  title: string;
  description?: string;
  url: string;
  type: 'youtube' | 'local';
}

export interface Visit {
  id: string;
  text: string;
}

export interface Announcement {
  id: string | number;
  title: string;
  content: string;
  image?: string;
  active: boolean;
  company: CompanyCode | 'Global';
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
  id: string | number;
  url: string;
  year: string;
}
