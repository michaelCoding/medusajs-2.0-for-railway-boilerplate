import { listCategories } from '@lib/data/categories'
import { getCollectionsList } from '@lib/data/collections'
import { Container } from '@modules/common/components/container'
import NavActions from './nav-actions'
import NavContent from './nav-content'

export default async function NavWrapper({ countryCode }: { countryCode: string }) {
  const [productCategories, { collections }] = await Promise.all([
    listCategories(),
    getCollectionsList(),
  ])

  return (
    <nav className="duration-400 sticky top-0 z-50 mx-0 max-w-full border-b border-basic-primary bg-primary transition-all ease-in-out">
      <Container className="flex items-center justify-between !p-0 medium:!px-14">
        <NavContent
          productCategories={productCategories ?? []}
          collections={collections ?? []}
          countryCode={countryCode}
        />
        <NavActions />
      </Container>
    </nav>
  )
}
