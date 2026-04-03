import Image from 'next/image'
import { StoreCollection } from '@medusajs/types'
import { Box } from '@modules/common/components/box'
import { Button } from '@modules/common/components/button'
import { Container } from '@modules/common/components/container'
import { Heading } from '@modules/common/components/heading'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { cn } from '@lib/util/cn'

const PLACEHOLDER_IMAGES = [
  'https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png',
  'https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png',
  'https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png',
]

const CollectionTile = ({
  title,
  handle,
  imgSrc,
  id,
}: {
  title: string
  handle: string
  imgSrc: string
  id: number
}) => (
  <Box className={cn('group relative', {
    'small:col-start-2 small:row-start-1 small:row-end-3': id === 1,
  })}>
    <Image
      src={imgSrc}
      alt={`${title} collection`}
      width={600}
      height={300}
      className="h-full w-full object-cover object-center"
    />
    <Box className="absolute left-0 top-0 hidden h-full w-full flex-col p-6 small:flex large:p-10">
      <Button asChild className="w-max self-end opacity-0 transition-all duration-500 group-hover:opacity-100">
        <LocalizedClientLink href={`/collections/${handle}`}>Discover</LocalizedClientLink>
      </Button>
      <Box className="mt-auto text-static">
        <Heading as="h3" className="text-2xl large:text-3xl">{title}</Heading>
      </Box>
    </Box>
    <Box className="absolute left-0 top-0 block h-full w-full p-6 small:hidden">
      <LocalizedClientLink href={`/collections/${handle}`} className="flex h-full w-full flex-col justify-end">
        <Heading as="h3" className="text-2xl text-static">{title}</Heading>
      </LocalizedClientLink>
    </Box>
  </Box>
)

const Collections = ({ collections }: { collections: StoreCollection[] }) => {
  const display = collections.slice(0, 3)
  if (!display.length) return null

  return (
    <Container className="grid max-h-[660px] grid-rows-3 gap-2 small:max-h-[440px] small:grid-cols-2 small:grid-rows-2 large:max-h-[660px]">
      {display.map((collection, id) => (
        <CollectionTile
          key={collection.id}
          title={collection.title}
          handle={collection.handle!}
          imgSrc={PLACEHOLDER_IMAGES[id] ?? PLACEHOLDER_IMAGES[0]}
          id={id}
        />
      ))}
    </Container>
  )
}

export default Collections
