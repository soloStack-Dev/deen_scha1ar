import { CATEGORY_LABELS } from '../data/content.js';
import type { Book } from '../data/types.js';
import { coverColor } from '../theme/tokens.js';

interface BookCardProps {
  book: Book;
  onOpen: (book: Book) => void;
}

function initials(title: string): string {
  return title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.slice(0, 1))
    .join('')
    .toUpperCase();
}

export function BookCard({ book, onOpen }: BookCardProps) {
  return (
    <view className="book-card" bindtap={() => onOpen(book)}>
      <view
        className="book-card__cover"
        style={{ backgroundColor: coverColor(book.id) }}
      >
        <text className="book-card__initials">{initials(book.title)}</text>
      </view>
      <text className="book-card__title">{book.title}</text>
      <text className="book-card__author">{book.author}</text>
      <text className="book-card__source">
        {book.sourceName} · {CATEGORY_LABELS[book.category]}
      </text>
    </view>
  );
}
