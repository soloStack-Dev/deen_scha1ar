import { useMemo, useState } from '@lynx-js/react';

import './Library.css';

import { BookCard } from '../../components/BookCard.js';
import { BookDetailSheet } from '../../components/BookDetailSheet.js';
import { CategoryChips } from '../../components/CategoryChips.js';
import { DaySelector } from '../../components/DaySelector.js';
import { ThoughtCard } from '../../components/ThoughtCard.js';
import { filterBooks, getThought } from '../../data/content.js';
import type { Book, BookCategory } from '../../data/types.js';
import { dayNumberForDate, toDateKey } from '../../lib/date.js';
import { useNow } from '../../lib/useNow.js';
import { useApp } from '../../state/AppProvider.js';

interface LibraryProps {
  onOpenLink: (url: string, label: string) => void;
}

interface InputEvent {
  detail: { value: string };
}

export function Library({ onOpenLink }: LibraryProps) {
  const { state } = useApp();
  const [category, setCategory] = useState<BookCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Book | null>(null);
  const now = useNow();
  const today = toDateKey(now);
  const dayNumber = dayNumberForDate(state.settings.installDate, today);
  const [thoughtDay, setThoughtDay] = useState(dayNumber);
  const thought = getThought(thoughtDay);

  const books = useMemo(
    () => filterBooks({ category, query }),
    [category, query],
  );

  function handleSearch(event: InputEvent) {
    setQuery(event.detail.value);
  }

  function handleOpen(book: Book) {
    setSelected(null);
    onOpenLink(book.sourceUrl, book.title);
  }

  return (
    <view className="page">
      <view className="page-head">
        <text className="page-title">Library</text>
        <text className="page-subtitle">
          Free, legal books and texts. Every title opens its source.
        </text>
      </view>

      <input
        className="search"
        placeholder="Search title or author"
        bindinput={handleSearch}
      />

      <CategoryChips selected={category} onSelect={setCategory} />

      <text className="library__count">{books.length} titles</text>

      {books.length === 0 ? (
        <view className="empty">
          <text className="empty__title">Nothing matches yet</text>
          <text className="empty__text">
            Try another category or search term.
          </text>
        </view>
      ) : (
        <view className="book-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onOpen={setSelected} />
          ))}
        </view>
      )}

      <view className="section-head">
        <text className="section-title">Thought of the day</text>
        <text className="section-caption">Day {thoughtDay} of 7</text>
      </view>
      <DaySelector value={thoughtDay} onChange={setThoughtDay} />
      <ThoughtCard thought={thought} />

      <text className="library__sources">
        Sources: Gutenberg · OpenStax · Open Library · eBible. Verify each
        licence on the source page.
      </text>

      {selected ? (
        <BookDetailSheet
          book={selected}
          onClose={() => setSelected(null)}
          onOpen={handleOpen}
        />
      ) : null}
    </view>
  );
}
