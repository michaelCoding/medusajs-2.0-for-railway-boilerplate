# Storefront Redesign — Design Document
_2026-04-04_

## Overview

Redesign the Medusa Next.js storefront for a lifestyle/home goods brand. Goal: modern, fashionable Scandinavian minimalism aesthetic with a content-driven commerce model. Approach B: rewrite key page components without touching the existing Medusa preset token layer.

---

## Design Language

### Color Palette
| Role | Value | Usage |
|------|-------|-------|
| Background | `#F7F4EF` | Page background (warm linen white) |
| Primary text | `#1C1C1A` | Headings, body |
| Secondary text | `#6B6860` | Captions, metadata |
| Accent — Sage | `#7A9E7E` | Tags, pills, highlights |
| Accent — Terracotta | `#C07B5A` | CTAs, hover states |
| Border / Divider | `#E8E4DC` | Subtle separators |
| Inline card bg | `#F0EDE6` | InlineProductCard background |
| Dark block | `#1C1C1A` | Mid Banner background |

### Typography
- **Display / Headings**: Lora (Google Fonts, Serif) — thin weight, italic for editorial moments
- **Body / UI**: Inter (already in project)
- **Max heading size**: 72px / 4.5rem on desktop
- **Line height**: 1.15 for headings, 1.6 for body
- **Letter spacing**: headings `-0.02em`, UI labels `0.08em` uppercase

### Spacing
- Section vertical padding: `py-20` mobile → `py-32` desktop
- Content max-width: `max-w-5xl` centered
- Generous internal whitespace, content never feels crowded

### Visual Principles
- No border radius on buttons (`rounded-none`)
- No card shadows — use background color contrast instead
- Images: full-bleed, object-cover, no borders
- Dividers: 1px `#E8E4DC` only, used sparingly

---

## Page Layouts

### Navigation
- Single row: Brand name (Lora) left / nav links center (wide letter-spacing) / Search + Bag icons right
- Background `#F7F4EF`; scrolled state: `backdrop-blur` + `border-b border-[#E8E4DC]`, transition 300ms
- Mobile: hamburger → full-screen overlay with large nav items

### Home Page — Section Order
```
1. Hero (story-first, two-column)
2. Collections grid (asymmetric, 1 large + 2 small)
3. Blog Preview — 3 cards with linked product
4. Product Carousel ("Our Picks")
5. "How we live" lifestyle section (image + text, no products)
6. Footer
```

#### Hero
- Desktop: 55% full-height image (lifestyle) | 45% vertically centered text
- Headline: Lora 72px, sub: Inter 18px, CTA: ghost button (no fill, `border border-[#1C1C1A]`)
- Mobile: image 60vh top, text below

#### Collections Grid
- 3 tiles, no gaps, full-bleed
- Layout: `grid-cols-2 grid-rows-2` where tile[0] spans `row-span-2`
- Hover: collection title slides up from bottom via `translateY`, no opacity fade

#### Blog Preview (3 cards)
- Each card: image + sage pill category tag + Lora title + date
- Bottom of each card: 1 related product thumbnail + name + "Featured in this article →"
- "Read more" text link (no button) top-right

#### Product Carousel
- Header: "Our Picks" Lora italic left / "View all →" small right
- Cards: image 75% height, product name + price below, no border-radius
- Hover: `scale-105` on image, `Quick add` text appears

#### "How we live" Section
- Full-width, alternating image/text 2–3 rows
- Pure lifestyle content, no direct product links — brand story building

### Blog List Page
- First post: full-width hero image with title overlaid (gradient overlay)
- Rest: 2-column card grid

### Blog Detail Page
- Content width: `max-w-2xl` centered
- `<InlineProductCard>` component embeds product mid-article:
  ```
  ┌───────────────────────────────────────┐
  │ [120px image]  Product name           │
  │                ¥ Price                │
  │                [+ Add to bag] ghost   │
  └───────────────────────────────────────┘
  ```
  Background `#F0EDE6`, no shadow, full-width within article column

### Product List Page
- Horizontal pill filters (replace existing dropdown)
- Grid: 3-col desktop / 2-col mobile, image-dominant cards
- Hover: "Quick add" text button appears over image

### Product Detail Page
- Left: image gallery (main full-height + vertical thumbnail strip left)
- Right: brand label (small caps) → product name (Lora) → price → size pills → "Add to bag" (full-width solid)
- Below fold: "How to use / Style guide" content section (alternating image + text steps, optional inline product cards per step)

### Footer
- 4-column grid on desktop: Brand story blurb | Shop links | Content links | Newsletter signup
- Background `#1C1C1A`, text `#F7F4EF`
- Top border: 1px `#E8E4DC`

---

## Content-Commerce Integration Patterns

### 1. Blog → Inline Product Card
MDX articles can embed `<InlineProductCard handle="product-handle" />` at any point in the article body. Component fetches product data client-side, displays image + name + price + add-to-cart.

### 2. Blog Card → Related Product
Each blog list/preview card shows 1 featured product (sourced from post frontmatter field `featuredProduct`). Shown as small thumbnail + "Featured in this article →" link.

### 3. Product Detail → How to Use
Below the product information panel, an optional `HowToUseSection` renders step-by-step lifestyle content. Each step can include an optional related product card. Sourced from MDX or CMS content.

---

## Interaction & Animation Principles

| Pattern | Spec |
|---------|------|
| Scroll entrance | `opacity 0→1` + `translateY(20px→0)`, 0.6s ease-out, 100ms stagger between items |
| Image hover | `scale(1.04)`, 0.5s ease, on product + collection tiles |
| Button hover | Background fill from left (clip-path or pseudo-element), 0.3s |
| Nav scroll | Transparent → `#F7F4EF` + bottom border, 300ms, triggers at 80px scroll |
| Cart drawer | Slides in from right `translateX(100%→0)`, backdrop-blur overlay |
| No bounce/spring | All easing: `ease-out` or `cubic-bezier(0.16, 1, 0.3, 1)` — calm, not playful |

---

## Scope (Approach B)

Files to create/modify (no changes to `preset/` or Medusa config):

- `src/styles/globals.css` — add Lora font import + new CSS custom properties for redesign colors
- `src/modules/layout/templates/nav/` — full rewrite
- `src/modules/layout/templates/footer/` — full rewrite
- `src/modules/home/components/hero/` — full rewrite
- `src/modules/home/components/collections/` — full rewrite
- `src/modules/home/components/explore-blog/` — full rewrite
- `src/modules/home/components/how-we-live/` — new component
- `src/modules/products/components/product-carousel/` — reskin
- `src/modules/products/components/product-tile/` — reskin
- `src/modules/products/components/product-preview/` — reskin
- `src/modules/products/templates/` — reskin
- `src/modules/blog/components/blog-card/` — full rewrite
- `src/modules/blog/templates/blog-list/` — full rewrite
- `src/modules/blog/templates/blog-detail/` — full rewrite
- `src/modules/blog/components/inline-product-card/` — new component
- `src/modules/store/templates/` — reskin (pill filters)
- `src/app/[countryCode]/(main)/page.tsx` — update section order
