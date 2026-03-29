# Solace Style & Feature Alignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate `e-commerce/storefront` to use solace-medusa-starter's design system, add dark/light mode, CVA-based component library, and new pages (Blog, About, FAQ, Privacy, Terms).

**Architecture:** In-place migration — add `preset/` design token system, rewrite `common/` components with CVA pattern, add ThemeProvider (next-themes), and new route pages. MeiliSearch and existing Medusa data layer stay unchanged.

**Tech Stack:** Next.js 15, Medusa 2, Tailwind CSS 3, CVA, tailwind-merge, next-themes, Sonner, Embla Carousel, next-mdx-remote

**Reference:** `solace-medusa-starter` lives at `D:/workspace/standalone-website/solace-medusa-starter/`
**Target:** `e-commerce/storefront` lives at `D:/workspace/standalone-website/e-commerce/storefront/`

---

## Phase 1 — Design System Foundation

### Task 1: Create preset directory

**Files:**
- Create: `preset/plugins/colors.js`
- Create: `preset/plugins/plugin.js`
- Create: `preset/theme/colors.js`
- Create: `preset/theme/typography.js`
- Create: `preset/theme/constants.js`
- Create: `preset/theme/animations.js`
- Create: `preset/theme/theme.js`
- Create: `preset/preset.js`

All paths relative to `e-commerce/storefront/`.

**Step 1: Create `preset/plugins/colors.js`**

Copy verbatim from `solace-medusa-starter/preset/plugins/colors.js`:

```javascript
const rootColors = {
  '--bg-static': '9 9 9',
  '--bg-primary': '255 255 255',
  '--bg-secondary': '249 249 249',
  '--bg-brand': '218 254 222',
  '--bg-hover': '237 237 237',
  '--bg-pressed': '229 229 229',
  '--bg-disabled': '210 210 210',
  '--bg-skeleton-primary': '243 244 246',
  '--bg-skeleton-secondary': '229 231 235',
  '--fg-primary': '9 9 9',
  '--fg-primary-hover': '17 17 17',
  '--fg-primary-pressed': '26 26 26',
  '--fg-secondary': '9, 9, 9, 0.1',
  '--fg-secondary-hover': '9, 9, 9, 0.2',
  '--fg-secondary-pressed': '9, 9, 9, 0.3',
  '--fg-tertiary': '255, 255, 255, 0.4',
  '--fg-tertiary-hover': '255, 255, 255, 0.2',
  '--fg-tertiary-pressed': '255, 255, 255, 0.3',
  '--fg-primary-negative': '217 45 32',
  '--fg-primary-negative-hover': '180 35 24',
  '--fg-primary-negative-pressed': '145 32 24',
  '--fg-secondary-negative': '217, 45, 32, 0.2',
  '--fg-positive': '3, 152, 85, 0.2',
  '--content-static': '255 255 255',
  '--content-basic-primary': '9 9 9',
  '--content-inverse-primary': '255 255 255',
  '--content-secondary': '108 108 108',
  '--content-disabled': '140 140 140',
  '--content-action-primary': '9 9 9',
  '--content-action-primary-hover': '26 26 26',
  '--content-action-primary-pressed': '17 17 17',
  '--content-negative': '217 45 32',
  '--content-positive': '3 152 85',
  '--content-warning': '220 104 3',
  '--content-yellow': '253 176 34',
  '--border-basic-primary': '229 229 229',
  '--border-secondary': '255, 255, 255, 0.1',
  '--border-disabled': '140 140 140',
  '--border-action-primary': '9 9 9',
  '--border-action-primary-inverse': '255 255 255',
  '--border-action-primary-hover': '26 26 26',
  '--border-action-primary-pressed': '17 17 17',
  '--border-negative': '217 45 32',
  '--border-positive': '3 152 85',
  '--border-warning': '220 104 3',
}

const darkMode = {
  '--bg-static': '9 9 9',
  '--bg-primary': '9 9 9',
  '--bg-secondary': '21 21 21',
  '--bg-brand': '9 9 9',
  '--bg-hover': '70 70 70',
  '--bg-pressed': '108 108 108',
  '--bg-disabled': '70 70 70',
  '--bg-skeleton-primary': '44 43 42',
  '--bg-skeleton-secondary': '11 11 11',
  '--fg-primary': '249 249 249',
  '--fg-primary-hover': '237 237 237',
  '--fg-primary-pressed': '229 229 229',
  '--fg-secondary': '255, 255, 255 ,0.1',
  '--fg-secondary-hover': '255 255 255 0.2',
  '--fg-secondary-pressed': '255 255 255 0.3',
  '--fg-tertiary': '255, 255, 255, 0.1',
  '--fg-tertiary-hover': '255, 255, 255, 0.2',
  '--fg-tertiary-pressed': '255, 255, 255, 0.3',
  '--fg-primary-negative': '240 68 56',
  '--fg-primary-negative-hover': '217 45 32',
  '--fg-primary-negative-pressed': '180 35 24',
  '--fg-secondary-negative': '217, 45, 32, 0.2',
  '--fg-positive': '3, 152, 85, 0.2',
  '--content-static': '255 255 255',
  '--content-basic-primary': '255 255 255',
  '--content-inverse-primary': '9 9 9',
  '--content-secondary': '165 165 165',
  '--content-disabled': '108 108 108',
  '--content-action-primary': '255 255 255',
  '--content-action-primary-hover': '249 249 249',
  '--content-action-primary-pressed': '237 237 237',
  '--content-negative': '240 68 56',
  '--content-positive': '18 183 106',
  '--content-warning': '247 144 9',
  '--content-yellow': '253 176 34',
  '--border-basic-primary': '33 33 33',
  '--border-secondary': '255, 255, 255, 0.1',
  '--border-disabled': '108 108 108',
  '--border-action-primary': '255 255 255',
  '--border-action-primary-inverse': '9 9 9',
  '--border-action-primary-hover': '14 125 32',
  '--border-action-primary-pressed': '16 87 29',
  '--border-negative': '240 68 56',
  '--border-positive': '18 183 106',
  '--border-warning': '247 144 9',
}

module.exports = { rootColors, darkMode }
```

