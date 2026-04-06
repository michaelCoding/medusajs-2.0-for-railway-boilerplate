# The Woodenly Homepage Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the homepage to match The Woodenly brand — content-driven, scene-first, wooden lifestyle aesthetic. Product pages are untouched.

**Architecture:** Modify/replace existing homepage components in-place. Two new components (Moments, QuietMoment). No new data-fetching routes — QuietMoment reuses products already fetched by page.tsx. Static scene data hardcoded in Moments component.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS arbitrary values, Lora font (already loaded), `ScrollReveal` from `@modules/common/components/scroll-reveal`, `LocalizedClientLink` from `@modules/common/components/localized-client-link`, `next/image`.

**Design doc:** `docs/plans/2026-04-06-woodenly-homepage-design.md`

---

## Task 1: Update Hero config and remove hardcoded eyebrow

**Files:**
- Modify: `src/lib/config/home.ts`
- Modify: `src/modules/home/components/hero/index.tsx`

**Step 1: Update heroBannerConfig in home.ts**

Replace the `heroBannerConfig` export with:

```ts
export const heroBannerConfig = {
  headline: 'Live gently. Live woodenly.',
  text: 'A quieter way to live, shaped by wood.',
  cta: {
    text: 'Enter the moment →',
    link: '/store',
  },
  image: {
    url: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=1200&q=80',
    alt: 'Wooden objects in morning light',
  },
}
```

**Step 2: Remove hardcoded "New collection" eyebrow from hero/index.tsx**

Find and delete both `<p>` eyebrow lines (desktop and mobile versions):

```tsx
// DELETE these two lines (one in desktop block, one in mobile block):
<p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-6">
  New collection
</p>
// and:
<p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-4">
  New collection
</p>
```

Also adjust the `mb-8` on the desktop `<h1>` to stay visually balanced — no spacing change needed since eyebrow is gone, but verify it looks right.

**Step 3: Verify build**

```bash
cd d:/workspace/standalone-website/e-commerce/storefront
npm run build 2>&1 | tail -20
```
Expected: no TypeScript errors.

**Step 4: Commit**

```bash
git add src/lib/config/home.ts src/modules/home/components/hero/index.tsx
git commit -m "feat: update Hero to The Woodenly brand — Live gently. Live woodenly."
```

---

## Task 2: Create Moments component (replaces Collections)

**Files:**
- Create: `src/modules/home/components/moments/index.tsx`

**Step 1: Create the file**

```tsx
import Image from 'next/image'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

const scenes = [
  {
    title: 'A Quiet Morning',
    line: 'A slow start, with light and wood.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    link: '/store',
  },
  {
    title: 'Slow Evenings',
    line: 'Where time softens.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    link: '/store',
  },
  {
    title: 'A Gift That Stays',
    line: 'Not just a gift, but a memory.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
    link: '/store',
  },
  {
    title: 'With Your Companion',
    line: 'A shared quiet life.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    link: '/store',
  },
]

export default function Moments() {
  return (
    <section className="content-container py-20 large:py-28">
      <div className="grid grid-cols-1 medium:grid-cols-2 gap-0.5">
        {scenes.map((scene) => (
          <LocalizedClientLink
            key={scene.title}
            href={scene.link}
            className="group relative overflow-hidden block h-[340px] medium:h-[400px]"
          >
            <Image
              src={scene.image}
              alt={scene.title}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {/* text */}
            <div className="absolute bottom-0 left-0 right-0 p-7 large:p-9">
              <h3 className="font-lora text-2xl large:text-3xl text-white leading-snug mb-1.5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                {scene.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {scene.line}
              </p>
              <span className="text-xs uppercase tracking-[0.12em] text-white/60 group-hover:text-white/90 transition-colors duration-300">
                Enter →
              </span>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}
```

**Step 2: Verify TypeScript**

```bash
cd d:/workspace/standalone-website/e-commerce/storefront
npm run build 2>&1 | grep -E "error|Error" | head -20
```
Expected: no errors for new file.

**Step 3: Commit**

```bash
git add src/modules/home/components/moments/index.tsx
git commit -m "feat: add Moments component — 4 scene tiles for homepage"
```

---

