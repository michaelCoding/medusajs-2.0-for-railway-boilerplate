import { Metadata } from 'next'
import ContentPageTemplate from '@modules/content/templates/content-page'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return <ContentPageTemplate slug="privacy-policy" />
}
