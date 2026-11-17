/** Series colours. Covers and the 8px series swatch only — never UI backgrounds. */
export const palette = {
  green: '#1E5B43',
  slate: '#38475A',
  brick: '#9A3B26',
  ochre: '#C9962F',
  sand: '#E3D6BC',
  rose: '#D9A6A0',
} as const;
export type PaletteName = keyof typeof palette;
export const paletteNames = Object.keys(palette) as [PaletteName, ...PaletteName[]];

const LIGHT_TYPE = '#F2EDE0';
const DARK_TYPE = '#141414';

function lum(hex: string): number {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
/** Resolve a palette name or a raw hex to { bg, fg } with whichever type colour reads better. */
export function coverColours(colour: string): { bg: string; fg: string; ratio: number } {
  const bg = colour in palette ? palette[colour as PaletteName] : colour;
  const light = contrast(bg, LIGHT_TYPE), dark = contrast(bg, DARK_TYPE);
  return light >= dark ? { bg, fg: LIGHT_TYPE, ratio: light } : { bg, fg: DARK_TYPE, ratio: dark };
}