**Step 2: Create `preset/plugins/plugin.js`**

```javascript
const plugin = require('tailwindcss/plugin')
const { darkMode, rootColors } = require('./colors')

const uiPlugin = plugin(function ({ addBase, theme }) {
  addBase({
    '.light': { ...rootColors },
    '.dark': { ...darkMode },
    h1: { fontSize: theme('fontSize.5xl'), fontWeight: theme('fontWeight.normal') },
    h2: { fontSize: theme('fontSize.3xl'), fontWeight: theme('fontWeight.normal') },
    h3: { fontSize: theme('fontSize.2xl'), fontWeight: theme('fontWeight.normal') },
    h4: { fontSize: theme('fontSize.xl'), fontWeight: theme('fontWeight.normal') },
    h5: { fontSize: theme('fontSize.lg'), fontWeight: theme('fontWeight.normal') },
    h6: { fontSize: theme('fontSize.md'), fontWeight: theme('fontWeight.normal') },
  })
})

module.exports = uiPlugin
```

**Step 3: Create `preset/theme/colors.js`**

Copy verbatim from `solace-medusa-starter/preset/theme/colors.js` (full file content from exploration above).

**Step 4: Create `preset/theme/typography.js`**

```javascript
const defaultTheme = require('tailwindcss/defaultTheme')

const fontFamily = { sans: ['Inter', ...defaultTheme.fontFamily.sans] }

const fontSize = {
  sm: ['0.75rem', { lineHeight: '1.25rem' }],
  md: ['0.875rem', { lineHeight: '1.375rem' }],
  lg: ['1rem', { lineHeight: '1.5rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['2rem', { lineHeight: '2.5rem' }],
  '4xl': ['2.5rem', { lineHeight: '3rem' }],
  '5xl': ['3rem', { lineHeight: '3.5rem' }],
}

module.exports = { fontFamily, fontSize }
```

**Step 5: Create `preset/theme/constants.js`**

```javascript
const screens = {
  xsmall: '355px',
  small: '640px',
  medium: '768px',
  large: '900px',
  xl: '1100px',
  '2xl': '1700px',
}

module.exports = { screens }
```

**Step 6: Create `preset/theme/animations.js`**

```javascript
const animation = {
  'slide-down': 'accordion-slide-down 0.3s ease-in-out',
  'slide-up': 'accordion-slide-up 0.3s ease-in-out',
}
const keyframes = {
  'accordion-slide-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' },
  },
  'accordion-slide-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' },
  },
}

module.exports = { animation, keyframes }
```

**Step 7: Create `preset/theme/theme.js`**

```javascript
const { animation, keyframes } = require('./animations')
const { boxShadow, colors } = require('./colors')
const { screens } = require('./constants')
const { fontFamily, fontSize } = require('./typography')

const uiTheme = {
  screens,
  fontSize,
  extend: {
    fontFamily,
    ...colors,
    boxShadow,
    keyframes,
    animation,
  },
}

module.exports = uiTheme
```

**Step 8: Create `preset/preset.js`**

```javascript
const uiPlugin = require('./plugins/plugin')
const uiTheme = require('./theme/theme')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: { ...uiTheme },
  plugins: [uiPlugin],
}
```

**Step 9: Commit**

```bash
cd e-commerce/storefront
git add preset/
git commit -m "feat: add solace design token preset"
```

---

### Task 2: Update tailwind.config.js

**Files:**
- Modify: `tailwind.config.js`

**Step 1: Replace tailwind.config.js**

