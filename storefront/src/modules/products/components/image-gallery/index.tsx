import Image from 'next/image'
import { HttpTypes } from '@medusajs/types'

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (!images?.length) return null

  const [main, second, third, ...rest] = images

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Main large image */}
      <div className="col-span-12">
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-sm">
          <Image
            src={main.url}
            alt="Product image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 55vw"
            priority
          />
        </div>
      </div>

      {/* Second image */}
      {second && (
        <div className="col-span-6">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image
              src={second.url}
              alt="Product image 2"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 28vw"
            />
          </div>
        </div>
      )}

      {/* Third image */}
      {third && (
        <div className="col-span-6">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image
              src={third.url}
              alt="Product image 3"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 28vw"
            />
          </div>
        </div>
      )}

      {/* Remaining images as smaller thumbnails if any */}
      {rest.map((img, i) => (
        <div key={img.id} className="col-span-6">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <Image
              src={img.url}
              alt={`Product image ${i + 4}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 28vw"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
