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
    <div className="bg-[var(--scandi-bg)] min-h-screen">
      {/* Header */}
      <div className="content-container pt-12 pb-0">
        <LocalizedClientLink
          href="/blog"
          className="text-xs uppercase tracking-[0.1em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors inline-flex items-center gap-2 mb-10"
        >
          ← Back to Journal
        </LocalizedClientLink>

        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.1em] text-[#7A9E7E] mb-4">
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            {post.author && ` · ${post.author}`}
          </p>
          <h1 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] leading-[1.1] -tracking-[0.02em] mb-12">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Hero image placeholder */}
      <div className="content-container mb-12">
        <div className="bg-[#E8E4DC] aspect-[16/7] w-full" />
      </div>

      {/* Article body */}
      <div className="content-container pb-24">
        <article className="max-w-2xl text-[#6B6860] leading-relaxed [&_h2]:font-lora [&_h2]:text-[#1C1C1A] [&_h2]:text-2xl [&_h2]:mb-4 [&_p]:mb-4 [&_a]:text-[#C07B5A]">
          {content}
        </article>
      </div>
    </div>
  )
}
