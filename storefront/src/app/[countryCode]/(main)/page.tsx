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
