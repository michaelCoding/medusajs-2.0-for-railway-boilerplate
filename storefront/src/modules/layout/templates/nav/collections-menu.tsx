import { StoreCollection } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default function CollectionsMenu({ collections }: { collections: StoreCollection[] }) {
  if (!collections?.length) return null

  return (
    <Container className="flex flex-col gap-4 !px-14 !pb-8 !pt-5">
      <Button variant="tonal" className="w-max !px-3 !py-2" asChild>
        <LocalizedClientLink href="/store">Shop all collections</LocalizedClientLink>
      </Button>
      <div className="grid grid-cols-4 gap-4">
        {collections.map((collection) => (
          <Box key={collection.id}>
            <LocalizedClientLink
              href={`/collections/${collection.handle}`}
              className="py-2 text-lg text-basic-primary hover:border-b hover:border-action-primary"
            >
              {collection.title}
            </LocalizedClientLink>
          </Box>
        ))}
      </div>
    </Container>
  )
}
