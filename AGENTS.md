# AGENTS.md — Astro Backlist Lite

- Astro 7 (static), Tailwind CSS 4, TypeScript strict, Node 22. No client JavaScript.
- Content: `src/content/books/*.md` (schema in `src/content.config.ts`; ISBN-13 checksum enforced) and `src/press.config.ts`. Pages: `/`, `/books/[slug]/`, 404.
- Covers: `src/lib/cover.ts` draws an SVG at the book's trim proportion (one `rule` layout). A real `cover` image overrides it.
- Design: white paper, Libre Caslon Display/Text, Schibsted Grotesk; tokens `bg-paper`, `bg-paper-2`, `text-ink`, `text-ink-2`, `border-line`, `text-accent`. Radius 0, no shadows, no gradients, no stock photos or AI imagery. `.tnum` only on ISBNs, dates and page counts.
- Demo press is fictional; authors and excerpts are real public-domain material. Never add invented living people or invented reviews.
- Before finishing: `npx astro check` (0/0/0) and `npm run build`.
