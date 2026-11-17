/** ISBN-13 helpers. Used by the content schema (build fails on a bad checksum) and by the UI. */
export function isbnDigits(raw: string): string {
  return raw.replace(/[^0-9Xx]/g, '');
}

export function isValidIsbn13(raw: string): boolean {
  const d = isbnDigits(raw);
  if (!/^97[89]\d{10}$/.test(d)) return false;
  const sum = d.slice(0, 12).split('').reduce((s, c, i) => s + Number(c) * (i % 2 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === Number(d[12]);
}

/** Display form: the hyphenated string if the publisher supplied one, otherwise the 13 digits. */
export function formatIsbn(isbn: string, hyphenated?: string): string {
  return hyphenated ?? isbnDigits(isbn);
}
