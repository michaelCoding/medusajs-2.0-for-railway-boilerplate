# Design: Solace Style & Feature Alignment for e-commerce/storefront

**Date**: 2026-03-29
**Scope**: In-place migration — apply solace-medusa-starter design system and add missing features to e-commerce/storefront

---

## Background

`e-commerce/storefront` is a Next.js 15 + Medusa 2 storefront with basic Tailwind styling via `@medusajs/ui-preset`. `solace-medusa-starter` is a more polished storefront with a full custom design system, dark/light mode, additional content pages, and a blog.

Goal: Make `e-commerce/storefront` visually consistent with solace and functionally aligned (dark mode, blog, content pages), while keeping MeiliSearch and the existing Medusa/data layer intact.

---

## Architecture

### Approach: In-Place Migration (Plan A)

Incrementally upgrade `e-commerce/storefront` in 7 phases. No rewrite from scratch. Existing data layer (MeiliSearch, MinIO, custom API routes, Medusa SDK) is preserved.

---

## Section 1: Design System

### Preset Directory

Create `storefront/preset/` mirroring solace:

```
storefront/preset/
├── plugins/
│   ├── plugin.js        # Registers CSS custom properties via Tailwind plugin
│   └── colors.js        # light/dark mode CSS variable definitions
├── theme/
│   ├── colors.js        # Tailwind color mapping using CSS variables
│   ├── typography.js    # Font-size scale: sm/md/lg/xl/2xl/3xl/4xl/5xl
│   ├── constants.js     # Breakpoints: xsmall(355px) → 2xl(1700px)
│   ├── animations.js    # Keyframes for accordion, fade, slide
│   └── theme.js         # Merges all theme exports
└── preset.js            # Main preset export
```

### Tailwind Config Update

`tailwind.config.js` loads both `@medusajs/ui-preset` and the custom `uiPreset` (for Medusa component compatibility + new design tokens).

### CSS Variables

`globals.css` adds `.light` and `.dark` class blocks with all CSS custom properties:
- `--bg-*`: background tokens
- `--fg-*`: foreground/overlay tokens
- `--content-*`: text color tokens
- `--border-*`: border color tokens

### Utility

`src/lib/util/cn.ts`: `clsx` + `tailwind-merge` combined utility.

---

## Section 2: Dependencies

### New Dependencies

| Package | Purpose |
|---------|---------|
| `cva` | Class Variance Authority — component variant system |
| `tailwind-merge` | Resolve Tailwind class conflicts |
| `clsx` | Conditional class joining |
| `zustand@5` | Cart state management |
| `sonner` | Toast notifications |
| `embla-carousel-react` | Product image gallery + carousels |
| `tailwindcss-animate` | Animation utilities |
| `react-country-flag` | Country flag icons in region selector |
| `next-mdx-remote` | MDX rendering for blog/content |
| `remark-gfm` | GFM markdown support |
| `rehype-highlight` | Code syntax highlighting |

### Upgrades

| Package | From | To |
|---------|------|----|
| `@headlessui/react` | 1.6.1 | 2.2.0 |

### Unchanged

MeiliSearch, Medusa JS SDK, Stripe, PayPal, React Hook Form.

---

## Section 3: Common Components (CVA Rewrite)

All `src/modules/common/components/` rebuilt with CVA variant pattern.

### Button

Variants: `filled` | `ghost` | `tonal` | `text` | `destructive` | `icon`
Sizes: `sm` (h-10) | `md` (h-12)
Uses `rounded-3xl`, design token colors, disabled state via CVA compound variant.

### Input

Floating label animation. Border uses `--border-basic-primary` token. Error state uses `--border-negative`.

### Checkbox / Radio

Use design token colors for checked/unchecked states.

### Modal / Dialog

Upgraded to Headless UI 2.2.0 Dialog API (breaking change from 1.x).

### Accordion

Radix UI Accordion + solace slide animations.

### New Components Added

