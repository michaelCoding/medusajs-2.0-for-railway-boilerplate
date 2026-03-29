import { Metadata } from 'next'
import ContentPageTemplate from '@modules/content/templates/content-page'

export const metadata: Metadata = { title: 'Terms and Conditions' }

export default function TermsPage() {
  return <ContentPageTemplate filename="terms-and-conditions" />
}
