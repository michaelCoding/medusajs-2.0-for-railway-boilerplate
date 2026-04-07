import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ScrollReveal } from '@modules/common/components/scroll-reveal'

const stats = [
  { value: '100%', label: 'Traceable Timber' },
  { value: 'Hand', label: 'Turned & Finished' },
  { value: '20+', label: 'Year Guarantee' },
]

// Simple park/tree icon (Material Symbols "park" shape)
function ParkIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="text-[#6f4627]"
    >
      <path
        d="M24 6L10 26h9v12h10V26h9L24 6z"
        fill="currentColor"
        fillOpacity="0.85"
      />
      <rect x="21" y="36" width="6" height="6" rx="1" fill="currentColor" fillOpacity="0.5" />
    </svg>
  )
}

export function HowWeLive() {
  return (
    <section className="bg-white py-20 large:py-36 border-t border-[#d5c3b8]/10">
      <div className="content-container">

        {/* Manifesto */}
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto mb-0">
            <div className="flex justify-center mb-10">
              <ParkIcon />
            </div>
            <h2 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] leading-tight -tracking-[0.01em]">
              We believe in objects that breathe with you. Not just tools, but companions that carry the history of the earth and the touch of the artisan.
            </h2>
            <div className="mt-8">
              <LocalizedClientLink
                href="/about-us"
                className="text-xs uppercase tracking-[0.12em] text-[#1C1C1A] border-b border-[#1C1C1A] pb-px hover:text-[#6f4627] hover:border-[#6f4627] transition-colors"
              >
                About us <span aria-hidden="true">→</span>
              </LocalizedClientLink>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={120}>
          <div className="border-t border-[#d5c3b8]/20 mt-20 pt-16 flex flex-col small:flex-row justify-center gap-16 large:gap-24">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-lora text-4xl text-[#6f4627] italic mb-3">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.28em] font-bold text-[#6B6860]">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  )
}
