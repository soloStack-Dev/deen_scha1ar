export type BookCategory =
  | 'self-control'
  | 'finance'
  | 'economics'
  | 'relationship'
  | 'sex-education'
  | 'mysterious'
  | 'science'
  | 'human-body'
  | 'diseases'
  | 'bible'
  | 'others';

export type BookSource = 'Gutenberg' | 'OpenStax' | 'OpenLibrary' | 'eBible' | 'Other';

export type BookLicense = 'public-domain' | 'CC-BY' | 'CC-BY-SA' | 'other-open';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  description: string;
  sourceName: BookSource;
  sourceUrl: string;
  license: BookLicense;
  adultOnly?: boolean;
}

export interface Ayah {
  day: number;
  reference: string;
  arabic: string;
  translation: string;
  explanation: string;
  sourceUrl: string;
  translationNote: string;
}

export interface Thought {
  day: number;
  philosopher: string;
  thought: string;
  action: string;
  paraphrase: boolean;
}

export interface Hadith {
  day: number;
  collection: string;
  number: number;
  book: string;
  topic: string;
  sourceUrl: string;
  note: string;
}

export interface CategoryChip {
  id: BookCategory | 'all';
  label: string;
}
