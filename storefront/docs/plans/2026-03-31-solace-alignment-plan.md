# Solace Alignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring the storefront visually and functionally in line with `solace-medusa-starter`, replacing all Strapi CMS dependencies with static config or Medusa API data.

**Architecture:** Copy components directly from `solace-medusa-starter/src`, stripping `CollectionsData` (Strapi) props and replacing with Medusa-only data. Static hero/banner content lives in `src/lib/config/home.ts`. Blog data comes from local MDX files already in `content/blog/`.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS, @medusajs/ui, @headlessui/react v2, embla-carousel-react, unified/remark/hast (already installed)

**Reference:** `D:/workspace/standalone-website/solace-medusa-starter/src`

---

## Task 1: Add `createNavigation` and constants helpers

**Files:**
- Modify: `src/lib/constants.tsx`

**Step 1: Read current constants file**

```bash
# Check what currently exists
cat src/lib/constants.tsx
```

**Step 2: Add `createNavigation` and `checkoutFooterNavigation` and `passwordRequirements`**

Append to `src/lib/constants.tsx`:

```typescript
import { StoreCollection, StoreProductCategory } from '@medusajs/types'

export const createNavigation = (
  productCategories: StoreProductCategory[],
  collections?: StoreCollection[]
) => [
  {
    name: 'Shop',
    handle: '/shop',
    category_children: productCategories
      .filter((category) => !category.parent_category)
      .map((category) => ({
        name: category.name,
        type: 'parent_category',
        handle: `/categories/${category.handle}`,
        category_children: (category.category_children ?? []).map((sub) => ({
          name: sub.name,
          handle: `/categories/${sub.handle}`,
          icon: null,
          category_children: null,
        })),
      })),
  },
  {
    name: 'Collections',
    handle: '/shop',
    category_children: !collections
      ? null
      : collections.map((collection) => ({
          name: collection.title,
          type: 'collection',
          handle: `/collections/${collection.handle}`,
          handle_id: collection.handle,
          category_children: null,
        })),
  },
  {
    name: 'Blog',
    handle: '/blog',
    category_children: null,
  },
]

export const checkoutFooterNavigation = [
  { title: 'Privacy Policy', href: '/privacy' },
  { title: 'Terms of Use', href: '/terms' },
  { title: 'Cookie Policy', href: '/cookies' },
]

export const passwordRequirements = [
  'At least 8 characters',
  'At least one uppercase letter',
  'At least one lowercase letter',
  'At least one number',
]
```

**Step 3: Commit**

```bash
git add src/lib/constants.tsx
git commit -m "feat: add createNavigation, checkoutFooterNavigation, passwordRequirements"
```

---

## Task 2: Add static home config

**Files:**
- Create: `src/lib/config/home.ts`

**Step 1: Create config file**

```typescript
export const heroBannerConfig = {
  headline: 'Discover Your Style',
  text: 'Explore our curated collection of premium essentials designed for everyday comfort and timeless style.',
  cta: {
    text: 'Shop Now',
    link: '/shop',
  },
  image: {
    url: 'https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png',
    alt: 'Hero banner',
  },
}

export const midBannerConfig = {
  headline: 'New Arrivals',
  text: 'Fresh styles just landed. Be the first to explore our latest collection.',
  cta: {
    text: 'Explore',
    link: '/shop',
  },
  image: {
    url: 'https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png',
    alt: 'Mid banner',
  },
}
```

**Step 2: Commit**

```bash
git add src/lib/config/home.ts
git commit -m "feat: add static home banner config"
```

---

## Task 3: Create home module components

**Files:**
- Create: `src/modules/home/components/hero/index.tsx`
- Create: `src/modules/home/components/banner/index.tsx`
- Create: `src/modules/home/components/collections/index.tsx`
- Create: `src/modules/home/components/explore-blog/index.tsx`

**Step 1: Hero component**

