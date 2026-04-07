# Storefront Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the Medusa Next.js storefront to a Scandinavian minimalist lifestyle brand aesthetic with content-driven commerce patterns.

**Architecture:** Approach B — rewrite key page components without touching the existing Medusa preset token layer (`preset/`). New components use inline Tailwind arbitrary values and a small set of new CSS custom properties added to `globals.css`. Font Lora is loaded via `next/font/google` in `app/layout.tsx`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, embla-carousel-react, Medusa.js, `@modules/common/` components (Box, Container, Heading, Text, Button, LocalizedClientLink).

**Design reference:** `docs/plans/2026-04-04-storefront-redesign-design.md`

---

## Task 1: Design Foundation — Fonts & CSS Variables

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/styles/globals.css`

**Step 1: Add Lora font via next/font/google in layout.tsx**

Replace `src/app/layout.tsx` with:

```tsx
import { getBaseURL } from '@lib/util/env'
import { Metadata } from 'next'
import { ThemeProvider } from '@modules/common/components/theme-provider'
import { Toaster } from 'sonner'
import { Lora } from 'next/font/google'
import 'styles/globals.css'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={lora.variable}>
      <body className="text-basic-primary bg-[#F7F4EF]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Toaster position="bottom-right" offset={65} closeButton />
          <main className="relative">{props.children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Step 2: Add redesign CSS variables to globals.css**

Append to the end of `src/styles/globals.css`:

```css
/* ── Scandi Redesign Tokens ─────────────────────── */
:root {
  --scandi-bg: #F7F4EF;
  --scandi-bg-card: #F0EDE6;
  --scandi-fg: #1C1C1A;
  --scandi-fg-muted: #6B6860;
  --scandi-border: #E8E4DC;
  --scandi-sage: #7A9E7E;
  --scandi-terra: #C07B5A;
  --scandi-dark: #1C1C1A;
}

.font-lora {
  font-family: var(--font-lora), Georgia, serif;
}

/* Scroll reveal — start hidden, JS adds .revealed */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

**Step 3: Verify build passes**

```bash
cd /d/workspace/standalone-website/e-commerce/storefront
npm run build 2>&1 | tail -20
```
Expected: no TypeScript errors. (May warn about env vars — ignore those.)

**Step 4: Commit**

```bash
git add src/app/layout.tsx src/styles/globals.css
git commit -m "feat: add Lora font and Scandi redesign CSS tokens"
```

---

## Task 2: ScrollReveal Utility Component

A lightweight client component that uses IntersectionObserver to add `.revealed` class on scroll entry. Used by all sections.

**Files:**
- Create: `src/modules/common/components/scroll-reveal/index.tsx`

**Step 1: Create the component**

```tsx
'use client'

import { useEffect, useRef, ReactNode } from 'react'

export function ScrollReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('revealed'), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/common/components/scroll-reveal/index.tsx
git commit -m "feat: add ScrollReveal utility component"
```

---

## Task 3: Navigation Rewrite

**Files:**
- Modify: `src/modules/layout/templates/nav/index.tsx`
- Modify: `src/modules/layout/templates/nav/nav-content.tsx`

**Step 1: Rewrite nav/index.tsx**

```tsx
import { listCategories } from '@lib/data/categories'
import { getCollectionsList } from '@lib/data/collections'
import NavContent from './nav-content'

export default async function NavWrapper({ countryCode }: { countryCode: string }) {
  const [productCategories, { collections }] = await Promise.all([
    listCategories(),
    getCollectionsList(),
  ])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E8E4DC] bg-[#F7F4EF]/90 backdrop-blur-sm transition-all duration-300">
      <div className="content-container flex items-center justify-between h-16 medium:h-20">
        <NavContent
          productCategories={productCategories ?? []}
          collections={collections ?? []}
          countryCode={countryCode}
        />
      </div>
    </nav>
  )
}
```

**Step 2: Rewrite nav-content.tsx**

```tsx
'use client'

import { useState } from 'react'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import NavActions from './nav-actions'

