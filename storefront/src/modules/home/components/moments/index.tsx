import Image from 'next/image'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

const scenes = [
  {
    title: 'A Quiet Morning',
    line: 'A slow start, with light and wood.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    link: '/store',
  },
  {
    title: 'Slow Evenings',
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
    title: 'With Your Companion',
    line: 'A shared quiet life.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    link: '/store',
  },
]

export default function Moments() {
  return (
    <section className="content-container py-20 large:py-28">
      <div className="grid grid-cols-1 medium:grid-cols-2 gap-0.5">
        {scenes.map((scene) => (
          <LocalizedClientLink
            key={scene.title}
            href={scene.link}
            className="group relative overflow-hidden block h-[340px] medium:h-[400px]"
          >
            <Image
              src={scene.image}
              alt={scene.title}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {/* text */}
            <div className="absolute bottom-0 left-0 right-0 p-7 large:p-9">
              <h3 className="font-lora text-2xl large:text-3xl text-white leading-snug mb-1.5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                {scene.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {scene.line}
              </p>
              <span className="text-xs uppercase tracking-[0.12em] text-white/60 group-hover:text-white/90 transition-colors duration-300">
                Enter →
              </span>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}