`src/modules/home/components/hero/index.tsx`:
```typescript
import Image from 'next/image'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Text } from '@modules/common/components/text'

type HeroConfig = {
  headline: string
  text: string
  cta: { text: string; link: string }
  image: { url: string; alt: string }
}

const Hero = ({ data }: { data: HeroConfig }) => {
  return (
    <>
      <Box className="h-[168px] max-h-[368px] w-full small:h-[368px] 2xl:h-[468px] 2xl:max-h-[468px]">
        <Image
          src={data.image.url}
          alt={data.image.alt}
          className="h-full w-full object-cover"
          width={1000}
          height={600}
          priority
        />
      </Box>
      <Container className="flex flex-col gap-2 !py-6 small:gap-8 small:!py-10">
        <Heading className="max-w-full text-4xl text-basic-primary small:max-w-[510px] medium:text-5xl">
          {data.headline}
        </Heading>
        <Box className="flex flex-col-reverse justify-between gap-8 medium:flex-row medium:items-center">
          <Button asChild className="w-max">
            <LocalizedClientLink href={data.cta.link}>
              {data.cta.text}
            </LocalizedClientLink>
          </Button>
          <Text size="lg" className="max-w-full text-basic-primary medium:max-w-[410px] medium:text-end">
            {data.text}
          </Text>
        </Box>
      </Container>
    </>
  )
}

export default Hero
```

**Step 2: Banner component**

`src/modules/home/components/banner/index.tsx`:
```typescript
import Image from 'next/image'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Text } from '@modules/common/components/text'

type BannerConfig = {
  headline: string
  text: string
  cta: { text: string; link: string }
  image: { url: string; alt: string }
}

export const Banner = ({ data }: { data: BannerConfig }) => {
  return (
    <Container>
      <Box className="relative h-[440px]">
        <Image
          src={data.image.url}
          alt={data.image.alt}
          fill
          className="object-cover object-right-top"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-white">
          <Heading className="text-3xl">{data.headline}</Heading>
          <Text size="lg" className="mt-2 medium:max-w-[600px]">
            {data.text}
          </Text>
          <Button className="mt-8" asChild>
            <LocalizedClientLink href={data.cta.link}>
              {data.cta.text}
            </LocalizedClientLink>
          </Button>
        </div>
      </Box>
    </Container>
  )
}
```

**Step 3: Collections component (Medusa-only, no Strapi)**

`src/modules/home/components/collections/index.tsx`:
```typescript
import Image from 'next/image'
import { StoreCollection } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
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
  id,
}: {
  title: string
  handle: string
  imgSrc: string
  id: number
}) => (
  <Box className={cn('group relative', {
    'small:col-start-2 small:row-start-1 small:row-end-3': id === 1,
  })}>
    <Image
      src={imgSrc}
      alt={`${title} collection`}
      width={600}
      height={300}
      className="h-full w-full object-cover object-center"
    />
    <Box className="absolute left-0 top-0 hidden h-full w-full flex-col p-6 small:flex large:p-10">
      <Button asChild className="w-max self-end opacity-0 transition-all duration-500 group-hover:opacity-100">
        <LocalizedClientLink href={`/collections/${handle}`}>Discover</LocalizedClientLink>
      </Button>
      <Box className="mt-auto text-static">
        <Heading as="h3" className="text-2xl large:text-3xl">{title}</Heading>
      </Box>
    </Box>
    <Box className="absolute left-0 top-0 block h-full w-full p-6 small:hidden">
      <LocalizedClientLink href={`/collections/${handle}`} className="flex h-full w-full flex-col justify-end">
        <Heading as="h3" className="text-2xl text-static">{title}</Heading>
      </LocalizedClientLink>
    </Box>
  </Box>
)

const Collections = ({ collections }: { collections: StoreCollection[] }) => {
  const display = collections.slice(0, 3)
  if (!display.length) return null

  return (
    <Container className="grid max-h-[660px] grid-rows-3 gap-2 small:max-h-[440px] small:grid-cols-2 small:grid-rows-2 large:max-h-[660px]">
      {display.map((collection, id) => (
        <CollectionTile
          key={collection.id}
          title={collection.title}
          handle={collection.handle!}
          imgSrc={PLACEHOLDER_IMAGES[id] ?? PLACEHOLDER_IMAGES[0]}
          id={id}
        />
      ))}
    </Container>
  )
}

export default Collections
```

**Step 4: ExploreBlog component (local MDX posts)**

