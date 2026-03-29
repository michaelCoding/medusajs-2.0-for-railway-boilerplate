import { MDXRemote } from 'next-mdx-remote/rsc'
import { BlogPost } from '@lib/data/blog'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default function BlogDetailTemplate({ post }: { post: BlogPost }) {
  return (
    <div className="content-container py-12 max-w-3xl">
      <LocalizedClientLink
        href="/blog"
        className="text-sm text-secondary hover:text-basic-primary transition-colors mb-6 inline-block"
      >
        ← Back to Blog
      </LocalizedClientLink>
      <p className="text-sm text-secondary mb-2">
        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        {post.author && ` · ${post.author}`}
      </p>
      <h1 className="mb-8 text-basic-primary">{post.title}</h1>
      <article className="prose prose-neutral dark:prose-invert max-w-none text-basic-primary">
        <MDXRemote source={post.content} />
      </article>
    </div>
  )
}
