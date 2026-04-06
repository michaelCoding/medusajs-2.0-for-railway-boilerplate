# The Woodenly — Homepage Redesign Design

**Date:** 2026-04-06  
**Scope:** Homepage (content page) only. Product pages remain independent standard e-commerce.  
**Brand:** The Woodenly — wooden lifestyle objects, content-driven commerce.  
**Slogan:** Live gently. Live woodenly.

---

## Brand Principles

- Sell life moments (scenes), not products
- No "Buy Now" — use "Enter", "Explore", "See details"
- No white-background product shots on homepage
- Products appear naturally embedded in content, never pushed

---

## Homepage Structure (top → bottom)

```
1. Hero
2. Moments          ← replaces Collections
3. Stories from Woodenly   ← replaces "Stories & ideas"
4. Quiet Moment     ← NEW: scene-embedded products
5. Selected Objects ← ProductCarousel, renamed
6. About Woodenly   ← replaces HowWeLive
```

---

## Component Designs

### 1. Hero

**File:** `src/modules/home/components/hero/index.tsx`  
**Config:** `src/lib/config/home.ts`

Changes:
- Remove hardcoded "New collection" eyebrow text from the component
- Update `heroBannerConfig` defaults:
  - `headline`: "Live gently. Live woodenly."
  - `text`: "A quieter way to live, shaped by wood."
  - `cta.text`: "Enter the moment →"
  - `cta.link`: "/store"
  - `image.url`: Unsplash wooden/natural lifestyle image

Layout unchanged (55/45 split desktop, stacked mobile).

---

### 2. Moments

**File:** `src/modules/home/components/moments/index.tsx` (new)

Static 4-scene grid replacing the data-driven Collections component.

```ts
const scenes = [
  {
    title: 'A Quiet Morning',
    line: 'A slow start, with light and wood.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', // wooden table morning
    link: '/collections/quiet-morning',
  },
  {
    title: 'Slow Evenings',
    line: 'Where time softens.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', // warm interior evening
    link: '/collections/slow-evenings',
  },
  {
    title: 'A Gift That Stays',
    line: 'Not just a gift, but a memory.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80', // wrapped gift wooden
    link: '/collections/gifts',
  },
  {
    title: 'With Your Companion',
    line: 'A shared quiet life.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80', // dog wooden bowl
    link: '/collections/companion',
  },
]
```

Layout:
- Desktop: 2×2 grid, each cell ~350px tall, image fills cell
- Bottom gradient overlay: from black/40 → transparent
- Text stack at bottom: eyebrow (scene index) → title (Lora) → line (small muted) → "Enter →"
- Hover: subtle scale(1.03), text slides up

Section header: none (the tiles speak for themselves)

---

### 3. Stories from Woodenly (ExploreBlog)

**File:** `src/modules/home/components/explore-blog/index.tsx`

Changes only:
- eyebrow: "Journal" → "Stories"
- h2: "Stories & ideas" → "Stories from Woodenly"
- "View all →" link stays as-is

---

### 4. Quiet Moment (new — scene-embedded products)

**File:** `src/modules/home/components/quiet-moment/index.tsx` (new)

A full-width atmospheric section embedding products inside a scene narrative.

Props:
```ts
interface QuietMomentProps {
  products: StoreProduct[]
  regionId: string
}
```

Layout:
```
[Full-width image — wooden morning table, 60vh]

  Moment text (centered, italic Lora, max-w-lg):
  "The morning light rests quietly on the table."

  Story text (small muted, centered, max-w-sm):
  "Nothing rushes here.
   The tea cools slowly, and time feels softer."

[3-column product row — max 3 products]
  Each product: thumbnail (square, natural bg) + title + "See details →"
  No price displayed (弱化电商感)

[View the moment → ] soft link to /store
```

Background: `--scandi-bg` (#F7F4EF), no border, breathes with whitespace.

---

### 5. Selected Objects (ProductCarousel)

**File:** `src/modules/products/components/product-carousel/index.tsx` — no change  
**Change in:** `page.tsx` only

- `title`: "Our picks" → "Selected Objects"
- `viewAll.text`: "View all" → "See all objects"

---

### 6. About Woodenly (replaces HowWeLive)

**File:** `src/modules/home/components/how-we-live/index.tsx`

Rewrite content entirely. Keep filename and export name `HowWeLive` to avoid import changes.

Layout — two-column on desktop, stacked on mobile:
```
Left (2/3):
  eyebrow: "About"
  h2 (Lora): "A quieter way to live."
  body: "Woodenly is a quiet space where wood, time, and life meet.
         Every object is chosen for its presence — to slow the room,
         and those inside it."

Right (1/3, centered):
  [About us →]  (underline link, small caps)
```

Background: `#F0EDE6` (scandi-bg-card), generous padding.

---

## page.tsx Changes

```tsx
// metadata
title: 'The Woodenly — Live gently. Live woodenly.'
description: 'Wooden objects for a quieter life.'

// section order
<Hero />
<Moments />                     // replaces <Collections />
<ExploreBlog />
<QuietMoment products regionId />  // new
<ProductCarousel title="Selected Objects" viewAll={{ text: 'See all objects', link: '/store' }} />
<HowWeLive />                   // rewritten as AboutWoodenly
```

---

## Files Modified

| File | Change |
|------|--------|
| `src/lib/config/home.ts` | Update `heroBannerConfig` defaults |
| `src/modules/home/components/hero/index.tsx` | Remove hardcoded "New collection" eyebrow |
| `src/modules/home/components/moments/index.tsx` | **New** — 4 scene grid |
| `src/modules/home/components/explore-blog/index.tsx` | Rename title strings |
| `src/modules/home/components/quiet-moment/index.tsx` | **New** — scene product embed |
| `src/modules/home/components/how-we-live/index.tsx` | Rewrite as About Woodenly |
| `src/app/[countryCode]/(main)/page.tsx` | Wire new components, update metadata |

---

## Out of Scope

- Product pages — no changes
- Navigation, footer, other pages — no changes
- CMS integration for Moments — static for now
- Actual wooden product photography — use Unsplash placeholders
