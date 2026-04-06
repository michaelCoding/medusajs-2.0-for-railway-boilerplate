import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

type ProductStoryProps = {
  product: HttpTypes.StoreProduct
}

export default function ProductStory({ product }: ProductStoryProps) {
  const storyImage = product.images?.[3]?.url || product.images?.[0]?.url || product.thumbnail

  if (!storyImage) return null

  return (
    <section className="mt-32 bg-surface-container-low py-24">
      <div className="max-w-7xl mx-auto px-6 large:px-12">
        <div className="grid grid-cols-1 large:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 w-full h-[600px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={storyImage}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="space-y-12 large:pl-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-headline text-on-surface leading-tight italic">
                "The morning light rests quietly on the table."
              </h2>
              <p className="text-xl font-body text-on-surface-variant leading-relaxed">
                Nothing rushes here. The tea cools slowly, and time feels softer. This is the intention behind every curve of the {product.title}.
              </p>
            </div>
            <div className="p-8 bg-surface-container rounded-xl border-l-4 border-primary">
              <p className="font-headline text-2xl text-primary italic">
                "This piece holds more than its purpose. It holds the quiet of the moment."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
