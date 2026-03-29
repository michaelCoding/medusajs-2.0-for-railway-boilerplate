import { Metadata } from 'next'
import ContentPageTemplate from '@modules/content/templates/content-page'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return <ContentPageTemplate filename="privacy-policy" />
}
