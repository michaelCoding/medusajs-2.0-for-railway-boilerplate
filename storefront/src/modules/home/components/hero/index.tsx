import Image from 'next/image'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

type HeroConfig = {
  headline: string
  text: string
  cta: { text: string; link: string }
  image: { url: string; alt: string }
}

const Hero = ({ data }: { data: HeroConfig }) => {
  return (
    <section className="w-full">
      {/* Desktop: two-column */}
      <div className="hidden medium:grid medium:grid-cols-[55fr_45fr] min-h-[600px] large:min-h-[700px]">
        {/* Image column */}
        <div className="relative overflow-hidden">
          <Image
            src={data.image.url}
            alt={data.image.alt}
            fill
            sizes="(max-width: 768px) 0vw, 55vw"
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Text column */}
        <div className="flex flex-col justify-center px-12 large:px-20 py-16 bg-[var(--scandi-bg)]">
          <h1 className="font-lora text-5xl large:text-6xl leading-[1.1] text-[#1C1C1A] mb-8 -tracking-[0.02em]">
            {data.headline}
          </h1>
          <p className="text-base text-[#6B6860] leading-relaxed mb-10 max-w-[340px]">
            {data.text}
          </p>
          <LocalizedClientLink
            href={data.cta.link}
            className="inline-flex w-max border border-[#1C1C1A] px-8 py-3 text-sm uppercase tracking-[0.1em] text-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-[#F7F4EF] transition-colors duration-300"
          >
            {data.cta.text}
          </LocalizedClientLink>
        </div>
      </div>

      {/* Mobile: stacked */}
      <div className="medium:hidden">
        <div className="relative h-[60vh]">
          <Image
            src={data.image.url}
            alt={data.image.alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="px-6 py-10 bg-[var(--scandi-bg)]">
          <h1 className="font-lora text-4xl leading-[1.15] text-[#1C1C1A] mb-5 -tracking-[0.02em]">
            {data.headline}
          </h1>
          <p className="text-base text-[#6B6860] leading-relaxed mb-8">
            {data.text}
          </p>
          <LocalizedClientLink
            href={data.cta.link}
            className="inline-flex w-max border border-[#1C1C1A] px-6 py-3 text-sm uppercase tracking-[0.1em] text-[#1C1C1A] hover:bg-[#1C1C1A] hover:text-[#F7F4EF] transition-colors duration-300"
          >
            {data.cta.text}
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default Hero
