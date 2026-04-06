import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { ScrollReveal } from '@modules/common/components/scroll-reveal'

export function HowWeLive() {
  return (
    <section className="bg-[#F0EDE6] py-20 large:py-32">
      <div className="content-container">
        <div className="grid grid-cols-1 medium:grid-cols-[2fr_1fr] gap-12 large:gap-20 items-center">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-4">About</p>
            <h2 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] -tracking-[0.02em] mb-6 leading-[1.1]">
              A quieter way to live.
            </h2>
            <p className="text-base text-[#6B6860] leading-relaxed max-w-lg">
              Woodenly is a quiet space where wood, time, and life meet.
              Every object is chosen for its presence — to slow the room,
              and those inside it.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="flex medium:justify-end">
              <LocalizedClientLink
                href="/about-us"
                className="text-xs uppercase tracking-[0.12em] text-[#1C1C1A] border-b border-[#1C1C1A] pb-px hover:text-[#6B6860] hover:border-[#6B6860] transition-colors"
              >
                About us <span aria-hidden="true">→</span>
              </LocalizedClientLink>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