```javascript
const path = require('path')
const uiPreset = require('./preset/preset')

module.exports = {
  darkMode: 'class',
  presets: [require('@medusajs/ui-preset'), uiPreset],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/modules/**/*.{js,ts,jsx,tsx}',
    './node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: 'width margin',
        height: 'height',
        bg: 'background-color',
        display: 'display opacity',
        visibility: 'visibility',
        padding: 'padding-top padding-right padding-bottom padding-left',
      },
      keyframes: {
        ring: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        'fade-in-right': { '0%': { opacity: '0', transform: 'translateX(10px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        'fade-in-top': { '0%': { opacity: '0', transform: 'translateY(-10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-out-top': { '0%': { height: '100%' }, '99%': { height: '0' }, '100%': { visibility: 'hidden' } },
        'accordion-slide-up': { '0%': { height: 'var(--radix-accordion-content-height)', opacity: '1' }, '100%': { height: '0', opacity: '0' } },
        'accordion-slide-down': { '0%': { 'min-height': '0', 'max-height': '0', opacity: '0' }, '100%': { 'min-height': 'var(--radix-accordion-content-height)', 'max-height': 'none', opacity: '1' } },
        enter: { '0%': { transform: 'scale(0.9)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        leave: { '0%': { transform: 'scale(1)', opacity: 1 }, '100%': { transform: 'scale(0.9)', opacity: 0 } },
        'slide-in': { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(0)' } },
      },
      animation: {
        ring: 'ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        'fade-in-right': 'fade-in-right 0.3s cubic-bezier(0.5, 0, 0.5, 1) forwards',
        'fade-in-top': 'fade-in-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards',
        'fade-out-top': 'fade-out-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards',
        'accordion-open': 'accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards',
        'accordion-close': 'accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards',
        enter: 'enter 200ms ease-out',
        'slide-in': 'slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)',
        leave: 'leave 150ms ease-in forwards',
      },
    },
  },
  plugins: [require('tailwindcss-radix')()],
}
```

**Step 2: Verify build compiles**

```bash
cd e-commerce/storefront
npx next build 2>&1 | head -30
```

Expected: no Tailwind config errors.

**Step 3: Commit**

```bash
git add tailwind.config.js
git commit -m "feat: integrate solace preset into tailwind config"
```

---

### Task 3: Update globals.css and add cn utility

**Files:**
- Modify: `src/styles/globals.css`
- Create: `src/lib/util/cn.ts`

**Step 1: Prepend CSS variable blocks to globals.css**

Add the following BEFORE the existing `@import` lines (or right after them, before `@layer utilities`):

```css
/* Light/dark theme applied via next-themes class strategy */
html.light,
html:not(.dark) {
  color-scheme: light;
}

html.dark {
  color-scheme: dark;
}
```

The actual CSS variable values are injected by the Tailwind plugin (plugin.js) via the `.light` and `.dark` classes. The existing globals.css content stays intact — do NOT remove existing utilities or components.

**Step 2: Create `src/lib/util/cn.ts`**

```typescript
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...args: any[]) {
  return twMerge(clsx(...args))
}
```

**Step 3: Commit**

```bash
git add src/styles/globals.css src/lib/util/cn.ts
git commit -m "feat: add cn utility and theme css setup"
```

---

## Phase 2 — Install Dependencies

### Task 4: Install new packages

**Files:**
- Modify: `package.json`

**Step 1: Install production dependencies**

```bash
cd e-commerce/storefront
npm install cva tailwind-merge clsx zustand@5 sonner embla-carousel-react next-themes next-mdx-remote gray-matter remark-gfm rehype-highlight tailwindcss-animate
```

**Step 2: Upgrade headlessui**

```bash
npm install @headlessui/react@^2.2.0
```

Note: Headless UI v2 has breaking API changes. Affected files will be updated in Phase 4.

**Step 3: Verify install succeeded**

```bash
npm ls cva tailwind-merge zustand sonner next-themes 2>&1 | head -20
```

Expected: all packages listed without errors.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add solace dependency stack (CVA, Zustand, next-themes, Sonner, etc.)"
```

---

## Phase 3 — Theme System

### Task 5: ThemeProvider + ThemeSwitcher

**Files:**
- Create: `src/modules/common/components/theme-provider/index.tsx`
- Create: `src/modules/common/components/theme-switcher/index.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create ThemeProvider**

`src/modules/common/components/theme-provider/index.tsx`:

