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
          <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-3">The Journal</p>
          <h2 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] -tracking-[0.02em]">
            Stories from the Grain
          </h2>
        </div>
        <LocalizedClientLink
          href="/blog"
          className="hidden medium:inline-flex text-xs uppercase tracking-[0.1em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors border-b border-[#6B6860] pb-px"
        >
          Explore the Archive →
        </LocalizedClientLink>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 medium:grid-cols-3 gap-8 large:gap-12">
        {posts.map((post, i) => (
          <ScrollReveal key={post.slug} delay={i * 100} className={i === 1 ? 'medium:mt-24' : ''}>
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
          Explore the Archive →
        </LocalizedClientLink>
      </div>
    </section>
  )
}
