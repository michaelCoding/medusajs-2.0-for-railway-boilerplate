import Image from 'next/image'
import { StoreCollection } from '@medusajs/types'
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
  isLarge,
}: {
  title: string
  handle: string
  imgSrc: string
  isLarge: boolean
}) => (
  <LocalizedClientLink
    href={`/collections/${handle}`}
    className={cn('group relative overflow-hidden block', {
      'medium:row-span-2': isLarge,
    })}
  >
    <Image
      src={imgSrc}
      alt={`${title} collection`}
      width={800}
      height={isLarge ? 800 : 400}
      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    {/* Title — slides up on hover */}
    <div className="absolute bottom-0 left-0 right-0 p-6 large:p-8">
      <h3 className="font-lora text-2xl large:text-3xl text-white leading-tight translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        {title}
      </h3>
      <p className="text-xs uppercase tracking-[0.1em] text-white/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Discover →
      </p>
    </div>
  </LocalizedClientLink>
)

const Collections = ({ collections }: { collections: StoreCollection[] }) => {
  const display = collections.slice(0, 3)
  if (!display.length) return null

  return (
    <section className="content-container py-20 large:py-28">
      <div className="grid grid-cols-1 medium:grid-cols-2 gap-0 medium:grid-rows-2 medium:h-[600px] large:h-[720px]">
        {display.map((collection, i) => (
          <CollectionTile
            key={collection.id}
            title={collection.title}
            handle={collection.handle!}
            imgSrc={PLACEHOLDER_IMAGES[i] ?? PLACEHOLDER_IMAGES[0]}
            isLarge={i === 0}
          />
        ))}
      </div>
    </section>
  )
}

export default Collections
