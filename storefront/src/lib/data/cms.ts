// storefront/src/lib/data/cms.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export type BannerData = {
  id: string
  key: string
  headline: string
  text: string
  cta_text: string
  cta_link: string
  image_url: string
}

export type StaticPageData = {
  id: string
  slug: string
  title: string
  content: string
}

export async function getBanner(key: string): Promise<BannerData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/cms/banners/${key}`, {
      next: { tags: [`cms-banner-${key}`] },
    })
    if (!res.ok) return null
    const { banner } = await res.json()
    return banner ?? null
  } catch {
    return null
  }
}

export type VideoData = {
  id: string
  key: string
  url: string
  title: string
  text: string
  tag: string
  duration: string
  poster_url: string
}

export async function getVideos(key: string): Promise<VideoData[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/cms/videos/${key}`, {
      next: { tags: [`cms-video-${key}`] },
    })
    if (!res.ok) return []
    const { videos } = await res.json()
    return videos ?? []
  } catch {
    return []
  }
}

export async function getStaticPage(slug: string): Promise<StaticPageData | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/cms/pages/${slug}`, {
      next: { tags: [`cms-page-${slug}`] },
    })
    if (!res.ok) return null
    const { page } = await res.json()
    return page ?? null
  } catch {
    return null
  }
}
