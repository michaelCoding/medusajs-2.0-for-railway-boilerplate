import { ScrollReveal } from '@modules/common/components/scroll-reveal'

const steps = [
  {
    number: '01',
    title: 'Choose with intention',
    body: 'Every piece in our home should earn its place — chosen for function, beauty, and longevity, not impulse.',
  },
  {
    number: '02',
    title: 'Live with less',
    body: 'A curated space breathes. We believe in quality over quantity, and in the calm that simplicity brings.',
  },
  {
    number: '03',
    title: 'Care for what you own',
    body: 'Objects last longer when tended to. Our guides help you maintain and love the things you bring home.',
  },
]

export function HowWeLive() {
  return (
    <section className="bg-[#F0EDE6] py-20 large:py-32">
      <div className="content-container">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.14em] text-[#6B6860] mb-4">Our philosophy</p>
          <h2 className="font-lora text-4xl large:text-5xl text-[#1C1C1A] -tracking-[0.02em] mb-16 max-w-md">
            How we live
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 medium:grid-cols-3 gap-12 large:gap-16">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 120}>
              <p className="font-lora text-5xl text-[#1C1C1A]/10 mb-4">{step.number}</p>
              <h3 className="font-lora text-xl text-[#1C1C1A] mb-3 leading-snug">{step.title}</h3>
              <p className="text-sm text-[#6B6860] leading-relaxed">{step.body}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
