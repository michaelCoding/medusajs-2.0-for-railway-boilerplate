import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { BlogPost } from '@lib/data/blog'

type BlogCardProps = Pick<BlogPost, 'slug' | 'title' | 'date' | 'excerpt' | 'author'> & {
  featuredProduct?: { handle: string; title: string; thumbnail?: string } | null
  category?: string
}

export default function BlogCard({ slug, title, date, excerpt, author, featuredProduct, category }: BlogCardProps) {
  return (
    <article className="group flex flex-col">
      {/* Placeholder image area */}
      <div className="relative overflow-hidden bg-[#E8E4DC] aspect-[4/3] mb-5">
        <div className="absolute inset-0 bg-[#C07B5A]/10 group-hover:bg-[#C07B5A]/5 transition-colors duration-500" />
      </div>

      {/* Category pill */}
      {category && (
        <span className="inline-block mb-3 text-xs uppercase tracking-[0.1em] text-[#7A9E7E] border border-[#7A9E7E] px-2 py-0.5 w-max">
          {category}
        </span>
      )}

      {/* Title */}
      <LocalizedClientLink href={`/blog/${slug}`}>
        <h3 className="font-lora text-xl text-[#1C1C1A] leading-snug mb-2 group-hover:text-[#C07B5A] transition-colors duration-200">
          {title}
        </h3>
      </LocalizedClientLink>

      {/* Date */}
      <p className="text-xs text-[#6B6860] mb-3">
        {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        {author && ` · ${author}`}
      </p>

      {/* Excerpt */}
      <p className="text-sm text-[#6B6860] leading-relaxed line-clamp-3 mb-4">{excerpt}</p>

      {/* Read link */}
      <LocalizedClientLink
        href={`/blog/${slug}`}
        className="text-xs uppercase tracking-[0.1em] text-[#1C1C1A] border-b border-[#1C1C1A] pb-px w-max hover:text-[#C07B5A] hover:border-[#C07B5A] transition-colors duration-200 mt-auto"
      >
        Read article →
      </LocalizedClientLink>

      {/* Featured product link */}
      {featuredProduct && (
        <div className="mt-4 pt-4 border-t border-[#E8E4DC]">
          <p className="text-xs text-[#6B6860] mb-1">Featured in this article</p>
          <LocalizedClientLink
            href={`/products/${featuredProduct.handle}`}
            className="text-sm text-[#1C1C1A] hover:text-[#C07B5A] transition-colors"
          >
            {featuredProduct.title} →
          </LocalizedClientLink>
        </div>
      )}
    </article>
  )
}