| Component | Purpose |
|-----------|---------|
| `Heading` | Semantic h1-h6 with font scale |
| `Text` | Text with size/weight variants |
| `Container` | Max-width layout wrapper |
| `Box` | Generic div wrapper |
| `Badge` | Status indicators |
| `Chips` | Tag-style items |
| `Breadcrumbs` | Navigation breadcrumbs |
| `Stepper` | Multi-step flow indicator |
| `Toast` | Notifications via Sonner |
| `ProgressBar` | Linear progress |
| `Menu` | Dropdown menu |

---

## Section 4: Layout Updates

### NavWrapper

- ThemeSwitcher button (light/dark toggle)
- ProfileDropdown (hover menu for account links)
- CartButton aligned to solace style
- Mobile SideMenu upgraded to Headless UI 2.2.0 Dialog

### Footer

Column layout matching solace: Links grouped by section, social icons, bottom legal bar.

### ThemeProvider

New React Context at `src/lib/context/theme-context.tsx`:
- Reads/writes `theme` from localStorage
- Applies `light` or `dark` class to `<html>` element
- Exposes `{ theme, toggleTheme }` via context

### ThemeSwitcher Component

Sun/Moon icon toggle button, placed in Nav.

---

## Section 5: Feature Component Style Updates

Style-only updates (no logic changes):

| Component | Change |
|-----------|--------|
| `ProductPreview` | Card uses design token colors, hover state |
| `ImageGallery` | Replace current gallery with Embla Carousel |
| `ProductCarousel` | Related products with Embla horizontal scroll |
| `CartDropdown` / `CartTotals` | Updated colors and spacing |
| Checkout steps | Use new Stepper component |
| `LineItem*` components | Updated to use design tokens |

---

## Section 6: Blog Module (MDX)

### Content Storage

```
storefront/content/blog/
  ├── getting-started.mdx
  └── ...more posts
```

Each MDX file has frontmatter: `title`, `date`, `slug`, `excerpt`, `coverImage`, `author`.

### Module Structure

```
src/modules/blog/
  ├── components/
  │   ├── blog-card/       # Post preview card
  │   └── blog-post/       # Full post renderer
  └── templates/
      ├── blog-list/        # Blog listing template
      └── blog-detail/      # Blog detail template
```

### Pages

```
src/app/[countryCode]/(main)/blog/
  ├── page.tsx              # List all posts (SSG)
  └── [slug]/page.tsx       # Individual post (SSG with generateStaticParams)
```

Data layer: `src/lib/data/blog.ts` — reads MDX from filesystem, parses frontmatter with `gray-matter`.

---

## Section 7: Static Content Pages

### Content Files

```
storefront/content/
  ├── about-us.mdx
  ├── faq.mdx
  ├── privacy-policy.mdx
  └── terms-and-conditions.mdx
```

### Pages

```
src/app/[countryCode]/(main)/
  ├── about-us/page.tsx
  ├── faq/page.tsx
  ├── privacy-policy/page.tsx
  └── terms-and-conditions/page.tsx
```

Each page renders its MDX content with shared `ContentTemplate` component. Footer updated with links to these pages.

---

## Implementation Plan (7 Phases)

| Phase | Work | Files Affected |
|-------|------|---------------|
| 1 | Design system: preset/ + tailwind.config + globals.css + cn util | ~15 files (new) |
| 2 | Dependency installation | package.json |
| 3 | Theme system: ThemeProvider + ThemeSwitcher | 2 new files |
| 4 | Common components CVA rewrite | ~15 component files |
| 5 | Layout: Nav + Footer + SideMenu | ~5 files |
| 6 | Feature components style refresh | ~10 files |
| 7 | New pages: Blog + content pages | ~20 new files |

---

## Key Constraints

- **MeiliSearch kept**: Search data layer unchanged, only search UI components restyled
- **No Strapi**: Blog/content uses static MDX files
- **React 19 compat**: All new packages verified compatible with React 19
- **Medusa UI compat**: `@medusajs/ui` components still work alongside custom preset
- **No logic changes in Phase 6**: Feature components are style-only updates
