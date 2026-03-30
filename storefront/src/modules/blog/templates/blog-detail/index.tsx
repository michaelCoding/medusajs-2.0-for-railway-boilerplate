import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { BlogPost } from '@lib/data/blog'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

async function renderMarkdown(content: string) {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype)
  const mdast = processor.parse(content)
  const hast = await processor.run(mdast)
  return toJsxRuntime(hast, { Fragment, jsx: jsx as any, jsxs: jsxs as any })
}

export default async function BlogDetailTemplate({ post }: { post: BlogPost }) {
  const content = await renderMarkdown(post.content)
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
        {content}
      </article>
    </div>
  )
}