export default function NavContent({
  productCategories,
  collections,
  countryCode,
}: {
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
  countryCode: string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Brand */}
      <LocalizedClientLink
        href="/"
        className="font-lora text-xl tracking-tight text-[#1C1C1A]"
      >
        Solace
      </LocalizedClientLink>

      {/* Desktop nav links */}
      <div className="hidden medium:flex items-center gap-10">
        {collections.slice(0, 4).map((c) => (
          <LocalizedClientLink
            key={c.id}
            href={`/collections/${c.handle}`}
            className="text-sm uppercase tracking-[0.08em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors duration-200"
          >
            {c.title}
          </LocalizedClientLink>
        ))}
        <LocalizedClientLink
          href="/blog"
          className="text-sm uppercase tracking-[0.08em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors duration-200"
        >
          Journal
        </LocalizedClientLink>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <NavActions />
        {/* Mobile hamburger */}
        <button
          className="medium:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-5 h-px bg-[#1C1C1A]" />
          <span className="block w-5 h-px bg-[#1C1C1A]" />
          <span className="block w-3 h-px bg-[#1C1C1A]" />
        </button>
      </div>

      {/* Mobile fullscreen overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#F7F4EF] flex flex-col p-8">
          <button
            className="self-end text-[#1C1C1A] text-2xl mb-12"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
          <nav className="flex flex-col gap-8">
            {collections.slice(0, 4).map((c) => (
              <LocalizedClientLink
                key={c.id}
                href={`/collections/${c.handle}`}
                className="font-lora text-3xl text-[#1C1C1A]"
                onClick={() => setMobileOpen(false)}
              >
                {c.title}
              </LocalizedClientLink>
            ))}
            <LocalizedClientLink
              href="/blog"
              className="font-lora text-3xl text-[#1C1C1A]"
              onClick={() => setMobileOpen(false)}
            >
              Journal
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              className="font-lora text-3xl text-[#1C1C1A]"
              onClick={() => setMobileOpen(false)}
            >
              Shop All
            </LocalizedClientLink>
          </nav>
        </div>
      )}
    </>
  )
}
```

**Step 3: Verify build**

```bash
npm run build 2>&1 | grep -E "error|Error" | head -10
```

**Step 4: Commit**

```bash
git add src/modules/layout/templates/nav/
git commit -m "feat: rewrite nav to Scandi minimal style"
```

---

## Task 4: Footer Rewrite

**Files:**
- Modify: `src/modules/layout/templates/footer/index.tsx`

**Step 1: Rewrite footer**

```tsx
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1A] text-[#F7F4EF]">
      <div className="content-container py-16 medium:py-20">
        <div className="grid grid-cols-1 gap-12 medium:grid-cols-4">
          {/* Brand blurb */}
          <div className="medium:col-span-1">
            <p className="font-lora text-xl mb-4">Solace</p>
            <p className="text-sm text-[#F7F4EF]/60 leading-relaxed max-w-[220px]">
              Thoughtfully made objects for a slower, more considered life.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-[#F7F4EF]/40 mb-6">Shop</p>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/store', label: 'All Products' },
                { href: '/categories', label: 'Categories' },
                { href: '/collections', label: 'Collections' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <LocalizedClientLink
                    href={href}
                    className="text-sm text-[#F7F4EF]/70 hover:text-[#F7F4EF] transition-colors duration-200"
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Content */}
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-[#F7F4EF]/40 mb-6">Journal</p>
            <ul className="flex flex-col gap-3">
              {[
                { href: '/blog', label: 'Stories' },
                { href: '/about-us', label: 'About Us' },
                { href: '/faq', label: 'FAQ' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <LocalizedClientLink
                    href={href}
                    className="text-sm text-[#F7F4EF]/70 hover:text-[#F7F4EF] transition-colors duration-200"
                  >
                    {label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-[#F7F4EF]/40 mb-6">Stay in touch</p>
            <p className="text-sm text-[#F7F4EF]/60 mb-4 leading-relaxed">
              Seasonal notes on living well.
            </p>
            <form className="flex gap-0" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent border border-[#F7F4EF]/20 px-3 py-2 text-sm text-[#F7F4EF] placeholder-[#F7F4EF]/30 focus:outline-none focus:border-[#F7F4EF]/60"
              />
              <button
                type="submit"
                className="border border-l-0 border-[#F7F4EF]/20 px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#F7F4EF]/70 hover:bg-[#F7F4EF]/10 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#F7F4EF]/10">
        <div className="content-container py-5 flex flex-col medium:flex-row items-start medium:items-center justify-between gap-3">
          <p className="text-xs text-[#F7F4EF]/30">
            © {new Date().getFullYear()} Solace. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { href: '/privacy-policy', label: 'Privacy' },
              { href: '/terms-and-conditions', label: 'Terms' },
            ].map(({ href, label }) => (
              <LocalizedClientLink
                key={href}
                href={href}
                className="text-xs text-[#F7F4EF]/30 hover:text-[#F7F4EF]/60 transition-colors"
              >
                {label}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/layout/templates/footer/index.tsx
git commit -m "feat: rewrite footer to dark Scandi style with newsletter"
```

---

## Task 5: Hero Rewrite

**Files:**
- Modify: `src/modules/home/components/hero/index.tsx`

**Step 1: Rewrite the Hero component**

```tsx
import Image from 'next/image'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

type HeroConfig = {
  headline: string
  text: string
  cta: { text: string; link: string }
  image: { url: string; alt: string }
}

const Hero = ({ data }: { data: HeroConfig }) => {
  return (
    <section className="w-full">
      {/* Desktop: two-column */}
      <div className="hidden medium:grid medium:grid-cols-[55fr_45fr] min-h-[600px] large:min-h-[700px]">
        {/* Image column */}
        <div className="relative overflow-hidden">
          <Image
            src={data.image.url}
            alt={data.image.alt}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Text column */}
        <div className="flex flex-col justify-center px-12 large:px-20 py-16 bg-[#F7F4EF]">
          <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-6">
            New collection
          </p>
          <h1 className="font-lora text-5xl large:text-6xl leading-[1.1] text-[#1C1C1A] mb-8 -tracking-[0.02em]">
            {data.headline}
          </h1>
          <p className="text-base text-[#6B6860] leading-relaxed mb-10 max-w-[340px]">
            {data.text}
          </p>
          <LocalizedClientLink
            href={data.cta.link}
            className="inline-flex w-max border border-[#1C1C1A] px-8 py-3 text-sm uppercase tracking-[0.1em] text-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-[#F7F4EF] transition-colors duration-300"
          >
            {data.cta.text}
          </LocalizedClientLink>
        </div>
      </div>

      {/* Mobile: stacked */}
      <div className="medium:hidden">
        <div className="relative h-[60vh]">
          <Image
            src={data.image.url}
            alt={data.image.alt}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="px-6 py-10 bg-[#F7F4EF]">
          <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-4">
            New collection
          </p>
          <h1 className="font-lora text-4xl leading-[1.15] text-[#1C1C1A] mb-5 -tracking-[0.02em]">
            {data.headline}
          </h1>
          <p className="text-base text-[#6B6860] leading-relaxed mb-8">
            {data.text}
          </p>
          <LocalizedClientLink
            href={data.cta.link}
            className="inline-flex w-max border border-[#1C1C1A] px-6 py-3 text-sm uppercase tracking-[0.1em] text-[#1C1C1A]"
          >
            {data.cta.text}
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Hero
```

**Step 2: Commit**

```bash
git add src/modules/home/components/hero/index.tsx
git commit -m "feat: rewrite hero to story-first two-column Scandi layout"
```

---

## Task 6: Collections Grid Rewrite

**Files:**
- Modify: `src/modules/home/components/collections/index.tsx`

**Step 1: Rewrite Collections**

```tsx
import Image from 'next/image'
import { StoreCollection } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { cn } from '@lib/util/cn'

const PLACEHOLDER_IMAGES = [
  'https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png',
  'https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png',
  'https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png',
]

const CollectionTile = ({
  title,
  handle,
  imgSrc,
  isLarge,
}: {
  title: string
  handle: string
  imgSrc: string
  isLarge: boolean
}) => (
  <LocalizedClientLink
    href={`/collections/${handle}`}
    className={cn('group relative overflow-hidden block', {
      'medium:row-span-2': isLarge,
    })}
  >
    <Image
      src={imgSrc}
      alt={`${title} collection`}
      width={800}
      height={isLarge ? 800 : 400}
      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    {/* Title — slides up on hover */}
    <div className="absolute bottom-0 left-0 right-0 p-6 large:p-8">
      <h3 className="font-lora text-2xl large:text-3xl text-white leading-tight translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        {title}
      </h3>
      <p className="text-xs uppercase tracking-[0.1em] text-white/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Discover →
      </p>
    </div>
  </LocalizedClientLink>
)

const Collections = ({ collections }: { collections: StoreCollection[] }) => {
  const display = collections.slice(0, 3)
  if (!display.length) return null

  return (
    <section className="content-container py-20 large:py-28">
      <div className="grid grid-cols-1 medium:grid-cols-2 gap-0 medium:grid-rows-2 medium:h-[600px] large:h-[720px]">
        {display.map((collection, i) => (
          <CollectionTile
            key={collection.id}
            title={collection.title}
            handle={collection.handle!}
            imgSrc={PLACEHOLDER_IMAGES[i] ?? PLACEHOLDER_IMAGES[0]}
            isLarge={i === 0}
          />
        ))}
      </div>
    </section>
  )
}

export default Collections
```

**Step 2: Commit**

```bash
git add src/modules/home/components/collections/index.tsx
git commit -m "feat: rewrite collections grid — asymmetric layout with hover animations"
```

---

## Task 7: Blog Card Rewrite

**Files:**
- Modify: `src/modules/blog/components/blog-card/index.tsx`

**Step 1: Rewrite BlogCard**

```tsx
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { BlogPost } from '@lib/data/blog'

type BlogCardProps = Pick<BlogPost, 'slug' | 'title' | 'date' | 'excerpt' | 'author'> & {
  featuredProduct?: { handle: string; title: string; thumbnail?: string } | null
  category?: string
}

export default function BlogCard({ slug, title, date, excerpt, author, featuredProduct, category }: BlogCardProps) {
  return (
    <article className="group flex flex-col">
      {/* Placeholder image area — replace with real thumbnail when available */}
      <div className="relative overflow-hidden bg-[#E8E4DC] aspect-[4/3] mb-5">
        <div className="absolute inset-0 bg-[#C07B5A]/10 group-hover:bg-[#C07B5A]/5 transition-colors duration-500" />
      </div>

      {/* Category pill */}
      {category && (
        <span className="inline-block mb-3 text-xs uppercase tracking-[0.1em] text-[#7A9E7E] border border-[#7A9E7E] px-2 py-0.5 w-max">
          {category}
        </span>
      )}

      {/* Title */}
      <LocalizedClientLink href={`/blog/${slug}`}>
        <h3 className="font-lora text-xl text-[#1C1C1A] leading-snug mb-2 group-hover:text-[#C07B5A] transition-colors duration-200">
          {title}
        </h3>
      </LocalizedClientLink>

      {/* Date */}
      <p className="text-xs text-[#6B6860] mb-3">
        {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        {author && ` · ${author}`}
      </p>

      {/* Excerpt */}
      <p className="text-sm text-[#6B6860] leading-relaxed line-clamp-3 mb-4">{excerpt}</p>

      {/* Read link */}
      <LocalizedClientLink
        href={`/blog/${slug}`}
        className="text-xs uppercase tracking-[0.1em] text-[#1C1C1A] border-b border-[#1C1C1A] pb-px w-max hover:text-[#C07B5A] hover:border-[#C07B5A] transition-colors duration-200 mt-auto"
      >
        Read article →
      </LocalizedClientLink>

      {/* Featured product link */}
      {featuredProduct && (
        <div className="mt-4 pt-4 border-t border-[#E8E4DC]">
          <p className="text-xs text-[#6B6860] mb-1">Featured in this article</p>
          <LocalizedClientLink
            href={`/products/${featuredProduct.handle}`}
            className="text-sm text-[#1C1C1A] hover:text-[#C07B5A] transition-colors"
          >
            {featuredProduct.title} →
          </LocalizedClientLink>
        </div>
      )}
    </article>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/blog/components/blog-card/index.tsx
git commit -m "feat: rewrite blog card — Scandi style with category pill and product link"
```

---

## Task 8: ExploreBlog (Home Blog Section) Rewrite

**Files:**
- Modify: `src/modules/home/components/explore-blog/index.tsx`

**Step 1: Rewrite ExploreBlog**

```tsx
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import BlogCard from '@modules/blog/components/blog-card'
import { ScrollReveal } from '@modules/common/components/scroll-reveal'

type Post = { slug: string; title: string; date: string; excerpt: string; author: string }

export function ExploreBlog({ posts }: { posts: Post[] }) {
  return (
    <section className="content-container py-20 large:py-28">
      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-3">Journal</p>
          <h2 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] -tracking-[0.02em]">
            Stories & ideas
          </h2>
        </div>
        <LocalizedClientLink
          href="/blog"
          className="hidden medium:inline-flex text-xs uppercase tracking-[0.1em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors border-b border-[#6B6860] pb-px"
        >
          View all →
        </LocalizedClientLink>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 medium:grid-cols-3 gap-8 large:gap-12">
        {posts.map((post, i) => (
          <ScrollReveal key={post.slug} delay={i * 100}>
            <BlogCard
              slug={post.slug}
              title={post.title}
              date={post.date}
              excerpt={post.excerpt}
              author={post.author}
            />
          </ScrollReveal>
        ))}
      </div>

      {/* Mobile view all */}
      <div className="mt-10 text-center medium:hidden">
        <LocalizedClientLink
          href="/blog"
          className="text-xs uppercase tracking-[0.1em] text-[#6B6860] border-b border-[#6B6860] pb-px"
        >
          View all stories →
        </LocalizedClientLink>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/home/components/explore-blog/index.tsx
git commit -m "feat: rewrite home blog section with scroll reveal and Scandi grid"
```

---

## Task 9: "How We Live" New Section

**Files:**
- Create: `src/modules/home/components/how-we-live/index.tsx`

**Step 1: Create component**

```tsx
import { ScrollReveal } from '@modules/common/components/scroll-reveal'

const steps = [
  {
    number: '01',
    title: 'Choose with intention',
    body: 'Every piece in our home should earn its place — chosen for function, beauty, and longevity, not impulse.',
  },
  {
    number: '02',
    title: 'Live with less',
    body: 'A curated space breathes. We believe in quality over quantity, and in the calm that simplicity brings.',
  },
  {
    number: '03',
    title: 'Care for what you own',
    body: 'Objects last longer when tended to. Our guides help you maintain and love the things you bring home.',
  },
]

export function HowWeLive() {
  return (
    <section className="bg-[#F0EDE6] py-20 large:py-32">
      <div className="content-container">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-4">Our philosophy</p>
          <h2 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] -tracking-[0.02em] mb-16 max-w-md">
            How we live
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 medium:grid-cols-3 gap-12 large:gap-16">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 120}>
              <p className="font-lora text-5xl text-[#1C1C1A]/10 mb-4">{step.number}</p>
              <h3 className="font-lora text-xl text-[#1C1C1A] mb-3 leading-snug">{step.title}</h3>
              <p className="text-sm text-[#6B6860] leading-relaxed">{step.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/home/components/how-we-live/index.tsx
git commit -m "feat: add HowWeLive brand philosophy section"
```

---

## Task 10: Product Tile Reskin

**Files:**
- Modify: `src/modules/products/components/product-tile/index.tsx`

**Step 1: Reskin ProductTile**

Keep the existing props interface and import structure. Replace the JSX:

```tsx
import { useMemo } from 'react'
import { formatNameForTestId } from '@lib/util/formatNameForTestId'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { LoadingImage } from './loading-image'
import ProductPrice from './price'
import { ProductActions } from './action'

export function ProductTile({
  product,
  regionId,
}: {
  product: {
    id: string
    created_at: string
    title: string
    handle: string
    thumbnail: string | null
    calculatedPrice: string | null
    salePrice: string | null
  }
  regionId: string
}) {
  const isNew = useMemo(() => {
    const days = (Date.now() - new Date(product.created_at).getTime()) / 86400000
    return days <= 7
  }, [product.created_at])

  return (
    <div
      className="group flex flex-col"
      data-testid={formatNameForTestId(`${product.title}-product-tile`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F0EDE6] aspect-[3/4]">
        {isNew && (
          <span className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-[0.1em] bg-[#7A9E7E] text-white px-2 py-1">
            New
          </span>
        )}
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <LoadingImage
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </LocalizedClientLink>
        {/* Quick add on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[#1C1C1A]/90">
          <ProductActions productHandle={product.handle} regionId={regionId} />
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-2">
        <LocalizedClientLink href={`/products/${product.handle}`}>
          <p className="text-sm text-[#1C1C1A] leading-snug mb-1 group-hover:text-[#C07B5A] transition-colors duration-200">
            {product.title}
          </p>
        </LocalizedClientLink>
        <ProductPrice calculatedPrice={product.calculatedPrice} salePrice={product.salePrice} />
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/products/components/product-tile/index.tsx
git commit -m "feat: reskin product tile — aspect-ratio image, hover quick-add"
```

---

## Task 11: Product Carousel Reskin

**Files:**
- Modify: `src/modules/products/components/product-carousel/index.tsx`

**Step 1: Reskin the carousel header and container**

```tsx
import { getProductPrice } from '@lib/util/get-product-price'
import { StoreProduct } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ProductTile } from '../product-tile'
import CarouselWrapper from './carousel-wrapper'

interface ViewAllProps { link: string; text?: string }
interface ProductCarouselProps {
  products: StoreProduct[]
  regionId: string
  title: string
  viewAll?: ViewAllProps
  testId?: string
}

export function ProductCarousel({ products, regionId, title, viewAll, testId }: ProductCarouselProps) {
  return (
    <section className="content-container py-20 large:py-28 overflow-hidden" data-testid={testId}>
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-lora italic text-4xl large:text-5xl text-[#1C1C1A] -tracking-[0.02em]">
          {title}
        </h2>
        {viewAll && (
          <LocalizedClientLink
            href={viewAll.link}
            className="hidden medium:inline-flex text-xs uppercase tracking-[0.1em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors border-b border-[#6B6860] pb-px"
          >
            {viewAll.text || 'View all'} →
          </LocalizedClientLink>
        )}
      </div>

      {/* Carousel */}
      <CarouselWrapper title={title} productsCount={products.length}>
        <div className="flex gap-4">
          {products.map((item, index) => {
            const { cheapestPrice } = getProductPrice({ product: item })
            return (
              <div
                key={index}
                className="flex-[0_0_calc(75%-16px)] small:flex-[0_0_calc(50%-16px)] medium:flex-[0_0_calc(35%-16px)] xl:flex-[0_0_calc(28%-16px)]"
              >
                <ProductTile
                  product={{
                    id: item.id ?? '',
                    created_at: item.created_at ?? '',
                    title: item.title ?? '',
                    handle: item.handle ?? '',
                    thumbnail: item.thumbnail ?? null,
                    calculatedPrice: cheapestPrice?.calculated_price ?? null,
                    salePrice: cheapestPrice?.original_price ?? null,
                  }}
                  regionId={regionId}
                />
              </div>
            )
          })}
        </div>
      </CarouselWrapper>

      {/* Mobile view all */}
      {viewAll && (
        <div className="mt-8 text-center medium:hidden">
          <LocalizedClientLink
            href={viewAll.link}
            className="text-xs uppercase tracking-[0.1em] text-[#6B6860] border-b border-[#6B6860] pb-px"
          >
            {viewAll.text || 'View all'} →
          </LocalizedClientLink>
        </div>
      )}
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/products/components/product-carousel/index.tsx
git commit -m "feat: reskin product carousel with Scandi header and spacing"
```

---

## Task 12: Home Page Section Order

**Files:**
- Modify: `src/app/[countryCode]/(main)/page.tsx`

**Step 1: Update section order to: Hero → Collections → Blog → Products → HowWeLive**

```tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCollectionsList } from '@lib/data/collections'
import { getProductsList } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import { getAllPosts } from '@lib/data/blog'
import { getBanner } from '@lib/data/cms'
import { heroBannerConfig } from '@lib/config/home'
import Collections from '@modules/home/components/collections'
import { ExploreBlog } from '@modules/home/components/explore-blog'
import Hero from '@modules/home/components/hero'
import { HowWeLive } from '@modules/home/components/how-we-live'
import { ProductCarousel } from '@modules/products/components/product-carousel'
import SkeletonProductsCarousel from '@modules/skeletons/templates/skeleton-products-carousel'

export const metadata: Metadata = {
  title: 'Solace — Thoughtful objects for a considered life',
  description: 'Curated lifestyle and home goods, crafted to last.',
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const [{ collections }, { response: { products } }, region, allPosts, heroBanner] = await Promise.all([
    getCollectionsList(),
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
      {/* 1. Hero — story first */}
      <Hero data={heroData} />

      {/* 2. Collections — immediate discovery */}
      {collections?.length > 0 && <Collections collections={collections} />}

      {/* 3. Blog — content builds trust before selling */}
      {posts.length > 0 && <ExploreBlog posts={posts} />}

      {/* 4. Products — reader is primed, now convert */}
      {products && region && (
        <Suspense fallback={<SkeletonProductsCarousel />}>
          <ProductCarousel
            products={products}
            regionId={region.id}
            title="Our picks"
            viewAll={{ link: '/store', text: 'View all' }}
          />
        </Suspense>
      )}

      {/* 5. Brand philosophy — close with values */}
      <HowWeLive />
    </>
  )
}
```

**Step 2: Commit**

```bash
git add src/app/[countryCode]/\(main\)/page.tsx
git commit -m "feat: update home page section order — content-first commerce flow"
```

---

## Task 13: Blog List Page Rewrite

**Files:**
- Modify: `src/modules/blog/templates/blog-list/index.tsx`

**Step 1: Rewrite with featured hero post + grid**

```tsx
import { getAllPosts } from '@lib/data/blog'
import BlogCard from '@modules/blog/components/blog-card'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default async function BlogListTemplate() {
  const posts = await getAllPosts()

  if (posts.length === 0) {
    return (
      <div className="content-container py-24 text-center">
        <p className="text-sm text-[#6B6860]">No stories yet. Check back soon.</p>
      </div>
    )
  }

  const [hero, ...rest] = posts

  return (
    <div className="bg-[#F7F4EF]">
      {/* Page header */}
      <div className="content-container pt-16 pb-12">
        <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-3">Journal</p>
        <h1 className="font-lora text-5xl large:text-6xl text-[#1C1C1A] -tracking-[0.02em]">
          Stories & ideas
        </h1>
      </div>

      {/* Hero post — full width */}
      <div className="content-container mb-16">
        <LocalizedClientLink href={`/blog/${hero.slug}`} className="group block">
          <div className="relative overflow-hidden bg-[#E8E4DC] aspect-[16/7]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 large:p-12">
              <h2 className="font-lora text-3xl large:text-5xl text-white leading-tight mb-3 max-w-2xl group-hover:text-[#F7F4EF]/90 transition-colors">
                {hero.title}
              </h2>
              <p className="text-sm text-white/70">
                {new Date(hero.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {hero.author && ` · ${hero.author}`}
              </p>
            </div>
          </div>
        </LocalizedClientLink>
      </div>

      {/* Remaining posts — 2-column grid */}
      {rest.length > 0 && (
        <div className="content-container pb-24">
          <div className="grid grid-cols-1 medium:grid-cols-2 large:grid-cols-3 gap-10 large:gap-14">
            {rest.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                author={post.author ?? ''}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/blog/templates/blog-list/index.tsx
git commit -m "feat: rewrite blog list — hero first post + grid layout"
```

---

## Task 14: InlineProductCard Component

Used inside blog articles to embed shoppable product moments.

**Files:**
- Create: `src/modules/blog/components/inline-product-card/index.tsx`

**Step 1: Create InlineProductCard**

```tsx
'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

interface InlineProductCardProps {
  handle: string
  /** Optional: pass pre-fetched data to avoid client fetch */
  product?: {
    title: string
    thumbnail: string | null
    price: string | null
  }
}

export function InlineProductCard({ handle, product: staticProduct }: InlineProductCardProps) {
  const [product, setProduct] = useState(staticProduct ?? null)

  useEffect(() => {
    if (staticProduct || !handle) return
    // Fetch from storefront API when no static data provided
    fetch(`/api/products/${handle}`)
      .then((r) => r.json())
      .then((data) => setProduct(data))
      .catch(() => null)
  }, [handle, staticProduct])

  if (!product) return null

  return (
    <aside className="my-8 border border-[#E8E4DC] bg-[#F0EDE6] p-4 flex gap-4 items-center not-prose">
      {product.thumbnail && (
        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <p className="text-xs uppercase tracking-[0.08em] text-[#6B6860]">Featured product</p>
        <p className="text-sm font-medium text-[#1C1C1A] truncate">{product.title}</p>
        {product.price && (
          <p className="text-sm text-[#6B6860]">{product.price}</p>
        )}
        <LocalizedClientLink
          href={`/products/${handle}`}
          className="text-xs uppercase tracking-[0.1em] border border-[#1C1C1A] px-3 py-1.5 w-max text-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-[#F7F4EF] transition-colors duration-200"
        >
          View product
        </LocalizedClientLink>
      </div>
    </aside>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/blog/components/inline-product-card/index.tsx
git commit -m "feat: add InlineProductCard for shoppable blog content"
```

---

## Task 15: Blog Detail Rewrite

**Files:**
- Modify: `src/modules/blog/templates/blog-detail/index.tsx`

**Step 1: Rewrite blog detail template**

```tsx
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { BlogPost } from '@lib/data/blog'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

async function renderMarkdown(content: string) {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype)
  const mdast = processor.parse(content)
  const hast = await processor.run(mdast)
  return toJsxRuntime(hast, { Fragment, jsx: jsx as any, jsxs: jsxs as any })
}

export default async function BlogDetailTemplate({ post }: { post: BlogPost }) {
  const content = await renderMarkdown(post.content)

  return (
    <div className="bg-[#F7F4EF] min-h-screen">
      {/* Header */}
      <div className="content-container pt-12 pb-0">
        <LocalizedClientLink
          href="/blog"
          className="text-xs uppercase tracking-[0.1em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors inline-flex items-center gap-2 mb-10"
        >
          ← Back to Journal
        </LocalizedClientLink>

        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.1em] text-[#7A9E7E] mb-4">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            {post.author && ` · ${post.author}`}
          </p>
          <h1 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] leading-[1.1] -tracking-[0.02em] mb-12">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Hero image placeholder */}
      <div className="content-container mb-12">
        <div className="bg-[#E8E4DC] aspect-[16/7] w-full" />
      </div>

      {/* Article body */}
      <div className="content-container pb-24">
        <article className="max-w-2xl prose prose-sm prose-neutral
          prose-headings:font-lora prose-headings:font-normal prose-headings:text-[#1C1C1A]
          prose-p:text-[#6B6860] prose-p:leading-relaxed
          prose-a:text-[#C07B5A] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#1C1C1A]
          max-w-none">
          {content}
        </article>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/blog/templates/blog-detail/index.tsx
git commit -m "feat: rewrite blog detail — Scandi article layout with Lora headings"
```

---

## Task 16: Store (Product List) Page Reskin

**Files:**
- Modify: `src/modules/store/templates/index.tsx`

**Step 1: Reskin store template**

```tsx
import { Suspense } from 'react'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'
import RefinementList from '@modules/store/components/refinement-list'
import { SortOptions } from '@modules/store/components/refinement-list/sort-products'
import PaginatedProducts from './paginated-products'

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || 'created_at'

  return (
    <div className="bg-[#F7F4EF] min-h-screen">
      {/* Page header */}
      <div className="content-container pt-14 pb-10 border-b border-[#E8E4DC]">
        <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-2">Explore</p>
        <div className="flex items-end justify-between">
          <h1
            className="font-lora text-4xl large:text-5xl text-[#1C1C1A] -tracking-[0.02em]"
            data-testid="store-page-title"
          >
            All products
          </h1>
          {/* Sort/filter inline */}
          <div className="hidden medium:block">
            <RefinementList sortBy={sort} />
          </div>
        </div>
      </div>

      {/* Mobile filter */}
      <div className="medium:hidden content-container py-4 border-b border-[#E8E4DC]">
        <RefinementList sortBy={sort} />
      </div>

      {/* Product grid */}
      <div
        className="content-container py-12"
        data-testid="category-container"
      >
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
```

**Step 2: Commit**

```bash
git add src/modules/store/templates/index.tsx
git commit -m "feat: reskin store page — clean header, inline filter"
```

---

## Task 17: Product Detail Template Reskin

**Files:**
- Modify: `src/modules/products/templates/index.tsx`

**Step 1: Reskin product template to left-image / right-info layout**

```tsx
import React, { Suspense } from 'react'
import ImageGallery from '@modules/products/components/image-gallery'
import ProductActions from '@modules/products/components/product-actions'
import ProductOnboardingCta from '@modules/products/components/product-onboarding-cta'
import ProductTabs from '@modules/products/components/product-tabs'
import RelatedProducts from '@modules/products/components/related-products'
import ProductInfo from '@modules/products/templates/product-info'
import SkeletonRelatedProducts from '@modules/skeletons/templates/skeleton-related-products'
import { notFound } from 'next/navigation'
import ProductActionsWrapper from './product-actions-wrapper'
import { HttpTypes } from '@medusajs/types'

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product, region, countryCode }) => {
  if (!product || !product.id) return notFound()

  return (
    <div className="bg-[#F7F4EF] min-h-screen">
      {/* Main product section */}
      <div
        className="content-container py-10 flex flex-col medium:flex-row gap-8 large:gap-16"
        data-testid="product-container"
      >
        {/* Left: Image gallery — takes majority of width */}
        <div className="w-full medium:w-[55%] large:w-[60%]">
          <ImageGallery images={product?.images || []} />
        </div>

        {/* Right: Info + actions — sticky on desktop */}
        <div className="w-full medium:w-[45%] large:w-[40%] medium:sticky medium:top-24 medium:self-start flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <ProductOnboardingCta />
            <ProductInfo product={product} />
          </div>

          <Suspense
            fallback={<ProductActions disabled product={product} region={region} />}
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>

          <ProductTabs product={product} />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E8E4DC]" />

      {/* Related products */}
      <div
        className="content-container py-16 large:py-24"
        data-testid="related-products-container"
      >
        <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-3">You may also like</p>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
```

**Step 2: Commit**

```bash
git add src/modules/products/templates/index.tsx
git commit -m "feat: reskin product detail — left image, right sticky info panel"
```

---

## Final Verification

**Step 1: Full build check**

```bash
cd /d/workspace/standalone-website/e-commerce/storefront
npm run build 2>&1 | tail -30
```

Expected: Build succeeds. Any remaining warnings about missing env vars or image domains are pre-existing and not introduced by this redesign.

**Step 2: Dev server smoke test**

```bash
npm run dev
```

Manually verify:
- [ ] Home page: Hero two-column, Collections grid, Blog section, Product carousel, HowWeLive
- [ ] Nav: Brand name left, links center, icons right; mobile overlay works
- [ ] Footer: Dark background, 4-column grid, newsletter input
- [ ] Blog list: Hero post full-width, grid below
- [ ] Blog detail: Lora heading, clean body, back link
- [ ] Store: Clean header, product grid
- [ ] Product detail: Left gallery, right sticky info

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete Scandi minimal storefront redesign

- Story-first hero, content→commerce home page flow
- Lora serif typography with Inter body
- Warm linen (#F7F4EF) palette with sage + terracotta accents
- ScrollReveal scroll animations throughout
- Blog cards with product links (content-drives-commerce)
- InlineProductCard for shoppable blog articles
- Dark footer with newsletter signup
- Product tile hover quick-add, aspect-ratio images
- Product detail: left gallery / right sticky panel"
```
