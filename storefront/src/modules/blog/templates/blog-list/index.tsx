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
    <div className="bg-[var(--scandi-bg)] min-h-screen">
      {/* Page header */}
      <div className="content-container pt-16 pb-12">
        <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-3">Journal</p>
        <h1 className="font-lora text-5xl large:text-6xl text-[#1C1C1A] -tracking-[0.02em]">
          Stories &amp; ideas
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

      {/* Remaining posts — grid */}
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