## Task 3: Update ExploreBlog title strings

**Files:**
- Modify: `src/modules/home/components/explore-blog/index.tsx`

**Step 1: Change two strings**

```tsx
// Change eyebrow from:
<p className="...">Journal</p>
// to:
<p className="...">Stories</p>

// Change h2 from:
Stories &amp; ideas
// to:
Stories from Woodenly
```

**Step 2: Commit**

```bash
git add src/modules/home/components/explore-blog/index.tsx
git commit -m "feat: rename blog section to Stories from Woodenly"
```

---

## Task 4: Create QuietMoment component (scene-embedded products)

**Files:**
- Create: `src/modules/home/components/quiet-moment/index.tsx`

**Step 1: Create the file**

```tsx
import Image from 'next/image'
import { StoreProduct } from '@medusajs/types'
import { getProductPrice } from '@lib/util/get-product-price'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

interface QuietMomentProps {
  products: StoreProduct[]
  regionId: string
}

export function QuietMoment({ products, regionId }: QuietMomentProps) {
  const display = products.slice(0, 3)
  if (!display.length) return null

  return (
    <section className="py-20 large:py-28 bg-[var(--scandi-bg)]">
      {/* Scene image */}
      <div className="relative h-[55vh] w-full overflow-hidden mb-16">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
          alt="A quiet morning with wood and light"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Narrative text */}
      <div className="content-container text-center mb-16">
        <p className="font-lora italic text-2xl large:text-3xl text-[#1C1C1A] mb-5 max-w-lg mx-auto leading-relaxed">
          The morning light rests quietly on the table.
        </p>
        <p className="text-sm text-[#6B6860] leading-loose max-w-sm mx-auto">
          Nothing rushes here.<br />
          The tea cools slowly, and time feels softer.
        </p>
      </div>

      {/* Embedded products */}
      <div className="content-container">
        <div className="grid grid-cols-1 small:grid-cols-3 gap-8 large:gap-12 mb-12">
          {display.map((product) => (
            <LocalizedClientLink
              key={product.id}
              href={`/products/${product.handle}`}
              className="group text-center"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#F0EDE6] mb-5">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title ?? ''}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#E8E4DC]" />
                )}
              </div>
              {/* Title */}
              <p className="font-lora text-lg text-[#1C1C1A] mb-2 leading-snug">
                {product.title}
              </p>
              {/* Soft CTA */}
              <span className="text-xs uppercase tracking-[0.1em] text-[#6B6860] group-hover:text-[#1C1C1A] transition-colors border-b border-[#6B6860]/40 pb-px">
                See details →
              </span>
            </LocalizedClientLink>
          ))}
        </div>

        {/* Section soft link */}
        <div className="text-center">
          <LocalizedClientLink
            href="/store"
            className="text-xs uppercase tracking-[0.12em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors"
          >
            View the moment →
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Verify TypeScript**

```bash
cd d:/workspace/standalone-website/e-commerce/storefront
npm run build 2>&1 | grep -E "error|Error" | head -20
```

**Step 3: Commit**

```bash
git add src/modules/home/components/quiet-moment/index.tsx
git commit -m "feat: add QuietMoment component — scene narrative with embedded products"
```

---

## Task 5: Rewrite HowWeLive as About Woodenly

**Files:**
- Modify: `src/modules/home/components/how-we-live/index.tsx`

**Step 1: Replace file content entirely**

```tsx
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ScrollReveal } from '@modules/common/components/scroll-reveal'

