import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Help = () => {
  return (
    <div className="font-body">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--scandi-fg-muted,#6B6860)] mb-3">
        Need help from our studio?
      </p>
      <div className="flex gap-6 text-sm">
        <LocalizedClientLink
          href="/contact"
          className="text-[var(--scandi-fg,#1C1C1A)] underline underline-offset-4 decoration-[var(--scandi-border)] hover:decoration-[var(--scandi-fg)] transition-colors"
        >
          Contact us
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/shipping-returns"
          className="text-[var(--scandi-fg,#1C1C1A)] underline underline-offset-4 decoration-[var(--scandi-border)] hover:decoration-[var(--scandi-fg)] transition-colors"
        >
          Shipping &amp; Returns
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Help
