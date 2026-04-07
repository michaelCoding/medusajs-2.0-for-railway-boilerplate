import Image from 'next/image'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

const scenes = [
  {
    title: 'Quiet Morning',
    line: 'A slow start, with light and wood.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    link: '/store',
  },
  {
    title: 'Slow Evening',
    line: 'Where time softens.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    link: '/store',
  },
  {
    title: 'A Gift That Stays',
    line: 'Not just a gift, but a memory.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
    link: '/store',
  },
  {
    title: 'With Companions',
    line: 'A shared quiet life.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    link: '/store',
  },
]

export default function Moments() {
  return (
    <section className="py-20 large:py-28 px-8 bg-[#fcf9f4]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.28em] text-[#6f4627]/60 font-semibold mb-4">Discovery</p>
          <h2 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] -tracking-[0.02em]">
            Curated Moments
          </h2>
        </div>

        <div className="grid grid-cols-2 medium:grid-cols-4 gap-6 large:gap-8">
          {scenes.map((scene, i) => (
            <LocalizedClientLink
              key={scene.title}
              href={scene.link}
              className={`group cursor-pointer${i % 2 === 1 ? ' medium:mt-16' : ''}`}
            >
              {/* Portrait card image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-[#f6f3ee]">
                <Image
                  src={scene.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <h3 className="font-lora text-2xl text-[#1C1C1A] mb-2">{scene.title}</h3>
              <p className="text-sm text-[#6B6860] flex items-center gap-2 group-hover:text-[#6f4627] transition-colors">
                Enter scene <span aria-hidden="true">→</span>
              </p>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
