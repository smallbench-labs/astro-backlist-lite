import { getCollection, type CollectionEntry } from 'astro:content';
export type Book = CollectionEntry<'books'>;
export const statusLabel = { forthcoming: 'Forthcoming', new: 'New', 'in-print': 'In print', 'out-of-print': 'Out of print' } as const;
export const formatLabel = { hardcover: 'Hardcover', paperback: 'Paperback', ebook: 'Ebook', audiobook: 'Audiobook' } as const;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const fmtDate = (ymd: string) => { const [y, m, d] = ymd.split('-').map(Number); return `${d} ${months[m - 1]} ${y}`; };
export const fmtMonth = (ymd: string) => { const [y, m] = ymd.split('-').map(Number); return `${months[m - 1]} ${y}`; };
const symbols: Record<string, string> = { USD: '$', GBP: '£', EUR: '€', CAD: 'C$', AUD: 'A$' };
export const fmtPrice = (n: number, cur: string) => `${symbols[cur] ?? cur + ' '}${n.toFixed(2)}`;
/** Forthcoming first (soonest first), then newest first. */
export async function allBooks() {
  const books = await getCollection('books');
  return [
    ...books.filter((b) => b.data.status === 'forthcoming').sort((a, b) => a.data.pubDate.localeCompare(b.data.pubDate)),
    ...books.filter((b) => b.data.status !== 'forthcoming').sort((a, b) => b.data.pubDate.localeCompare(a.data.pubDate)),
  ];
}
