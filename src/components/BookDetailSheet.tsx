import { CATEGORY_LABELS, LICENSE_LABELS } from '../data/content.js';
import type { Book } from '../data/types.js';
import { coverColor } from '../theme/tokens.js';

interface BookDetailSheetProps {
  book: Book;
  onClose: () => void;
  onOpen: (book: Book) => void;
}

export function BookDetailSheet({
  book,
  onClose,
  onOpen,
}: BookDetailSheetProps) {
  return (
    <view className="sheet-backdrop" bindtap={onClose}>
      <view className="sheet-card sheet-card--tall" catchtap={() => {}}>
        <view className="book-detail__head">
          <view
            className="book-detail__cover"
            style={{ backgroundColor: coverColor(book.id) }}
          >
            <text className="book-detail__cover-text">{book.title.slice(0, 1)}</text>
          </view>
          <view className="book-detail__head-copy">
            <text className="book-detail__title">{book.title}</text>
            <text className="book-detail__author">{book.author}</text>
            <text className="book-detail__category">
              {CATEGORY_LABELS[book.category]}
            </text>
          </view>
        </view>

        <text className="sheet__message">{book.description}</text>

        <view className="book-detail__badges">
          <text className="badge">{book.sourceName}</text>
          <text className="badge">{LICENSE_LABELS[book.license]}</text>
        </view>

        <text className="sheet__note">
          Opens the legal source page in the host browser. Deensch1ar does not
          host or scrape the book.
        </text>

        <view className="sheet__actions">
          <view className="button button--ghost" bindtap={onClose}>
            <text className="button__label">Close</text>
          </view>
          <view className="button button--dark" bindtap={() => onOpen(book)}>
            <text className="button__label button__label--light">Open book</text>
          </view>
        </view>
      </view>
    </view>
  );
}