```typescript
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**Step 2: Create ThemeSwitcher**

`src/modules/common/components/theme-switcher/index.tsx`:

```typescript
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="h-9 w-9" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-hover active:bg-pressed transition-colors"
      aria-label="Toggle theme"
      data-testid="theme-switcher"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      )}
    </button>
  )
}
```

**Step 3: Update root layout**

Replace `src/app/layout.tsx`:

```typescript
import { getBaseURL } from '@lib/util/env'
import { Metadata } from 'next'
import { ThemeProvider } from '@modules/common/components/theme-provider'
import { Toaster } from 'sonner'
import 'styles/globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-basic-primary bg-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Toaster position="bottom-right" offset={65} closeButton />
          <main className="relative">{props.children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Step 4: Start dev server and verify theme toggle**

```bash
npm run dev
```

Open http://localhost:3000. Verify:
- Page loads without errors
- Background is white (light mode default)
- No hydration errors in console

**Step 5: Commit**

```bash
git add src/modules/common/components/theme-provider/ src/modules/common/components/theme-switcher/ src/app/layout.tsx
git commit -m "feat: add ThemeProvider and ThemeSwitcher (next-themes)"
```

---

## Phase 4 — Core Components (CVA)

### Task 6: Button component

**Files:**
- Create: `src/modules/common/components/button/index.tsx`

**Step 1: Create Button with CVA**

`src/modules/common/components/button/index.tsx` — copy verbatim from `solace-medusa-starter/src/modules/common/components/button/index.tsx`.

The full code is in the design doc. Key variants: `filled`, `ghost`, `tonal`, `text`, `destructive`, `icon`. Sizes: `sm`, `md`.

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep button
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/modules/common/components/button/
git commit -m "feat: add CVA-based Button component"
```

---

### Task 7: Layout primitive components

**Files:**
- Create: `src/modules/common/components/box/index.tsx`
- Create: `src/modules/common/components/container/index.tsx`
- Create: `src/modules/common/components/heading/index.tsx`
- Create: `src/modules/common/components/text/index.tsx`

**Step 1: Create Box**

`src/modules/common/components/box/index.tsx`:

```typescript
import React from 'react'
import { cn } from '@lib/util/cn'

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  )
)
Box.displayName = 'Box'
```

**Step 2: Create Container**

`src/modules/common/components/container/index.tsx`:

```typescript
import React from 'react'
import { cn } from '@lib/util/cn'
import { cva, VariantProps } from 'cva'

const containerVariants = cva({
  base: 'mx-auto w-full px-4 medium:px-6',
  variants: {
    size: {
      sm: 'max-w-2xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      full: 'max-w-none',
    },
  },
  defaultVariants: { size: 'lg' },
})

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  )
)
Container.displayName = 'Container'
```

**Step 3: Create Heading**

`src/modules/common/components/heading/index.tsx`:

```typescript
import React from 'react'
import { cn } from '@lib/util/cn'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel
  children: React.ReactNode
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = 'h2', className, children, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn('text-basic-primary', className)}
      {...props}
    >
      {children}
    </Tag>
  )
)
Heading.displayName = 'Heading'
```

**Step 4: Create Text**

`src/modules/common/components/text/index.tsx`:

```typescript
import React from 'react'
import { cn } from '@lib/util/cn'
import { cva, VariantProps } from 'cva'

const textVariants = cva({
  base: 'text-basic-primary',
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    tone: {
      primary: 'text-basic-primary',
      secondary: 'text-secondary',
      disabled: 'text-disabled',
      negative: 'text-negative',
      positive: 'text-positive',
    },
  },
  defaultVariants: { size: 'md', weight: 'normal', tone: 'primary' },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label'
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ as: Tag = 'p', className, size, weight, tone, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(textVariants({ size, weight, tone }), className)}
      {...props}
    />
  )
)
Text.displayName = 'Text'
```

**Step 5: Commit**

```bash
git add src/modules/common/components/box/ src/modules/common/components/container/ src/modules/common/components/heading/ src/modules/common/components/text/
git commit -m "feat: add Box, Container, Heading, Text layout primitives"
```

---

### Task 8: Badge, Divider, NavigationItem

**Files:**
- Create: `src/modules/common/components/badge/index.tsx`
- Modify (or create): `src/modules/common/components/divider/index.tsx`
- Create: `src/modules/common/components/navigation-item/index.tsx`

**Step 1: Badge**

`src/modules/common/components/badge/index.tsx`:

```typescript
import React from 'react'
import { cn } from '@lib/util/cn'
import { cva, VariantProps } from 'cva'

const badgeVariants = cva({
  base: 'inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium',
  variants: {
    variant: {
      default: 'bg-fg-secondary text-action-primary',
      positive: 'bg-green-100 text-positive',
      negative: 'bg-red-100 text-negative',
      warning: 'bg-yellow-100 text-warning',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
)
Badge.displayName = 'Badge'
```

**Step 2: Divider** — check if `src/modules/common/components/divider/index.tsx` already exists. If yes, update it; if no, create it:

```typescript
import React from 'react'
import { cn } from '@lib/util/cn'

export const Divider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn('border-t border-basic-primary', className)}
    {...props}
  />
))
Divider.displayName = 'Divider'
```

**Step 3: NavigationItem**

`src/modules/common/components/navigation-item/index.tsx`:

```typescript
import React from 'react'
import { cn } from '@lib/util/cn'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export interface NavigationItemProps {
  href: string
  children: React.ReactNode
  className?: string
  'data-testid'?: string
}