`src/modules/home/components/explore-blog/index.tsx`:
```typescript
'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { BlogCard } from '@modules/blog/components/blog-card'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

type Post = { slug: string; title: string; date: string; excerpt: string; author: string }

export function ExploreBlog({ posts }: { posts: Post[] }) {
  const [emblaRef] = useEmblaCarousel({ align: 'start', loop: false })

  return (
    <Container className="overflow-hidden">
      <Box className="flex flex-col gap-6 small:gap-12">
        <Box className="flex items-center justify-between">
          <Heading as="h2" className="text-2xl text-basic-primary small:text-3xl">
            Get inspired
          </Heading>
          <Button className="hidden w-max large:flex" variant="tonal" asChild>
            <LocalizedClientLink href="/blog">Read more</LocalizedClientLink>
          </Button>
        </Box>
        <Box className="hidden items-center gap-2 large:grid large:grid-cols-3">
          {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
        </Box>
        <div ref={emblaRef} className="block large:hidden">
          <Box className="flex gap-2">
            {posts.map((post) => (
              <Box key={post.slug} className="flex-[0_0_calc(72.666%-8px)]">
                <BlogCard post={post} />
              </Box>
            ))}
          </Box>
        </div>
        <Button className="mx-auto flex w-max large:hidden" variant="tonal" asChild>
          <LocalizedClientLink href="/blog">Read more</LocalizedClientLink>
        </Button>
      </Box>
    </Container>
  )
}
```

**Step 5: Commit**

```bash
git add src/modules/home/
git commit -m "feat: add home module components (hero, banner, collections, explore-blog)"
```

---

## Task 4: Rewrite homepage

**Files:**
- Modify: `src/app/[countryCode]/(main)/page.tsx`

**Step 1: Replace homepage**

```typescript
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCollectionsList } from '@lib/data/collections'
import { getProductsList } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import { getAllPosts } from '@lib/data/blog'
import { heroBannerConfig, midBannerConfig } from '@lib/config/home'
import { Banner } from '@modules/home/components/banner'
import Collections from '@modules/home/components/collections'
import { ExploreBlog } from '@modules/home/components/explore-blog'
import Hero from '@modules/home/components/hero'
import { ProductCarousel } from '@modules/products/components/product-carousel'
import SkeletonProductsCarousel from '@modules/skeletons/templates/skeleton-products-carousel'

export const metadata: Metadata = {
  title: 'Store',
  description: 'A performant frontend ecommerce starter with Next.js and Medusa.',
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const [{ collections }, { response: { products } }, region] = await Promise.all([
    getCollectionsList(),
    getProductsList({ pageParam: 0, queryParams: { limit: 9 }, countryCode }),
    getRegion(countryCode),
  ])

  const posts = getAllPosts().slice(0, 3)

  return (
    <>
      <Hero data={heroBannerConfig} />
      {collections?.length > 0 && <Collections collections={collections} />}
      {products && region && (
        <Suspense fallback={<SkeletonProductsCarousel />}>
          <ProductCarousel
            products={products}
            regionId={region.id}
            title="Our bestsellers"
            viewAll={{ link: '/shop', text: 'View all' }}
          />
        </Suspense>
      )}
      <Banner data={midBannerConfig} />
      {posts.length > 0 && <ExploreBlog posts={posts} />}
    </>
  )
}
```

**Step 2: Verify build**

```bash
cd D:/workspace/standalone-website/e-commerce/storefront
npx tsc --noEmit 2>&1 | head -30
```

**Step 3: Commit**

```bash
git add src/app/[countryCode]/\(main\)/page.tsx
git commit -m "feat: rewrite homepage with static banners and Medusa data"
```

---

## Task 5: Navigation — dropdown-menu and collections-menu

**Files:**
- Create: `src/modules/layout/templates/nav/dropdown-menu.tsx`
- Create: `src/modules/layout/templates/nav/collections-menu.tsx`

**Step 1: Create dropdown-menu.tsx** (copied from solace, no changes needed)

