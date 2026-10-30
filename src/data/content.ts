import ayahData from './ayahs.json';
import bookData from './books.json';
import hadithData from './hadith.json';
import thoughtData from './thoughts.json';
import type {
  Ayah,
  Book,
  BookCategory,
  CategoryChip,
  Hadith,
  Thought,
} from './types.js';

export const AYAHS = ayahData as Ayah[];
export const BOOKS = bookData as Book[];
export const HADITHS = hadithData as Hadith[];
export const THOUGHTS = thoughtData as Thought[];

export const CATEGORY_LABELS: Record<BookCategory, string> = {
  'self-control': 'Self-control',
  finance: 'Finance',
  economics: 'Economics',
  relationship: 'Relationships',
  'sex-education': 'Sex education',
  mysterious: 'Mysterious',
  science: 'Science',
  'human-body': 'Human body',
  diseases: 'Diseases',
  bible: 'Bible',
  others: 'Others',
};

export const CATEGORY_CHIPS: CategoryChip[] = [
  { id: 'all', label: 'All' },
  ...(Object.keys(CATEGORY_LABELS) as BookCategory[])
    .filter((id) => id !== 'sex-education')
    .map((id) => ({
      id,
      label: CATEGORY_LABELS[id],
    })),
];

export const LICENSE_LABELS: Record<Book['license'], string> = {
  'public-domain': 'Public domain',
  'CC-BY': 'CC BY',
  'CC-BY-SA': 'CC BY-SA',
  'other-open': 'Other open licence',
};

export function getAyah(day: number): Ayah {
  return AYAHS.find((item) => item.day === day) ?? AYAHS[0];
}

export function getThought(day: number): Thought {
  return THOUGHTS.find((item) => item.day === day) ?? THOUGHTS[0];
}

export function getHadith(day: number): Hadith {
  return HADITHS.find((item) => item.day === day) ?? HADITHS[0];
}

/**
 * Copy text is intentionally identical to the format in Context/03 so every
 * share keeps the reference, the paraphrase note and the app credit together.
 */
export function formatAyahForCopy(ayah: Ayah): string {
  return [
    ayah.arabic,
    '',
    `"${ayah.translation}"`,
    `- Qur'an ${ayah.reference}`,
    '',
    ayah.explanation,
    '',
    'via Deensch1ar',
  ].join('\n');
}

export function formatThoughtForCopy(thought: Thought): string {
  return [
    thought.thought,
    `- ${thought.philosopher}`,
    '',
    `Try this today: ${thought.action}`,
    '',
    'via Deensch1ar',
  ].join('\n');
}

export function getBook(id: string): Book | undefined {
  return BOOKS.find((book) => book.id === id);
}

/**
 * Filtering is pure so the Library screen and the tests share one source of
 * truth. Adult-only entries are excluded from the Library entirely.
 */
export function filterBooks(options: {
  category: BookCategory | 'all';
  query: string;
}): Book[] {
  const query = options.query.trim().toLowerCase();
  return BOOKS.filter((book) => {
    if (book.adultOnly) return false;
    if (options.category !== 'all' && book.category !== options.category) return false;
    if (!query) return true;
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });
}