export const NavigationItem = React.forwardRef<HTMLAnchorElement, NavigationItemProps>(
  ({ href, children, className, ...props }, ref) => (
    <LocalizedClientLink
      href={href}
      className={cn(
        'flex items-center py-3 text-md text-action-primary hover:text-action-primary-hover transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </LocalizedClientLink>
  )
)
NavigationItem.displayName = 'NavigationItem'
```

**Step 4: Commit**

```bash
git add src/modules/common/components/badge/ src/modules/common/components/divider/ src/modules/common/components/navigation-item/
git commit -m "feat: add Badge, Divider, NavigationItem components"
```

---

### Task 9: Toast (Sonner) and Stepper

**Files:**
- Create: `src/modules/common/components/stepper/index.tsx`

Note: Toast is already handled by `<Toaster>` in layout.tsx (Task 5). Import `toast` from `sonner` directly anywhere a toast is needed.

**Step 1: Create Stepper**

`src/modules/common/components/stepper/index.tsx`:

```typescript
import React from 'react'
import { cn } from '@lib/util/cn'

export interface StepperProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium transition-colors',
                  {
                    'bg-fg-primary text-static': isCompleted || isActive,
                    'bg-disabled text-disabled': !isCompleted && !isActive,
                  }
                )}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 3L5 8.5L2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn('text-md', {
                  'text-action-primary': isActive || isCompleted,
                  'text-disabled': !isCompleted && !isActive,
                })}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn('h-px flex-1 transition-colors', {
                  'bg-fg-primary': isCompleted,
                  'bg-disabled': !isCompleted,
                })}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/common/components/stepper/
git commit -m "feat: add Stepper component"
```

---

### Task 10: Update SideMenu to Headless UI v2

**Files:**
- Modify: `src/modules/layout/components/side-menu/index.tsx`

**Step 1: Read current SideMenu**

```bash
cat src/modules/layout/components/side-menu/index.tsx
```

**Step 2: Update to Headless UI v2 Dialog API**

Headless UI v2 changes `Dialog` to require `open` + `onClose` props directly. Replace any v1 patterns:

```typescript
// v1 pattern (OLD):
<Dialog.Panel>
<Dialog.Overlay>