```typescript
import React from 'react'
import { cn } from '@lib/util/cn'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { NavigationItem } from '@modules/common/components/navigation-item'

interface CategoryItem {
  name: string
  handle: string
  category_children?: CategoryItem[]
}

interface DropdownMenuProps {
  item: CategoryItem
  activeItem: { name: string; handle: string } | null
  children: React.ReactNode
  customContent?: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  item, activeItem, children, customContent, isOpen, onOpenChange,
}) => {
  const renderSubcategories = (categories: CategoryItem[]) => (
    <Container className="flex flex-col gap-6 !px-14 !pb-8 !pt-5">
      <Button variant="tonal" className="w-max !px-3 !py-2" onClick={() => onOpenChange(false)} asChild>
        <LocalizedClientLink href={activeItem?.handle ?? '/'}>
          Shop all {activeItem?.name === 'Shop' || activeItem?.name === 'Collections' ? '' : activeItem?.name}
        </LocalizedClientLink>
      </Button>
      <div className="grid grid-cols-4 gap-8">
        {categories.map((subItem, index) => (
          <div key={index} className="flex flex-col gap-2">
            <NavigationItem
              href={subItem.handle}
              className="w-max py-2 text-lg text-basic-primary hover:border-b hover:border-action-primary"
            >
              {subItem.name}
            </NavigationItem>
            {subItem.category_children && (
              <div className="flex flex-col">
                {subItem.category_children.map((child, ci) => (
                  <NavigationItem key={ci} href={child.handle} className="py-1.5 text-md text-secondary">
                    {child.name}
                  </NavigationItem>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Container>
  )

  return (
    <div className="flex" onMouseEnter={() => onOpenChange(true)} onMouseLeave={() => onOpenChange(false)}>
      {children}
      {item.category_children && (
        <Box className={cn(
          'absolute left-0 top-full z-50 w-full bg-primary shadow-lg transition-all duration-300',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none invisible opacity-0'
        )}>
          {customContent ?? renderSubcategories(item.category_children)}
        </Box>
      )}
    </div>
  )
}

export default DropdownMenu
```

**Step 2: Create collections-menu.tsx** (Medusa-only, no Strapi images)

```typescript
import { StoreCollection } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default function CollectionsMenu({ collections }: { collections: StoreCollection[] }) {
  if (!collections?.length) return null

  return (
    <Container className="flex flex-col gap-4 !px-14 !pb-8 !pt-5">
      <Button variant="tonal" className="w-max !px-3 !py-2" asChild>
        <LocalizedClientLink href="/shop">Shop all collections</LocalizedClientLink>
      </Button>
      <div className="grid grid-cols-4 gap-4">
        {collections.map((collection) => (
          <Box key={collection.id}>
            <LocalizedClientLink
              href={`/collections/${collection.handle}`}
              className="py-2 text-lg text-basic-primary hover:border-b hover:border-action-primary"
            >
              {collection.title}
            </LocalizedClientLink>
          </Box>
        ))}
      </div>
    </Container>
  )
}
```

**Step 3: Commit**

```bash
git add src/modules/layout/templates/nav/dropdown-menu.tsx src/modules/layout/templates/nav/collections-menu.tsx
git commit -m "feat: add nav dropdown-menu and collections-menu components"
```

---

## Task 6: Navigation — navigation.tsx

**Files:**
- Create: `src/modules/layout/templates/nav/navigation.tsx`

**Step 1: Create navigation.tsx** (adapted from solace, no Strapi)

```typescript
'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createNavigation } from '@lib/constants'
import { cn } from '@lib/util/cn'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { NavigationItem } from '@modules/common/components/navigation-item'
import CollectionsMenu from './collections-menu'
import DropdownMenu from './dropdown-menu'

export default function Navigation({
  countryCode,
  productCategories,
  collections,
}: {
  countryCode: string
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
}) {
  const pathname = usePathname()
  const [openDropdown, setOpenDropdown] = useState<{ name: string; handle: string } | null>(null)

  const navigation = useMemo(
    () => createNavigation(productCategories, collections),
    [productCategories, collections]
  )

  return (
    <Box className="hidden gap-4 self-stretch large:flex">
      {navigation.map((item, index) => {
        const handle = item.name.toLowerCase().replace(' ', '-')
        const active = pathname.includes(`/${countryCode}/${handle}`) ||
          (handle === 'shop' && pathname.includes(`/${countryCode}/categories`))

        return (
          <DropdownMenu
            key={index}
            item={item}
            activeItem={openDropdown}
            isOpen={openDropdown?.name === item.name}
            onOpenChange={(open) => setOpenDropdown(open ? { name: item.name, handle: item.handle } : null)}
            customContent={
              item.name === 'Collections'
                ? <CollectionsMenu collections={collections} />
                : undefined
            }
          >
            <div className="flex h-full items-center">
              <NavigationItem
                href={`/${countryCode}${item.handle}`}
                className={cn('!py-2 px-2', { 'border-b border-action-primary': active })}
              >
                {item.name}
              </NavigationItem>
            </div>
          </DropdownMenu>
        )
      })}
    </Box>
  )
}
```

