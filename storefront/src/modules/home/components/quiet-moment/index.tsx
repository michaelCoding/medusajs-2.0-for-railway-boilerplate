import Image from 'next/image'
import { StoreProduct } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

interface QuietMomentProps {
  products: StoreProduct[]
}

export function QuietMoment({ products }: QuietMomentProps) {
  const display = products.slice(0, 3)
  if (!display.length) return null

  return (
    <section className="py-20 large:py-28 bg-[var(--scandi-bg)]">
      {/* Scene image */}
      <div className="relative h-[55vh] w-full overflow-hidden mb-16">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Narrative text */}
      <div className="content-container text-center mb-16">
        <p className="font-lora italic text-2xl large:text-3xl text-[#1C1C1A] mb-5 max-w-lg mx-auto leading-relaxed">
          The morning light rests quietly on the table.
        </p>
        <p className="text-sm text-[#6B6860] leading-loose max-w-sm mx-auto">
          Nothing rushes here.<br />
          The tea cools slowly, and time feels softer.
        </p>
      </div>

      {/* Embedded products */}
      <div className="content-container">
        <div className="grid grid-cols-1 small:grid-cols-3 gap-8 large:gap-12 mb-12">
          {display.map((product) => (
            <LocalizedClientLink
              key={product.id}
              href={`/products/${product.handle}`}
              className="group text-center"
            >
              {/* Thumbnail */}
              <div className="relative aspect-square w-full overflow-hidden bg-[#F0EDE6] mb-5">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#E8E4DC]" />
                )}
              </div>
              {/* Title */}
              <p className="font-lora text-lg text-[#1C1C1A] mb-2 leading-snug">
                {product.title}
              </p>
              {/* Soft CTA */}
              <span className="text-xs uppercase tracking-[0.1em] text-[#6B6860] group-hover:text-[#1C1C1A] transition-colors border-b border-[#6B6860]/40 pb-px">
                See details <span aria-hidden="true">→</span>
              </span>
            </LocalizedClientLink>
          ))}
        </div>

        {/* Section soft link */}
        <div className="text-center">
          <LocalizedClientLink
            href="/store"
            className="text-xs uppercase tracking-[0.12em] text-[#6B6860] hover:text-[#1C1C1A] transition-colors"
          >
            View the moment <span aria-hidden="true">→</span>
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
