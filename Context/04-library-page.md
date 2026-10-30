# 04 · Library Page (Book Store) + Daily Philosopher Thoughts

> Name suggestion: **Library**. It is not a shop: everything is **free and legal**.

## 1. Purpose
Browse free books by life topic, and read one philosopher thought per day for 7 days.

## 2. Wireframe

```
┌──────────────────────────────┐
│ Library                  🔍   │
│ [All][Self-control][Finance]… │ ← category chips (scroll)
│ ┌────┐ ┌────┐ ┌────┐          │
│ │cover│ │cover│ │cover│       │ ← grid, 3 columns
│ │title│ │title│ │title│       │
│ └────┘ └────┘ └────┘          │
│ Thought of the day  (Day 1/7) │
│ ┌──────────────────────────┐ │
│ │ "quote"                   │ │
│ │ — Marcus Aurelius  [Copy] │ │
│ └──────────────────────────┘ │
│ Sources: Gutenberg · OpenStax…│
└──────────────────────────────┘
```
Tap a book → detail sheet: cover, author, short description, source badge, **Open** (opens the legal source URL in the in-app browser).

## 3. Categories you asked for

| Category | Suggested free, legal sources |
|---|---|
| Self-control | Public-domain classics on Project Gutenberg / Standard Ebooks (Stoic works: Marcus Aurelius, Seneca, Epictetus) |
| Finance path | Public-domain finance books on Gutenberg; OpenStax *Principles of Finance* |
| Economics | OpenStax *Principles of Economics*, other open textbooks |
| Romantic relationship | Open-access psychology / relationship textbooks, public-domain essays |
| Sex (education) | Health-education material from open textbooks and public health bodies. **18+ gate**, factual tone only |
| Mysterious | Public-domain mystery and the unexplained classics on Gutenberg |
| Science | OpenStax, Wikibooks, Gutenberg classics |
| Human body | OpenStax *Anatomy & Physiology* |
| Diseases | OpenStax *Microbiology*, public health open resources |
| Others | Open Library / Internet Archive items marked free to borrow or public domain |
| **Bible source** | eBible.org, Project Gutenberg Bible editions, Bible translations in the public domain |
| *(bonus)* Islamic source | Quran.com, Sunnah.com (link-outs) |

Verify licences per book. Only list titles that are public domain or openly licensed.

## 4. Data model

```ts
interface Book {
  id: string;
  title: string;
  author: string;
  category: 'self-control'|'finance'|'economics'|'relationship'|'sex-education'
          |'mysterious'|'science'|'human-body'|'diseases'|'bible'|'others';
  coverUrl: string;          // or bundled asset
  sourceName: 'Gutenberg'|'OpenStax'|'OpenLibrary'|'eBible'|'Other';
  sourceUrl: string;         // direct legal page
  license: 'public-domain'|'CC-BY'|'CC-BY-SA'|'other-open';
  adultOnly?: boolean;       // true for sex-education + some relationship titles
}
```
Start with a bundled `books.json` (30–60 hand-checked titles). Later: fetch Open Library / Gutenberg catalogues.

## 5. Daily life-philosopher thoughts (7 days)

Paraphrased in simple words (original public-domain translations may be swapped in; verify exact wording before showing quotation marks).

| Day | Philosopher | Thought |
|---|---|---|
| 1 | Marcus Aurelius | You control your own mind, not outside events. Realise this and you find strength. |
| 2 | Seneca | We suffer more in imagination than in reality. |
| 3 | Epictetus | It is not things that upset us, but our opinions about them. |
| 4 | Socrates | A life that is never examined is not worth living. |
| 5 | Confucius | It does not matter how slowly you go, as long as you do not stop. |
| 6 | Aristotle | We become what we repeatedly do. Excellence is a habit. |
| 7 | Lao Tzu | A journey of a thousand miles begins with a single step. |

Each card: thought, name, one-line "Try this today" action, **Copy** button (same component as ayah card).

## 6. Acceptance checklist
- [ ] Category chips filter the grid
- [ ] Every book shows a source badge and opens a legal URL
- [ ] 18+ gate before showing adult-only items (remember choice)
- [ ] Bible category present
- [ ] 7 philosopher cards with Copy
- [ ] Offline: book list and thoughts work without network (covers may be placeholders)
