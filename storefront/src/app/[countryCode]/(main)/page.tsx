import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCollectionsList } from '@lib/data/collections'
import { getProductsList } from '@lib/data/products'
import { getRegion } from '@lib/data/regions'
import { getAllPosts } from '@lib/data/blog'
import { getBanner } from '@lib/data/cms'
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

  const [{ collections }, { response: { products } }, region, allPosts, heroBanner, midBanner] = await Promise.all([
    getCollectionsList(),
    getProductsList({ pageParam: 0, queryParams: { limit: 9 }, countryCode }),
    getRegion(countryCode),
    getAllPosts(),
    getBanner("hero"),
    getBanner("mid"),
  ])

  const heroData = heroBanner
    ? {
        headline: heroBanner.headline,
        text: heroBanner.text,
        cta: { text: heroBanner.cta_text, link: heroBanner.cta_link },
        image: { url: heroBanner.image_url, alt: heroBanner.headline },
      }
    : heroBannerConfig

  const midData = midBanner
    ? {
        headline: midBanner.headline,
        text: midBanner.text,
        cta: { text: midBanner.cta_text, link: midBanner.cta_link },
        image: { url: midBanner.image_url, alt: midBanner.headline },
      }
    : midBannerConfig

  const posts = allPosts.slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    author: p.author ?? '',
  }))

  return (
    <>
      <Hero data={heroData} />
      {collections?.length > 0 && <Collections collections={collections} />}
      {products && region && (
        <Suspense fallback={<SkeletonProductsCarousel />}>
          <ProductCarousel
            products={products}
            regionId={region.id}
            title="Our bestsellers"
            viewAll={{ link: '/store', text: 'View all' }}
          />
        </Suspense>
      )}
      <Banner data={midData} />
      {posts.length > 0 && <ExploreBlog posts={posts} />}
    </>
  )
}
