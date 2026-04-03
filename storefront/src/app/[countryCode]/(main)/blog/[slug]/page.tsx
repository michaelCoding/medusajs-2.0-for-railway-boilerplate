import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@lib/data/blog'
import BlogDetailTemplate from '@modules/blog/templates/blog-detail'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string; countryCode: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return <BlogDetailTemplate post={post} />
}
