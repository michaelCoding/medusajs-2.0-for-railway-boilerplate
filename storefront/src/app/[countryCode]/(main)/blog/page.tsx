import { Metadata } from 'next'
import BlogListTemplate from '@modules/blog/templates/blog-list'
import { getBanner } from '@lib/data/cms'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Journal | The Woodenly',
  description: 'Stories on craft, material, and the slow life.',
}

export default async function BlogPage() {
  const banner = await getBanner('journal')
  return <BlogListTemplate banner={banner} />
}
