import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { isValidIsbn13, isbnDigits } from './lib/isbn';
import { paletteNames } from './lib/palette';

/** One file per book, one edition per book. The Markdown body is the description. */
const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    author: z.string(), // "Anton Chekhov"
    credit: z.string().optional(), // a second credit line, e.g. "Translated by Constance Garnett"
    status: z.enum(['forthcoming', 'new', 'in-print', 'out-of-print']).default('in-print'), // set by hand in Lite
    format: z.enum(['hardcover', 'paperback', 'ebook', 'audiobook']).default('paperback'),
    isbn: z.string().superRefine((v, ctx) => { if (!isValidIsbn13(v)) ctx.addIssue({ code: 'custom', message: `ISBN-13 "${v}" is not valid — check the last (check) digit` }); }).transform(isbnDigits),
    pubDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'use YYYY-MM-DD'),
    pages: z.number().int().positive().optional(),
    trim: z.string().regex(/^\d{2,3}x\d{2,3}$/, 'WIDTHxHEIGHT in mm').default('129x198'),
    price: z.number().nonnegative().optional(),
    currency: z.string().length(3).default('USD'),
    buyUrl: z.url().optional(),
    buyLabel: z.string().default('Buy from a bookshop'),
    coverColour: z.union([z.enum(paletteNames), z.string().regex(/^#[0-9A-Fa-f]{6}$/)]).default('green'),
    coverBreaks: z.string().optional(),
    cover: image().optional(),
    excerpt: z.object({ text: z.string(), source: z.string() }).optional(),
  }),
});
export const collections = { books };
