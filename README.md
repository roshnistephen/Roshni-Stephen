# Roshni Stephen — Portfolio & Résumé

Personal site for Roshni Stephen — front-end developer & UI expert. It doubles as a
portfolio and a résumé: the same page prints to a clean A4 CV via the "Download résumé"
button (`window.print()` + the print stylesheet at the end of `style.css`).

**Live:** https://rs.lokaai.in/

A dependency-free static site: hand-written HTML, CSS and vanilla JavaScript. No build step,
no framework, no runtime packages.

## Structure

```
index.html                 Single page — all sections and structured data
style.css                  Design tokens + components (see the numbered section map at the top)
main.js                    Nav drawer, scroll state, scroll spy, reveals, project filters,
                           print trigger, hero particles
contact.js                 Contact form validation + FormSubmit submission
manifest.json              PWA manifest
robots.txt / sitemap.xml   Crawling + indexing
assets/img/
  projects/                Responsive project screenshots (640w + 1280w, WebP + JPEG)
  profile/                 Portrait (200/400, WebP + JPEG)
  tech/                    Toolkit icons (96/192, WebP + JPEG)
  og-image.jpg             1200x630 social share card
  icon-*.png               PWA + favicon set
images/                    Original full-size sources — NOT served to visitors
tools/optimize-image.sh    Generates the responsive set for a new project screenshot
```

`images/` holds the untouched originals (~27 MB). They are kept only as sources for
`tools/optimize-image.sh`; the site itself serves the derivatives in `assets/img/`.

## Running locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. Any static server works — there is nothing to compile.

## Adding a project

1. Drop the full-size screenshot into `images/`.
2. Generate the responsive set and print the markup:

   ```bash
   ./tools/optimize-image.sh images/my-new-project.png my-new-project
   ```

3. Paste the printed `<picture>` block into a new card in the `#work` grid in `index.html`,
   copying the surrounding `<article class="project reveal" data-category="…">` wrapper
   from an existing card. Valid categories: `photography`, `creative`, `business`, `ai`.
4. Update the counts that are written into the page by hand:
   - the `<span>` badge on each `.filter` button,
   - the **Live projects** figure in the hero `.stats`,
   - `numberOfItems` and `itemListElement` in the JSON-LD `ItemList`,
   - the project count in the `<meta name="description">` and the `#work` section lead.

Requires ImageMagick (`brew install imagemagick`).

## Conventions

- **Design tokens** live in `:root` at the top of `style.css`. Change a colour, radius,
  shadow or type step there rather than in a component. The palette is sky blue on white:
  `--sky-700` for text and links, `--sky-600` for button fills, `--sky` for accents.
- **Print is a first-class view.** Section 15 of `style.css` turns the page into an A4 CV —
  it hides the chrome, drops the project screenshots to a titled list with URLs, and swaps
  each section's `.eyebrow` in for its `.section__title` so headings read "PROFILE",
  "EXPERIENCE", "SKILLS". Check it after any structural change.
- **Reveal animations** are opt-in: add `class="reveal"` and `main.js` fades the element in
  on scroll. Without JavaScript everything stays visible (the `.js` class on `<html>` gates it).
- **Images** are always `<picture>` with a WebP `<source>` and a JPEG `<img>` fallback, with
  explicit `width`/`height` so nothing shifts while loading.
- **Canonical URL** is `https://rs.lokaai.in/` — it appears in `<link rel="canonical">`,
  the Open Graph tags, the JSON-LD, `sitemap.xml` and `robots.txt`. Change all of them together.

## Notes

- `.htaccess` is an Apache config and has **no effect on GitHub Pages**. It is kept only in case
  the site is ever moved to Apache hosting.
- The contact form posts to FormSubmit and falls back to a `mailto:` link if that request fails.
- The hero particle canvas in `main.js` is decorative: it is skipped entirely under
  `prefers-reduced-motion`, and pauses when the hero scrolls away or the tab is hidden.
- Experience entries carry no start dates — they show "Current" / "2+ years". Add real
  date ranges in the `.entry__period` spans when you have them.
