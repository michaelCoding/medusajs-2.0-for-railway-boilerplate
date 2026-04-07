import Image from 'next/image'
import { StoreProduct } from '@medusajs/types'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

interface QuietMomentProps {
  products: StoreProduct[]
}

export function QuietMoment({ products }: QuietMomentProps) {
  const featured = products[0]
  if (!featured) return null

  return (
    <section className="py-20 large:py-28 px-8 bg-[#f0ede8] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 medium:grid-cols-2 items-center gap-16 large:gap-24">

          {/* Left: atmospheric image + floating product card */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl aspect-[4/5]">
              {featured.thumbnail ? (
                <Image
                  src={featured.thumbnail}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 bg-[#E8E4DC]" />
              )}
            </div>

            {/* Floating product embed card */}
            <div className="mt-6 medium:mt-0 medium:absolute medium:-bottom-10 medium:-right-10 bg-[#fcf9f4] p-7 rounded-3xl shadow-xl max-w-[280px] border border-[#d5c3b8]/30">
              <div className="flex gap-5 items-center">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-[#f0ede8]">
                  {featured.thumbnail && (
                    <Image
                      src={featured.thumbnail}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="space-y-1 min-w-0">
                  <h5 className="font-lora text-lg text-[#1C1C1A] leading-snug">{featured.title}</h5>
                  <p className="text-sm text-[#6B6860] font-light">Hand-turned. Naturally finished.</p>
                  <LocalizedClientLink
                    href={`/products/${featured.handle}`}
                    className="text-[#6f4627] font-bold text-sm flex items-center gap-1 group pt-1"
                  >
                    See details{' '}
                    <span aria-hidden="true" className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </div>

          {/* Right: narrative text */}
          <div className="space-y-10">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.28em] text-[#6f4627]/60 font-semibold">
                A Quieter Way to Live
              </p>
              <h2 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] leading-[1.1] -tracking-[0.01em]">
                The morning light rests quietly on the table...
              </h2>
            </div>

            <blockquote className="text-xl text-[#6B6860] font-light italic leading-relaxed relative pl-8 border-l-2 border-[#6f4627]/20">
              &ldquo;There is a particular kind of silence that only wood understands. It doesn&apos;t reflect noise; it absorbs it. It waits for the light to find its grain, and in that moment, the room feels settled.&rdquo;
            </blockquote>

            <div>
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center bg-[#6f4627] text-white px-10 py-4 rounded-full hover:bg-[#8b5e3c] transition-all active:scale-95 text-lg font-medium"
              >
                Discover the Collection
              </LocalizedClientLink>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