**Step 2: Commit**

```bash
git add src/modules/layout/templates/nav/navigation.tsx
git commit -m "feat: add nav navigation component with dropdown support"
```

---

## Task 7: Navigation — side-menu (mobile)

**Files:**
- Modify: `src/modules/layout/components/side-menu/index.tsx`

**Step 1: Replace side-menu with adapted solace version** (remove Strapi image rendering for collections)

Key change from solace: in `renderCategories`, remove the `item.type === 'collection' && strapiCollection` branch that renders an image. Show all items as plain links.

```typescript
'use client'

import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { createNavigation } from '@lib/constants'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import {
  Dialog, DialogBody, DialogContent, DialogHeader,
  DialogOverlay, DialogPortal, DialogTitle, DialogTrigger,
} from '@modules/common/components/dialog'
import Divider from '@modules/common/components/divider'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ArrowLeftIcon, BarsIcon, ChevronRightIcon, XIcon } from '@modules/common/icons'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

interface CategoryItem { name: string; handle: string }

const SideMenu = ({
  productCategories,
  collections,
}: {
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
}) => {
  const [categoryStack, setCategoryStack] = useState<CategoryItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const navigation = useMemo(
    () => createNavigation(productCategories, collections),
    [productCategories, collections]
  )

  const currentCategory = categoryStack[categoryStack.length - 1] || null

  const handleOpenDialogChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) setCategoryStack([])
  }

  const renderCategories = (categories: any[]) => {
    const lastCategoryIndex = categories.findLastIndex((cat) => cat.type === 'parent_category')
    return categories.map((item, index) => {
      const hasChildren = item.category_children?.length > 0
      return (
        <Fragment key={index}>
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={hasChildren
              ? () => setCategoryStack([...categoryStack, { name: item.name, handle: item.handle }])
              : () => handleOpenDialogChange(false)}
            asChild={!hasChildren}
          >
            {hasChildren ? (
              <><span>{item.name}</span><ChevronRightIcon className="h-5 w-5" /></>
            ) : (
              <LocalizedClientLink href={item.handle}>{item.name}</LocalizedClientLink>
            )}
          </Button>
          {index === lastCategoryIndex && <Divider className="my-4 -ml-4 w-[calc(100%+2rem)]" />}
        </Fragment>
      )
    })
  }

  const getActiveCategories = () => {
    let current = [...(navigation[0]?.category_children || []), ...navigation.slice(1)]
    for (const cat of categoryStack) {
      const found = current.find((item) => item.name === cat.name)
      if (found?.category_children) current = found.category_children.map((c: any) => ({ ...c, icon: null }))
      else break
    }
    return current
  }

  if (!mounted) {
    return (
      <Button variant="icon" withIcon className="flex h-auto !p-2 xsmall:!p-3.5 large:hidden" disabled>
        <BarsIcon />
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenDialogChange}>
      <DialogTrigger asChild>
        <Button variant="icon" withIcon className="flex h-auto !p-2 xsmall:!p-3.5 large:hidden">
          <BarsIcon />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="!max-h-full !max-w-full !rounded-none" aria-describedby={undefined}>
          <DialogHeader className="flex items-center gap-4 !p-4 text-xl text-basic-primary">
            {currentCategory && (
              <Button variant="tonal" withIcon size="sm" onClick={() => setCategoryStack(categoryStack.slice(0, -1))}>
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
            )}
            {currentCategory?.name || 'Menu'}
            <Button onClick={() => handleOpenDialogChange(false)} variant="icon" withIcon size="sm" className="ml-auto p-2">
              <XIcon />
            </Button>
          </DialogHeader>
          <VisuallyHidden.Root><DialogTitle>Menu modal</DialogTitle></VisuallyHidden.Root>
          <DialogBody className="overflow-y-auto p-4 small:p-5">
            <Box className="flex flex-col">
              {(!currentCategory || currentCategory.name !== 'Collections') && (
                <Button variant="tonal" className="mb-4 w-max" size="sm" onClick={() => handleOpenDialogChange(false)} asChild={!!currentCategory}>
                  <LocalizedClientLink href={currentCategory ? currentCategory.handle : '/shop'}>
                    Shop all {currentCategory && currentCategory.name !== 'Shop' ? currentCategory.name : ''}
                  </LocalizedClientLink>
                </Button>
              )}
              {renderCategories(getActiveCategories())}
            </Box>
          </DialogBody>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default SideMenu
```

