import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'

type ContentPageProps = { filename: string }

export default function ContentPageTemplate({ filename }: ContentPageProps) {
  const filepath = path.join(process.cwd(), 'content', `${filename}.mdx`)
  const source = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(source)

  return (
    <div className="content-container py-12 max-w-3xl">
      <h1 className="mb-8 text-basic-primary">{data.title}</h1>
      <article className="prose prose-neutral dark:prose-invert max-w-none text-basic-primary">
        <MDXRemote source={content} />
      </article>
    </div>
  )
}