// v2 pattern (NEW):
<DialogPanel>
<DialogBackdrop>
```

Import from `@headlessui/react`:
```typescript
import { Dialog, DialogPanel, DialogBackdrop, Transition, TransitionChild } from '@headlessui/react'
```

Read the current file first, then update only the Headless UI imports and JSX accordingly. Preserve all existing nav logic.

**Step 3: Commit**

```bash
git add src/modules/layout/components/side-menu/
git commit -m "fix: upgrade SideMenu to Headless UI v2 Dialog API"
```

---

## Phase 5 — Layout Updates

### Task 11: Update Nav

**Files:**
- Modify: `src/modules/layout/templates/nav/index.tsx`

**Step 1: Read current Nav**

Already read above. Current nav is a basic sticky header with SideMenu, store name link, search link, account link, cart button.

**Step 2: Update Nav to solace style**

Replace `src/modules/layout/templates/nav/index.tsx`:

```typescript
import { Suspense } from 'react'
import { listRegions } from '@lib/data/regions'
import { StoreRegion } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import CartButton from '@modules/layout/components/cart-button'
import SideMenu from '@modules/layout/components/side-menu'
import { ThemeSwitcher } from '@modules/common/components/theme-switcher'

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="relative h-16 mx-auto border-b border-basic-primary bg-primary duration-200">
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Mobile: side menu */}
          <div className="flex large:hidden">
            <SideMenu regions={regions} />
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <LocalizedClientLink
              href="/"
              className="text-md font-semibold text-action-primary hover:text-action-primary-hover uppercase tracking-widest"
              data-testid="nav-store-link"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>

          {/* Desktop: nav links */}
          <div className="hidden large:flex items-center gap-6 h-full">
            {process.env.NEXT_PUBLIC_FEATURE_SEARCH_ENABLED && (
              <LocalizedClientLink
                className="text-md text-action-primary hover:text-action-primary-hover transition-colors"
                href="/search"
                scroll={false}
                data-testid="nav-search-link"
              >
                Search
              </LocalizedClientLink>
            )}
            <LocalizedClientLink
              className="text-md text-action-primary hover:text-action-primary-hover transition-colors"
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
          </div>

          {/* Right: theme + cart */}
          <div className="flex items-center gap-2 ml-auto">
            <ThemeSwitcher />
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 text-md text-action-primary hover:text-action-primary-hover"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
```

**Step 3: Verify dev server shows new nav**

```bash
npm run dev
```

Check http://localhost:3000 — nav should show ThemeSwitcher, dark mode should toggle correctly.

**Step 4: Commit**

```bash
git add src/modules/layout/templates/nav/
git commit -m "feat: update Nav with ThemeSwitcher and solace design tokens"
```

---

### Task 12: Update Footer

**Files:**
- Modify or create: `src/modules/layout/templates/footer/index.tsx`

**Step 1: Read current footer**

```bash
find src/modules/layout -name "*.tsx" | xargs grep -l "footer\|Footer" 2>/dev/null
```

**Step 2: Update footer to solace style**

Read the current file, then update to use design tokens. Add navigation links to future content pages. Key changes:
- Replace hardcoded colors with `text-basic-primary`, `text-secondary`, `border-basic-primary`, `bg-primary`
- Add links section: About Us, FAQ, Privacy Policy, Terms & Conditions
- Structure: top section (links grid) + bottom bar (copyright + legal links)

```typescript
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default function Footer() {
  return (
    <footer className="border-t border-basic-primary bg-primary">
      <div className="content-container py-12">
        <div className="grid grid-cols-2 gap-8 medium:grid-cols-4">
          <div>
            <p className="text-md font-semibold text-basic-primary mb-4">Shop</p>
            <ul className="flex flex-col gap-2">
              <li><LocalizedClientLink href="/store" className="text-md text-secondary hover:text-basic-primary transition-colors">All Products</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/categories" className="text-md text-secondary hover:text-basic-primary transition-colors">Categories</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/collections" className="text-md text-secondary hover:text-basic-primary transition-colors">Collections</LocalizedClientLink></li>
            </ul>
          </div>
          <div>
            <p className="text-md font-semibold text-basic-primary mb-4">Account</p>
            <ul className="flex flex-col gap-2">
              <li><LocalizedClientLink href="/account" className="text-md text-secondary hover:text-basic-primary transition-colors">Profile</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/account/orders" className="text-md text-secondary hover:text-basic-primary transition-colors">Orders</LocalizedClientLink></li>
            </ul>
          </div>
          <div>
            <p className="text-md font-semibold text-basic-primary mb-4">Company</p>
            <ul className="flex flex-col gap-2">
              <li><LocalizedClientLink href="/about-us" className="text-md text-secondary hover:text-basic-primary transition-colors">About Us</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/blog" className="text-md text-secondary hover:text-basic-primary transition-colors">Blog</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/faq" className="text-md text-secondary hover:text-basic-primary transition-colors">FAQ</LocalizedClientLink></li>
            </ul>
          </div>
          <div>
            <p className="text-md font-semibold text-basic-primary mb-4">Legal</p>
            <ul className="flex flex-col gap-2">
              <li><LocalizedClientLink href="/privacy-policy" className="text-md text-secondary hover:text-basic-primary transition-colors">Privacy Policy</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/terms-and-conditions" className="text-md text-secondary hover:text-basic-primary transition-colors">Terms & Conditions</LocalizedClientLink></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-basic-primary">
        <div className="content-container py-4 flex items-center justify-between">
          <p className="text-sm text-secondary">© {new Date().getFullYear()} Medusa Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
```

**Step 3: Commit**

```bash
git add src/modules/layout/templates/footer/
git commit -m "feat: update Footer with solace design tokens and content links"
```

---

## Phase 6 — Feature Component Style Refresh

### Task 13: Product Preview card

**Files:**
- Modify: `src/modules/products/components/product-preview/index.tsx`

**Step 1: Read current ProductPreview**

```bash
cat src/modules/products/components/product-preview/index.tsx
```

**Step 2: Update styling to use design tokens**

Apply these changes without altering logic:
- Card background: `bg-primary` → `bg-secondary` on hover: `hover:bg-hover`
- Text colors: replace hardcoded colors with `text-basic-primary`, `text-secondary`
- Border: `border-basic-primary`
- Transition: keep existing hover effects

**Step 3: Commit**

```bash
git add src/modules/products/components/product-preview/
git commit -m "style: update ProductPreview to use design tokens"
```

---

### Task 14: ImageGallery with Embla Carousel

**Files:**
- Modify: `src/modules/products/components/image-gallery/index.tsx`

**Step 1: Read current ImageGallery**

```bash
cat src/modules/products/components/image-gallery/index.tsx
```

**Step 2: Replace with Embla Carousel**

Replace the gallery implementation with Embla:

```typescript
'use client'

import { useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { cn } from '@lib/util/cn'
import { HttpTypes } from '@medusajs/types'

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index)
      setSelectedIndex(index)
    },
    [emblaApi]
  )

  if (!images?.length) return null

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div key={image.id} className="relative min-w-0 flex-[0_0_100%] aspect-square">
              <Image
                src={image.url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => scrollTo(index)}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                selectedIndex === index
                  ? 'border-action-primary'
                  : 'border-basic-primary hover:border-action-primary-hover'
              )}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add src/modules/products/components/image-gallery/
git commit -m "feat: replace ImageGallery with Embla Carousel"
```

---

### Task 15: Cart and Checkout style tokens

**Files:**
- Modify: `src/modules/cart/components/cart-totals/index.tsx`
- Modify: `src/modules/checkout/components/checkout-form/index.tsx` (or equivalent)

**Step 1: Read and update CartTotals**

```bash
cat src/modules/cart/components/cart-totals/index.tsx
```

Apply design tokens: `text-basic-primary`, `text-secondary`, `border-basic-primary`. No logic changes.

**Step 2: Read checkout form**

```bash
find src/modules/checkout -name "*.tsx" | head -10
```

Read the main checkout component and update text/border/bg classes to use design tokens.

**Step 3: Commit**

```bash
git add src/modules/cart/ src/modules/checkout/
git commit -m "style: apply design tokens to cart and checkout components"
```

---

## Phase 7 — New Pages

### Task 16: Blog data layer

**Files:**
- Create: `content/blog/.gitkeep`
- Create: `content/blog/welcome.mdx`
- Create: `src/lib/data/blog.ts`

**Step 1: Create content directory**

```bash
mkdir -p content/blog
```

**Step 2: Create sample post `content/blog/welcome.mdx`**

```mdx
---
title: "Welcome to Our Store Blog"
date: "2026-03-29"
slug: "welcome"
excerpt: "Welcome to our new blog where we share updates, tips, and stories."
author: "Store Team"
---