**Step 2: Commit**

```bash
git add src/modules/layout/components/side-menu/index.tsx
git commit -m "feat: update side-menu with navigation and category stack"
```

---

## Task 8: Navigation — profile button + dropdown

**Files:**
- Create: `src/modules/layout/components/profile-button/index.tsx`
- Create: `src/modules/layout/components/profile-dropdown/index.tsx`
- Create: `src/modules/layout/components/profile-dropdown/theme-switcher.tsx`

**Step 1: Check if theme-switcher exists in solace**

```bash
ls D:/workspace/standalone-website/solace-medusa-starter/src/modules/layout/components/profile-dropdown/
```

**Step 2: Copy profile-button.tsx** (exact copy from solace)

```typescript
import { getCustomer } from '@lib/data/customer'
import ProfileDropdown from '../profile-dropdown'

export default async function ProfileButton() {
  const customer = await getCustomer().catch(() => null)
  return <ProfileDropdown loggedIn={!!customer} />
}
```

**Step 3: Copy profile-dropdown/index.tsx** (exact copy from solace — already has correct @headlessui/react v2 API)

Copy the file verbatim from:
`D:/workspace/standalone-website/solace-medusa-starter/src/modules/layout/components/profile-dropdown/index.tsx`

**Step 4: Copy theme-switcher.tsx**

Copy verbatim from:
`D:/workspace/standalone-website/solace-medusa-starter/src/modules/layout/components/profile-dropdown/theme-switcher.tsx`

**Step 5: Commit**

```bash
git add src/modules/layout/components/profile-button/ src/modules/layout/components/profile-dropdown/
git commit -m "feat: add profile button and dropdown with theme switcher"
```

---

## Task 9: Navigation — nav-content, nav-actions, nav/index

**Files:**
- Create: `src/modules/layout/templates/nav/nav-actions.tsx`
- Create: `src/modules/layout/templates/nav/nav-content.tsx`
- Modify: `src/modules/layout/templates/nav/index.tsx`

**Step 1: Create nav-actions.tsx**

```typescript
import { Box } from '@modules/common/components/box'
import CartButton from '@modules/layout/components/cart-button'
import ProfileButton from '@modules/layout/components/profile-button'

export default function NavActions() {
  return (
    <Box className="flex items-center !py-4">
      <ProfileButton />
      <CartButton />
    </Box>
  )
}
```

**Step 2: Create nav-content.tsx**

```typescript
'use client'

import { useState } from 'react'
import { cn } from '@lib/util/cn'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { SearchIcon, SolaceLogo } from '@modules/common/icons'
import SideMenu from '@modules/layout/components/side-menu'
import Navigation from './navigation'
import { StoreCollection, StoreProductCategory } from '@medusajs/types'

export default function NavContent({
  productCategories,
  collections,
  countryCode,
}: {
  productCategories: StoreProductCategory[]
  collections: StoreCollection[]
  countryCode: string
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <>
      <Box className="flex large:hidden">
        <SideMenu productCategories={productCategories} collections={collections} />
      </Box>
      {!isSearchOpen && (
        <Navigation countryCode={countryCode} productCategories={productCategories} collections={collections} />
      )}
      <Box className={cn('relative block', {
        'medium:absolute medium:left-1/2 medium:top-1/2 medium:-translate-x-1/2 medium:-translate-y-1/2': !isSearchOpen,
      })}>
        <LocalizedClientLink href="/">
          <SolaceLogo className="h-6 medium:h-7" />
        </LocalizedClientLink>
      </Box>
      {!isSearchOpen && (
        <Button
          variant="icon"
          withIcon
          className="ml-auto h-auto !p-2 xsmall:!p-3.5"
          onClick={() => setIsSearchOpen(true)}
          data-testid="search-button"
        >
          <SearchIcon />
        </Button>
      )}
    </>
  )
}
```

**Step 3: Rewrite nav/index.tsx**

