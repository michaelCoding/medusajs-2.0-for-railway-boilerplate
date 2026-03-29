import { Metadata } from 'next'
import BlogListTemplate from '@modules/blog/templates/blog-list'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News and updates from our store.',
}

export default function BlogPage() {
  return <BlogListTemplate />
}
