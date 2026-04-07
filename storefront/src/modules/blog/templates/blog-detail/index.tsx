import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { BlogPost } from '@lib/data/blog'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { getAllPosts } from '@lib/data/blog'
import { InlineProductCard } from '@modules/blog/components/inline-product-card'

function isHtml(content: string) {
  return /^\s*</.test(content)
}

async function renderMarkdown(content: string) {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype)
  const mdast = processor.parse(content)
  const hast = await processor.run(mdast)
  return toJsxRuntime(hast, { Fragment, jsx: jsx as any, jsxs: jsxs as any })
}

const bodyCls = [
  "font-body text-lg leading-relaxed text-[#51443c]",
  "[&_p]:mb-6",
  "[&_p:first-of-type]:first-letter:text-6xl [&_p:first-of-type]:first-letter:font-lora [&_p:first-of-type]:first-letter:float-left [&_p:first-of-type]:first-letter:mr-3 [&_p:first-of-type]:first-letter:text-[#6f4627] [&_p:first-of-type]:first-letter:leading-none",
  "[&_h2]:font-lora [&_h2]:text-[#1c1c19] [&_h2]:text-2xl [&_h2]:mb-4 [&_h2]:mt-8",
  "[&_h3]:font-lora [&_h3]:text-[#1c1c19] [&_h3]:text-xl [&_h3]:mb-3 [&_h3]:mt-6",
  "[&_a]:text-[#6f4627] [&_a]:underline",
  "[&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[#6f4627]/20 [&_blockquote]:pl-8 [&_blockquote]:italic [&_blockquote]:text-[#51443c] [&_blockquote]:my-6 [&_blockquote]:text-xl [&_blockquote]:font-light",
  "[&_img]:rounded-xl [&_img]:w-full [&_img]:my-10",
  "[&_hr]:border-[#d5c3b8] [&_hr]:my-8",
].join(' ')

export default async function BlogDetailTemplate({ post }: { post: BlogPost }) {
  const allPosts = await getAllPosts()
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  const html = isHtml(post.content)
  const renderedContent = html ? null : await renderMarkdown(post.content)

  return (
    <div className="bg-[#fcf9f4] min-h-screen">

      {/* Hero — store-style banner */}
      <div className="px-8 max-w-screen-2xl mx-auto">
        <header className="mt-8 rounded-xl overflow-hidden relative aspect-[21/9] medium:aspect-[21/7]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: post.cover_image_url
                ? `url('${post.cover_image_url}')`
                : "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80')",
            }}
          />
          {/* Gradient from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c19]/60 to-transparent" />

          {/* Left-aligned content */}
          <div className="absolute inset-0 flex items-center px-8 medium:px-16">
            <div className="max-w-xl space-y-4">
              <p className="text-[#fcf9f4]/70 tracking-[0.15em] uppercase text-xs">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {post.author && ` · ${post.author}`}
              </p>
              <h1 className="font-lora text-3xl medium:text-4xl large:text-5xl text-[#fcf9f4] leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        </header>
      </div>

      {/* Content canvas */}
      <section className="px-8 max-w-screen-2xl mx-auto py-20">

        {/* The Moment: intro quote */}
        {post.excerpt && (
          <div className="grid grid-cols-1 medium:grid-cols-12 gap-12 mb-24">
            <div className="medium:col-span-4 flex flex-col justify-end pb-4">
              <div className="w-12 h-px bg-[#6f4627] mb-6" />
              <span className="text-xs text-[#6f4627] tracking-widest uppercase font-semibold">The Moment</span>
            </div>
            <div className="medium:col-span-8">
              <p className="font-lora text-3xl medium:text-4xl text-[#1c1c19] leading-snug italic">
                &ldquo;{post.excerpt}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="grid grid-cols-1 large:grid-cols-12 gap-16 items-start">

          {/* Sidebar — sticky author card */}
          <aside className="large:col-span-3 space-y-10 large:sticky large:top-28">
            <div className="p-8 bg-[#f6f3ee] rounded-xl">
              <p className="text-xs uppercase tracking-wider text-[#83746b] mb-2">Written by</p>
              <p className="font-lora text-lg text-[#6f4627] mb-6">{post.author ?? 'The Woodenly'}</p>
              <p className="text-xs uppercase tracking-wider text-[#83746b] mb-2">Published</p>
              <p className="font-lora text-lg text-[#6f4627]">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            <LocalizedClientLink
              href="/blog"
              className="text-xs uppercase tracking-[0.1em] text-[#6B6860] hover:text-[#1c1c19] transition-colors inline-flex items-center gap-2"
            >
              ← Back to Journal
            </LocalizedClientLink>
          </aside>

          {/* Article body */}
          <div className="large:col-span-9 space-y-10">
            <div className="columns-1 medium:columns-2 gap-10">
              {html ? (
                <div
                  className={bodyCls}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <div className={bodyCls}>{renderedContent}</div>
              )}
            </div>

            {/* The Object: featured product card */}
            {post.featured_product_handle && (
              <div className="mt-16 pt-16 bg-[#f6f3ee] -mx-6 medium:-mx-12 px-6 medium:px-12 pb-16 rounded-t-[3rem]">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-4 mb-10">
                    <span className="text-xs tracking-widest text-[#6f4627] uppercase font-semibold">The Object</span>
                    <div className="flex-grow h-px bg-[#d5c3b8]/30" />
                  </div>
                  <InlineProductCard handle={post.featured_product_handle} />
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Related Stories */}
      {related.length > 0 && (
        <section className="bg-[#fcf9f4] py-20 px-6 medium:px-12 border-t border-[#d5c3b8]/10">
          <div className="px-8 max-w-screen-2xl mx-auto">
            <h2 className="font-lora text-4xl text-[#1c1c19] mb-16">Related Stories</h2>
            <div className="grid grid-cols-1 medium:grid-cols-3 gap-12">
              {related.map((story) => (
                <LocalizedClientLink
                  key={story.slug}
                  href={`/blog/${story.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-xl mb-6 bg-[#f0ede8]">
                    {story.cover_image_url ? (
                      <img
                        src={story.cover_image_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#e5e2dd]" />
                    )}
                  </div>
                  <p className="text-xs uppercase tracking-widest text-[#83746b] mb-2">
                    {story.author ?? 'The Woodenly'}
                  </p>
                  <h4 className="font-lora text-xl text-[#1c1c19] group-hover:text-[#6f4627] transition-colors">
                    {story.title}
                  </h4>
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