```typescript
import { listCategories } from '@lib/data/categories'
import { getCollectionsList } from '@lib/data/collections'
import { Container } from '@modules/common/components/container'
import NavActions from './nav-actions'
import NavContent from './nav-content'

export default async function NavWrapper({ countryCode }: { countryCode: string }) {
  const [productCategories, { collections }] = await Promise.all([
    listCategories(),
    getCollectionsList(),
  ])

  return (
    <Container
      as="nav"
      className="duration-400 sticky top-0 z-50 mx-0 max-w-full border-b border-basic-primary bg-primary !py-0 transition-all ease-in-out medium:!px-14"
    >
      <Container className="flex items-center justify-between !p-0">
        <NavContent
          productCategories={productCategories ?? []}
          collections={collections ?? []}
          countryCode={countryCode}
        />
        <NavActions />
      </Container>
    </Container>
  )
}
```

**Step 4: Commit**

```bash
git add src/modules/layout/templates/nav/
git commit -m "feat: rebuild nav with mega-menu, profile button, and search"
```

---

## Task 10: Loading states

**Files:**
- Create: `src/app/[countryCode]/(main)/blog/loading.tsx`
- Create: `src/app/[countryCode]/(main)/store/loading.tsx`
- Create: `src/app/[countryCode]/(main)/categories/[...category]/loading.tsx`
- Create: `src/app/[countryCode]/(main)/collections/[handle]/loading.tsx`
- Create: `src/app/[countryCode]/(main)/results/[query]/loading.tsx`

**Step 1: Copy blog loading** (exact copy from solace)

Content from solace `app/[countryCode]/(main)/blog/loading.tsx` — already captured above.

**Step 2: Store loading**

```typescript
import { Container } from '@modules/common/components/container'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'

export default function Loading() {
  return (
    <Container className="flex flex-col gap-8 !py-8">
      <div className="h-10 w-[200px] animate-pulse bg-skeleton-primary" />
      <SkeletonProductGrid />
    </Container>
  )
}
```

**Step 3: Categories and collections loading** (same content — captured above from solace)

**Step 4: Results loading**

```typescript
import { Container } from '@modules/common/components/container'
import SkeletonProductGrid from '@modules/skeletons/templates/skeleton-product-grid'

export default function Loading() {
  return (
    <Container className="flex flex-col gap-8 !py-8">
      <div className="h-10 w-[200px] animate-pulse bg-skeleton-primary" />
      <SkeletonProductGrid />
    </Container>
  )
}
```

**Step 5: Commit**

```bash
git add src/app/
git commit -m "feat: add loading skeleton states to all list pages"
```

---

## Task 11: Breadcrumbs component + category/collection layouts

**Files:**
- Create: `src/modules/common/components/breadcrumbs/index.tsx`
- Create: `src/modules/store/templates/breadcrumbs/index.tsx`
- Create: `src/app/[countryCode]/(main)/categories/[...category]/layout.tsx`
- Create: `src/app/[countryCode]/(main)/collections/[handle]/layout.tsx`

**Step 1: Create breadcrumbs component** (exact copy from solace — captured above)

**Step 2: Check if `src/lib/util/slot.ts` exists**

```bash
ls src/lib/util/
```

If `slot.ts` doesn't exist, copy from solace:
`D:/workspace/standalone-website/solace-medusa-starter/src/lib/util/slot.ts`

**Step 3: Create StoreBreadcrumbs**

Check if `src/modules/store/templates/breadcrumbs/index.tsx` exists in solace and copy it verbatim.

If not, create:
```typescript
import { Breadcrumbs, BreadcrumbsItem, BreadcrumbsList, BreadcrumbsLink, BreadcrumbsSeparator, BreadcrumbsStatic } from '@modules/common/components/breadcrumbs'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default function StoreBreadcrumbs({ breadcrumb }: { breadcrumb: string }) {
  return (
    <Breadcrumbs>
      <BreadcrumbsList>
        <BreadcrumbsItem>
          <BreadcrumbsLink asChild>
            <LocalizedClientLink href="/store" className="text-sm text-secondary hover:text-basic-primary">
              Store
            </LocalizedClientLink>
          </BreadcrumbsLink>
        </BreadcrumbsItem>
        <BreadcrumbsSeparator />
        <BreadcrumbsItem>
          <BreadcrumbsStatic className="text-sm">{breadcrumb}</BreadcrumbsStatic>
        </BreadcrumbsItem>
      </BreadcrumbsList>
    </Breadcrumbs>
  )
}
```

**Step 4: Copy category layout** (exact copy from solace — captured above)

**Step 5: Copy collections layout** (exact copy from solace — captured above)

