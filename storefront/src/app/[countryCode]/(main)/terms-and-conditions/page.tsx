import { Metadata } from 'next'
import ContentPageTemplate from '@modules/content/templates/content-page'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Terms and Conditions' }

export default function TermsPage() {
  return <ContentPageTemplate slug="terms-and-conditions" />
}