# Welcome to Our Blog

We're excited to launch our blog! Stay tuned for updates, product stories, and more.
```

**Step 3: Create `src/lib/data/blog.ts`**

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export type BlogPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  content: string
}

export function getAllPosts(): Omit<BlogPost, 'content'>[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const filepath = path.join(BLOG_DIR, filename)
      const { data } = matter(fs.readFileSync(filepath, 'utf-8'))
      return {
        slug: data.slug || filename.replace('.mdx', ''),
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || '',
        author: data.author || '',
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filepath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filepath)) return null

  const { data, content } = matter(fs.readFileSync(filepath, 'utf-8'))
  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    excerpt: data.excerpt || '',
    author: data.author || '',
    content,
  }
}
```

**Step 4: Commit**

```bash
git add content/ src/lib/data/blog.ts
git commit -m "feat: add blog content directory and data layer"
```

---

### Task 17: Blog components

**Files:**
- Create: `src/modules/blog/components/blog-card/index.tsx`
- Create: `src/modules/blog/templates/blog-list/index.tsx`
- Create: `src/modules/blog/templates/blog-detail/index.tsx`

**Step 1: Create BlogCard**

`src/modules/blog/components/blog-card/index.tsx`:

```typescript
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { BlogPost } from '@lib/data/blog'

type BlogCardProps = Pick<BlogPost, 'slug' | 'title' | 'date' | 'excerpt' | 'author'>

export default function BlogCard({ slug, title, date, excerpt, author }: BlogCardProps) {
  return (
    <LocalizedClientLink href={`/blog/${slug}`}>
      <article className="group rounded-xl border border-basic-primary p-6 bg-secondary hover:bg-hover transition-colors">
        <p className="text-sm text-secondary mb-2">
          {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          {author && ` · ${author}`}
        </p>
        <h2 className="text-xl font-medium text-basic-primary mb-2 group-hover:text-action-primary-hover transition-colors">
          {title}
        </h2>
        <p className="text-md text-secondary line-clamp-3">{excerpt}</p>
      </article>
    </LocalizedClientLink>
  )
}
```

**Step 2: Create BlogList template**

`src/modules/blog/templates/blog-list/index.tsx`:

```typescript
import { getAllPosts } from '@lib/data/blog'
import BlogCard from '@modules/blog/components/blog-card'
import { Heading } from '@modules/common/components/heading'

export default function BlogListTemplate() {
  const posts = getAllPosts()

  return (
    <div className="content-container py-12">
      <Heading as="h1" className="text-5xl mb-8">Blog</Heading>
      {posts.length === 0 ? (
        <p className="text-md text-secondary">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 medium:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 3: Create BlogDetail template**

`src/modules/blog/templates/blog-detail/index.tsx`:

```typescript
import { MDXRemote } from 'next-mdx-remote/rsc'
import { BlogPost } from '@lib/data/blog'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default function BlogDetailTemplate({ post }: { post: BlogPost }) {
  return (
    <div className="content-container py-12 max-w-3xl">
      <LocalizedClientLink
        href="/blog"
        className="text-sm text-secondary hover:text-basic-primary transition-colors mb-6 inline-block"
      >
        ← Back to Blog
      </LocalizedClientLink>
      <p className="text-sm text-secondary mb-2">
        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        {post.author && ` · ${post.author}`}
      </p>
      <Heading as="h1" className="text-5xl mb-8">{post.title}</Heading>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXRemote source={post.content} />
      </article>
    </div>
  )
}
```

**Step 4: Commit**

```bash
git add src/modules/blog/
git commit -m "feat: add blog components and templates"
```

---

### Task 18: Blog pages

**Files:**
- Create: `src/app/[countryCode]/(main)/blog/page.tsx`
- Create: `src/app/[countryCode]/(main)/blog/[slug]/page.tsx`

**Step 1: Create blog list page**

`src/app/[countryCode]/(main)/blog/page.tsx`:

```typescript
import { Metadata } from 'next'
import BlogListTemplate from '@modules/blog/templates/blog-list'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News and updates from our store.',
}

