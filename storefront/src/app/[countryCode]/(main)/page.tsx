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
            viewAll={{ link: '/store', text: 'View all' }}
          />
        </Suspense>
      )}
      <Banner data={midBannerConfig} />
      {posts.length > 0 && <ExploreBlog posts={posts} />}
    </>
  )
}
