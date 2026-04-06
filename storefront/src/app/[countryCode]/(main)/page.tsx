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
