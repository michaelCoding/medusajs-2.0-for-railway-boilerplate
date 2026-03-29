import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { BlogPost } from '@lib/data/blog'

type BlogCardProps = Pick<BlogPost, 'slug' | 'title' | 'date' | 'excerpt' | 'author'>

export default function BlogCard({ slug, title, date, excerpt, author }: BlogCardProps) {
  return (
    <LocalizedClientLink href={`/blog/${slug}`}>
      <article className="group rounded-xl border border-basic-primary p-6 bg-secondary hover:bg-hover transition-colors cursor-pointer">
        <p className="text-sm text-secondary mb-2">
          {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          {author && ` · ${author}`}
        </p>
        <h2 className="text-xl font-medium text-basic-primary mb-2 group-hover:text-action-primary-hover transition-colors">
          {title}
        </h2>
        <p className="text-md text-secondary line-clamp-3">{excerpt}</p>
      </article>
    </LocalizedClientLink>
  )
}
