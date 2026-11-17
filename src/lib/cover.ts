/**
 * The series cover generator. Pure SVG, built at compile time — no images, no service.
 * Backlist Lite ships one house layout, `rule`. (The full Backlist theme adds `band` and `frame` series layouts.)
 * Units are millimetres of the real trim, so a 129×198 B-format and a 117×180 pocket edition
 * keep their own proportions. Audiobooks render square.
 */
export interface CoverInput {
  title: string;
  subtitle?: string;
  authors: string[];
  secondary?: string; // "Translated by Constance Garnett"
  seriesName?: string; // small caps line at the top, e.g. the press name
  seriesNumber?: number;
  bg: string;
  fg: string;
  trim: string; // "129x198"
  breaks?: string; // manual title breaks, "|" separated
  pressName: string;
  square?: boolean;
  label: string; // accessible name
}

const DISPLAY = "'Libre Caslon Display', 'Libre Caslon Text', Georgia, 'Times New Roman', serif";
const TEXT = "'Libre Caslon Text', Georgia, 'Times New Roman', serif";
const SANS = "'Schibsted Grotesk Variable', 'Schibsted Grotesk', 'Helvetica Neue', Arial, sans-serif";

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Rough advance widths for Libre Caslon Display, in em. Good enough to choose a size and break lines. */
function measure(s: string): number {
  let w = 0;
  for (const ch of s) {
    if (ch === ' ') w += 0.24;
    else if (/[A-Z]/.test(ch)) w += /[MW]/.test(ch) ? 0.86 : 0.66;
    else if (/[a-z]/.test(ch)) w += /[mw]/.test(ch) ? 0.72 : /[iljtfr]/.test(ch) ? 0.28 : 0.45;
    else if (/[0-9]/.test(ch)) w += 0.5;
    else w += 0.3;
  }
  return w;
}

function wrap(text: string, breaks: string | undefined, maxEm: number): string[] {
  if (breaks) return breaks.split('|').map((s) => s.trim());
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (measure(t) > maxEm && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Choose a font size so the longest line fits `width`, capped at `max`. */
function fit(lines: string[], width: number, max: number) {
  const longest = Math.max(...lines.map(measure));
  return Math.min(max, width / longest);
}

function textLines(lines: string[], x: number, y: number, size: number, lh: number, attrs: string) {
  return lines.map((l, i) => `<text x="${x}" y="${(y + i * size * lh).toFixed(2)}" font-size="${size.toFixed(2)}" ${attrs}>${esc(l)}</text>`).join('');
}

export function coverSvg(c: CoverInput, opts: { standalone?: boolean; id?: string } = {}): string {
  let [W, H] = c.trim.split('x').map(Number);
  if (c.square) { W = 150; H = 150; }
  const m = Math.round(W * 0.085); // margin
  const inner = W - 2 * m;
  const sq = H / W < 1.2;
  const seriesTag = c.seriesName ? c.seriesName.toUpperCase() : '';
  const num = c.seriesNumber ? String(c.seriesNumber) : '';
  const author = c.authors.join(' & ');
  const titleId = opts.id ? `${opts.id}-t` : undefined;
  let body = '';

  {
    const lines = wrap(c.title, c.breaks, 7.5);
    const size = fit(lines, inner, sq ? 15 : 19);
    const top = m + (sq ? 16 : 26);
    body += `<rect width="${W}" height="${H}" fill="${c.bg}"/>`;
    body += `<text x="${m}" y="${m + 3}" font-family="${SANS}" font-size="3.7" font-weight="600" letter-spacing="0.45" fill="${c.fg}">${esc(seriesTag)}${num ? ` <tspan font-weight="400">${num}</tspan>` : ''}</text>`;
    body += textLines(lines, m - size * 0.04, top + size * 0.8, size, 1.02, `font-family="${DISPLAY}" fill="${c.fg}"`);
    let y = top + size * 0.8 + (lines.length - 1) * size * 1.02;
    if (c.subtitle) { y += size * 0.75 + 2; body += `<text x="${m}" y="${y.toFixed(2)}" font-family="${TEXT}" font-style="italic" font-size="${Math.min(6, size * 0.42).toFixed(2)}" fill="${c.fg}">${esc(c.subtitle)}</text>`; }
    y += 7;
    body += `<rect x="${m}" y="${y.toFixed(2)}" width="${(inner * 0.32).toFixed(2)}" height="0.35" fill="${c.fg}"/>`;
    const aSize = Math.min(7.4, inner / Math.max(measure(author), 1));
    const by = H - m - (c.secondary ? 8 : 2);
    body += `<text x="${m}" y="${by}" font-family="${DISPLAY}" font-size="${aSize.toFixed(2)}" fill="${c.fg}">${esc(author)}</text>`;
    if (c.secondary) body += `<text x="${m}" y="${by + 6.5}" font-family="${SANS}" font-size="3.6" fill="${c.fg}">${esc(c.secondary)}</text>`;
  }

  const ns = opts.standalone ? ' xmlns="http://www.w3.org/2000/svg"' : '';
  const aria = titleId ? ` role="img" aria-labelledby="${titleId}"` : ' role="img"';
  return `<svg${ns} viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"${aria}><title${titleId ? ` id="${titleId}"` : ''}>${esc(c.label)}</title>${body}</svg>`;
}
