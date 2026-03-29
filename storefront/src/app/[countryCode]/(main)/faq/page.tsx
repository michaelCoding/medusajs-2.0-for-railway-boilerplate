import { Metadata } from 'next'
import ContentPageTemplate from '@modules/content/templates/content-page'

export const metadata: Metadata = { title: 'FAQ' }

export default function FaqPage() {
  return <ContentPageTemplate filename="faq" />
}