export function HowWeLive() {
  return (
    <section className="bg-[#F0EDE6] py-20 large:py-32">
      <div className="content-container">
        <div className="grid grid-cols-1 medium:grid-cols-[2fr_1fr] gap-12 large:gap-20 items-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-4">About</p>
            <h2 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] -tracking-[0.02em] mb-6 leading-[1.1]">
              A quieter way to live.
            </h2>
            <p className="text-base text-[#6B6860] leading-relaxed max-w-lg">
              Woodenly is a quiet space where wood, time, and life meet.
              Every object is chosen for its presence — to slow the room,
              and those inside it.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="flex medium:justify-end">
              <LocalizedClientLink
                href="/about-us"
                className="text-xs uppercase tracking-[0.12em] text-[#1C1C1A] border-b border-[#1C1C1A] pb-px hover:text-[#6B6860] hover:border-[#6B6860] transition-colors"
              >
                About us →
              </LocalizedClientLink>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Verify TypeScript**

```bash
cd d:/workspace/standalone-website/e-commerce/storefront
npm run build 2>&1 | grep -E "error|Error" | head -20
```

**Step 3: Commit**

```bash
git add src/modules/home/components/how-we-live/index.tsx
git commit -m "feat: rewrite HowWeLive as About Woodenly — brand statement section"
```

---

## Task 6: Wire everything in page.tsx

**Files:**
- Modify: `src/app/[countryCode]/(main)/page.tsx`

**Step 1: Replace page.tsx**

```tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getProductsList } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import { getAllPosts } from '@lib/data/blog'
import { getBanner } from '@lib/data/cms'
import { heroBannerConfig } from '@lib/config/home'
import { ExploreBlog } from '@modules/home/components/explore-blog'
import Hero from '@modules/home/components/hero'
import { HowWeLive } from '@modules/home/components/how-we-live'
import Moments from '@modules/home/components/moments'
import { QuietMoment } from '@modules/home/components/quiet-moment'
import { ProductCarousel } from '@modules/products/components/product-carousel'
import SkeletonProductsCarousel from '@modules/skeletons/templates/skeleton-products-carousel'

export const metadata: Metadata = {
  title: 'The Woodenly — Live gently. Live woodenly.',
  description: 'Wooden objects for a quieter life.',
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const [{ response: { products } }, region, allPosts, heroBanner] = await Promise.all([
    getProductsList({ pageParam: 0, queryParams: { limit: 9 }, countryCode }),
    getRegion(countryCode),
    getAllPosts(),
    getBanner('hero'),
  ])

  const heroData = heroBanner
    ? {
        headline: heroBanner.headline,
        text: heroBanner.text,
        cta: { text: heroBanner.cta_text, link: heroBanner.cta_link },
        image: { url: heroBanner.image_url, alt: heroBanner.headline },
      }
    : heroBannerConfig

  const posts = allPosts.slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    author: p.author ?? '',
  }))

  return (
    <>
      {/* 1. Hero — brand statement */}
      <Hero data={heroData} />

      {/* 2. Moments — life scenes, not categories */}
      <Moments />

      {/* 3. Stories — content builds trust */}
      {posts.length > 0 && <ExploreBlog posts={posts} />}

      {/* 4. Quiet Moment — scene with embedded products */}
      {products && region && (
        <QuietMoment products={products} regionId={region.id} />
      )}

      {/* 5. Selected Objects — minimal product carousel */}
      {products && region && (
        <Suspense fallback={<SkeletonProductsCarousel />}>
          <ProductCarousel
            products={products}
            regionId={region.id}
            title="Selected Objects"
            viewAll={{ link: '/store', text: 'See all objects' }}
          />
        </Suspense>
      )}

      {/* 6. About Woodenly — brand close */}
      <HowWeLive />
    </>
  )
}
```

Note: `getCollectionsList` import is removed (Moments is static now).

**Step 2: Full build check**

```bash
cd d:/workspace/standalone-website/e-commerce/storefront
npm run build 2>&1 | tail -30
```
Expected: clean build, no TS errors.

**Step 3: Commit**

```bash
git add src/app/[countryCode]/\(main\)/page.tsx
git commit -m "feat: wire Woodenly homepage — Moments, QuietMoment, Selected Objects, About"
```

---

## Verification

After all tasks complete, run the dev server and check each section:

```bash
cd d:/workspace/standalone-website/e-commerce/storefront
npm run dev
```

Checklist:
- [ ] Hero: "Live gently. Live woodenly." — no "New collection" eyebrow
- [ ] Moments: 4 scene tiles with Unsplash images, "Enter →" on hover
- [ ] Stories from Woodenly: renamed blog section
- [ ] Quiet Moment: scene image + italic narrative + 3 products with "See details →"
- [ ] Selected Objects: carousel with renamed title/CTA
- [ ] About Woodenly: two-column brand statement
- [ ] Product pages: unchanged
