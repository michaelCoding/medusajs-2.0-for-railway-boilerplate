import { Metadata } from 'next'
import ContentPageTemplate from '@modules/content/templates/content-page'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'About Us' }

export default function AboutPage() {
  return <ContentPageTemplate slug="about-us" />
}
