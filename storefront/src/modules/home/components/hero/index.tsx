import Image from 'next/image'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

type HeroConfig = {
  headline: string
  text: string
  cta: { text: string; link: string }
  image: { url: string; alt: string }
}

const Hero = ({ data }: { data: HeroConfig }) => {
  const dotIdx = data.headline.indexOf('. ')
  const line1 = dotIdx !== -1 ? data.headline.slice(0, dotIdx + 1) : data.headline
  const line2 = dotIdx !== -1 ? data.headline.slice(dotIdx + 2) : null

  return (
    <div className="px-8 max-w-screen-2xl mx-auto">
      <section className="mt-8 rounded-xl overflow-hidden relative aspect-[21/9] medium:aspect-[21/7]">
        {/* Background image */}
        <Image
          src={data.image.url}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c19]/55 to-transparent" />

        {/* Left-aligned content */}
        <div className="absolute inset-0 flex items-center px-8 medium:px-16">
          <div className="max-w-lg space-y-6">
            <h1 className="font-lora text-4xl medium:text-5xl large:text-6xl text-[#fcf9f4] leading-tight -tracking-[0.02em]">
              {line1}
              {line2 && (
                <>
                  <br />
                  {line2}
                </>
              )}
            </h1>
            {data.text && (
              <p className="text-[#fcf9f4]/85 font-medium text-base medium:text-lg leading-relaxed">
                {data.text}
              </p>
            )}
            <LocalizedClientLink
              href={data.cta.link}
              className="inline-flex items-center gap-3 bg-[#6f4627] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-[#8b5e3c] transition-all active:scale-95"
            >
              {data.cta.text}
            </LocalizedClientLink>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
