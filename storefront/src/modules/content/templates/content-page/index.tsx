import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { getStaticPage } from '@lib/data/cms'
import { notFound } from 'next/navigation'

async function renderMarkdown(content: string) {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype)
  const mdast = processor.parse(content)
  const hast = await processor.run(mdast)
  return toJsxRuntime(hast, { Fragment, jsx: jsx as any, jsxs: jsxs as any })
}

export default async function ContentPageTemplate({ slug }: { slug: string }) {
  const page = await getStaticPage(slug)
  if (!page) return notFound()

  const content = await renderMarkdown(page.content)

  return (
    <div className="content-container py-12 max-w-3xl">
      <h1 className="mb-8 text-basic-primary">{page.title}</h1>
      <article className="prose prose-neutral dark:prose-invert max-w-none text-basic-primary">
        {content}
      </article>
    </div>
  )
}
