import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { BlogPost } from '@lib/data/blog'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

// Detect HTML content vs legacy markdown
function isHtml(content: string) {
  return /^\s*</.test(content)
}

async function renderMarkdown(content: string) {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype)
  const mdast = processor.parse(content)
  const hast = await processor.run(mdast)
  return toJsxRuntime(hast, { Fragment, jsx: jsx as any, jsxs: jsxs as any })
}

const articleCls = [
  "max-w-2xl text-[#6B6860] leading-relaxed",
  "[&_h1]:font-lora [&_h1]:text-[#1C1C1A] [&_h1]:text-3xl [&_h1]:mb-5 [&_h1]:mt-8 [&_h1]:leading-tight",
  "[&_h2]:font-lora [&_h2]:text-[#1C1C1A] [&_h2]:text-2xl [&_h2]:mb-4 [&_h2]:mt-7",
  "[&_h3]:font-lora [&_h3]:text-[#1C1C1A] [&_h3]:text-xl [&_h3]:mb-3 [&_h3]:mt-6",
  "[&_p]:mb-4",
  "[&_a]:text-[#C07B5A] [&_a]:underline",
  "[&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1",
  "[&_ol]:pl-5 [&_ol]:mb-4",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[#C07B5A] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#8B8780] [&_blockquote]:my-6",
  "[&_pre]:bg-[#F0EDE6] [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4",
  "[&_code]:bg-[#F0EDE6] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:text-[#C07B5A]",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
  "[&_img]:rounded-lg [&_img]:my-6 [&_img]:max-w-full",
  "[&_video]:rounded-lg [&_video]:my-6 [&_video]:max-w-full [&_video]:w-full",
  "[&_audio]:w-full [&_audio]:my-4",
  "[&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-6 [&_iframe]:border-0",
  "[&_hr]:border-[#E8E4DC] [&_hr]:my-8",
].join(" ")

export default async function BlogDetailTemplate({ post }: { post: BlogPost }) {
  const html = isHtml(post.content)
  const renderedContent = html ? null : await renderMarkdown(post.content)

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

      {/* Hero image */}
      <div className="content-container mb-12">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full aspect-[16/7] object-cover rounded-lg"
          />
        ) : (
          <div className="bg-[#E8E4DC] aspect-[16/7] w-full rounded-lg" />
        )}
      </div>

      {/* Article body */}
      <div className="content-container pb-24">
        <article className={articleCls}>
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            renderedContent
          )}
        </article>
      </div>
    </div>
  )
}