**Step 6: Commit**

```bash
git add src/modules/common/components/breadcrumbs/ src/modules/store/templates/breadcrumbs/ src/app/[countryCode]/\(main\)/categories/ src/app/[countryCode]/\(main\)/collections/
git commit -m "feat: add breadcrumbs component and category/collection layouts"
```

---

## Task 12: Checkout layout

**Files:**
- Create: `src/modules/layout/templates/checkout-nav/index.tsx`
- Create: `src/modules/layout/templates/checkout-footer/index.tsx`
- Modify: `src/app/[countryCode]/(checkout)/layout.tsx`

**Step 1: Copy checkout-nav** (exact copy from solace — captured above)

**Step 2: Copy checkout-footer** (exact copy from solace — captured above; uses `checkoutFooterNavigation` from constants added in Task 1)

**Step 3: Check current checkout layout and update**

Read `src/app/[countryCode]/(checkout)/layout.tsx`, then replace with the solace version (captured above).

**Step 4: Commit**

```bash
git add src/modules/layout/templates/checkout-nav/ src/modules/layout/templates/checkout-footer/ src/app/[countryCode]/\(checkout\)/layout.tsx
git commit -m "feat: add checkout-specific nav and footer layout"
```

---

## Task 13: Password reset UI

**Files:**
- Create: `src/app/[countryCode]/(main)/reset-password/page.tsx`
- Create: `src/modules/reset-password/components/reset-password.tsx`
- Create: `src/modules/reset-password/templates/index.tsx`
- Create: `src/lib/util/validator.ts`

**Step 1: Create validator utility**

```typescript
export type ValidationError = { field: string; message: string }

export function validatePassword(password: string): string[] {
  const errors: string[] = []
  if (password.length < 8) errors.push('At least 8 characters')
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter')
  if (!/[0-9]/.test(password)) errors.push('At least one number')
  return errors
}
```

**Step 2: Check if `resetPassword` action exists in customer data**

```bash
grep -n "resetPassword" src/lib/data/customer.ts
```

If missing, add to `src/lib/data/customer.ts`:
```typescript
export async function resetPassword(
  _currentState: unknown,
  formData: FormData
) {
  const token = formData.get('token') as string
  const email = formData.get('email') as string
  const password = formData.get('new_password') as string

  if (!token || !email || !password) return 'Missing required fields'

  try {
    await sdk.auth.resetPassword('customer', 'emailpass', { token, email, password })
    return null
  } catch (e: any) {
    return e.message
  }
}
```

**Step 3: Copy reset-password component** (exact copy from solace — captured above)

**Step 4: Copy reset-password template** (exact copy from solace — captured above)

**Step 5: Create page**

```typescript
import { ResetPasswordTemplate } from '@modules/reset-password/templates'

export const dynamic = 'force-dynamic'

export default function ResetPasswordPage() {
  return <ResetPasswordTemplate />
}
```

**Step 6: Commit**

```bash
git add src/app/[countryCode]/\(main\)/reset-password/ src/modules/reset-password/ src/lib/util/validator.ts
git commit -m "feat: add reset password UI page"
```

---

## Task 14: Skeleton components (ensure parity)

**Files:**
- Verify/create: `src/modules/skeletons/templates/skeleton-products-carousel/index.tsx`
- Verify/create: `src/modules/skeletons/templates/skeleton-product-grid/index.tsx`
- Verify/create: `src/modules/skeletons/components/skeleton-post-tile/index.tsx`
- Verify/create: `src/modules/skeletons/templates/skeleton-post-tile/index.tsx`

**Step 1: Check what skeleton files exist**

```bash
find src/modules/skeletons -type f | sort
```

**Step 2: Create any missing skeletons** using solace file contents captured above.

**Step 3: Commit**

```bash
git add src/modules/skeletons/
git commit -m "feat: ensure skeleton components parity with solace"
```

---

## Task 15: Final verification and push

**Step 1: Type check**

```bash
cd D:/workspace/standalone-website/e-commerce/storefront
npx tsc --noEmit 2>&1 | head -50
```

Fix any TypeScript errors before proceeding.

**Step 2: Build check**

```bash
npm run build 2>&1 | tail -30
```

**Step 3: Push to trigger Railway deploy**

```bash
cd D:/workspace/standalone-website/e-commerce
git push
```
