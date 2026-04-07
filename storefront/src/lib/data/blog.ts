// storefront/src/lib/data/blog.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  author: string | null
  cover_image_url: string | null
  published_at: string | null
  date: string  // alias for published_at for backward compat
  content: string
  tags: string[] | null
  featured_product_handle?: string | null
}

export async function getAllPosts(): Promise<Omit<BlogPost, "content">[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/cms/blog-posts`, {
      next: { tags: ["cms-blog"] },
    })
    if (!res.ok) return []
    const { posts } = await res.json()
    return (posts ?? []).map((p: any) => ({ ...p, date: p.published_at ?? "" }))
  } catch {
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/cms/blog-posts/${slug}`, {
      next: { tags: [`cms-blog-${slug}`] },
    })
    if (!res.ok) return null
    const { post } = await res.json()
    return post ? { ...post, date: post.published_at ?? "" } : null
  } catch {
    return null
  }
}