export default function BlogPage() {
  return <BlogListTemplate />
}
```

**Step 2: Create blog detail page**

`src/app/[countryCode]/(main)/blog/[slug]/page.tsx`:

```typescript
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@lib/data/blog'
import BlogDetailTemplate from '@modules/blog/templates/blog-detail'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  return <BlogDetailTemplate post={post} />
}
```

**Step 3: Verify routes work**

```bash
npm run dev
```

Navigate to http://localhost:3000/[your-countryCode]/blog — should show the list page.
Navigate to http://localhost:3000/[your-countryCode]/blog/welcome — should show the welcome post.

**Step 4: Commit**

```bash
git add src/app/
git commit -m "feat: add blog list and detail pages"
```

---

### Task 19: Content pages (About, FAQ, Privacy, Terms)

**Files:**
- Create: `content/about-us.mdx`
- Create: `content/faq.mdx`
- Create: `content/privacy-policy.mdx`
- Create: `content/terms-and-conditions.mdx`
- Create: `src/modules/content/templates/content-page/index.tsx`
- Create: `src/app/[countryCode]/(main)/about-us/page.tsx`
- Create: `src/app/[countryCode]/(main)/faq/page.tsx`
- Create: `src/app/[countryCode]/(main)/privacy-policy/page.tsx`
- Create: `src/app/[countryCode]/(main)/terms-and-conditions/page.tsx`

**Step 1: Create MDX content files**

`content/about-us.mdx`:
```mdx
---
title: "About Us"
---

# About Us

We are a modern e-commerce store built on Medusa.

## Our Mission

To provide quality products with an exceptional shopping experience.
```

`content/faq.mdx`:
```mdx
---
title: "Frequently Asked Questions"
---

# Frequently Asked Questions

## How do I track my order?

Log in to your account and visit the Orders section.

## What is your return policy?

We accept returns within 30 days of purchase.

## How can I contact support?

Email us at support@example.com.
```

`content/privacy-policy.mdx`:
```mdx
---
title: "Privacy Policy"
---

# Privacy Policy

*Last updated: March 29, 2026*

We collect and use your personal information only to provide and improve our services.
```

`content/terms-and-conditions.mdx`:
```mdx
---
title: "Terms and Conditions"
---

# Terms and Conditions

*Last updated: March 29, 2026*

By using our store, you agree to these terms.
```

**Step 2: Create shared ContentPage template**

`src/modules/content/templates/content-page/index.tsx`:

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Heading } from '@modules/common/components/heading'

type ContentPageProps = { filename: string }

export default function ContentPageTemplate({ filename }: ContentPageProps) {
  const filepath = path.join(process.cwd(), 'content', `${filename}.mdx`)
  const source = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(source)

  return (
    <div className="content-container py-12 max-w-3xl">
      <Heading as="h1" className="text-5xl mb-8">{data.title}</Heading>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXRemote source={content} />
      </article>
    </div>
  )
}
```

**Step 3: Create the 4 page files**

`src/app/[countryCode]/(main)/about-us/page.tsx`:
```typescript
import ContentPageTemplate from '@modules/content/templates/content-page'
export default function AboutPage() {
  return <ContentPageTemplate filename="about-us" />
}
```

`src/app/[countryCode]/(main)/faq/page.tsx`:
```typescript
import ContentPageTemplate from '@modules/content/templates/content-page'
export default function FaqPage() {
  return <ContentPageTemplate filename="faq" />
}
```

`src/app/[countryCode]/(main)/privacy-policy/page.tsx`:
```typescript
import ContentPageTemplate from '@modules/content/templates/content-page'
export default function PrivacyPage() {
  return <ContentPageTemplate filename="privacy-policy" />
}
```

`src/app/[countryCode]/(main)/terms-and-conditions/page.tsx`:
```typescript
import ContentPageTemplate from '@modules/content/templates/content-page'
export default function TermsPage() {
  return <ContentPageTemplate filename="terms-and-conditions" />
}
```

**Step 4: Verify all 4 pages load**

```bash
npm run dev
```

Navigate to /about-us, /faq, /privacy-policy, /terms-and-conditions for your country code.

**Step 5: Commit**

```bash
git add content/ src/modules/content/ src/app/
git commit -m "feat: add About, FAQ, Privacy Policy, Terms content pages"
```

---

## Phase 8 — Final Verification

### Task 20: TypeScript check and E2E smoke test

**Step 1: TypeScript check**

```bash
npx tsc --noEmit 2>&1
```

Expected: no errors (or only pre-existing ones).

**Step 2: Production build**

```bash
npm run build:next 2>&1 | tail -20
```

Expected: build completes successfully.

**Step 3: Run existing E2E tests**

```bash
npx playwright test e2e --project=chromium 2>&1 | tail -30
```

Expected: existing tests still pass (cart, checkout, account).

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete solace style and feature alignment migration"
```

---

## Summary

| Phase | Tasks | Outcome |
|-------|-------|---------|
| 1: Design System | Tasks 1–3 | Solace design tokens, cn utility, CSS variables |
| 2: Dependencies | Task 4 | CVA, Zustand, next-themes, Sonner, Embla installed |
| 3: Theme | Task 5 | Dark/light mode via next-themes |
| 4: Components | Tasks 6–10 | Button, Box, Container, Heading, Text, Badge, Stepper, SideMenu upgrade |
| 5: Layout | Tasks 11–12 | Nav with ThemeSwitcher, Footer with content links |
| 6: Feature | Tasks 13–15 | Product, Cart, Checkout style tokens |
| 7: New Pages | Tasks 16–19 | Blog (MDX), About/FAQ/Privacy/Terms |
| 8: QA | Task 20 | TypeScript + build + E2E verification |
