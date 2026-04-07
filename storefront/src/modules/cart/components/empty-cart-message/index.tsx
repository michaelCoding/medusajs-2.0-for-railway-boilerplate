import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="flex flex-col items-center py-24 px-8 text-center"
      data-testid="empty-cart-message"
    >
      {/* Decorative icon */}
      <div className="w-16 h-16 rounded-full bg-[#f0ede8] flex items-center justify-center mb-6">
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          <path
            d="M5 7h3l2 12h12l2-8H9"
            stroke="#9b9590"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13" cy="23" r="1.2" fill="#9b9590"/>
          <circle cx="20" cy="23" r="1.2" fill="#9b9590"/>
        </svg>
      </div>

      <h1 className="font-lora text-[28px] text-[#1c1c1a] mb-3">Your Cart</h1>
      <p className="text-sm text-[#9b9590] max-w-sm leading-relaxed mb-8">
        Your collection is empty. Discover handcrafted wooden pieces made to bring warmth and intention to your home.
      </p>

      <LocalizedClientLink
        href="/store"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1c1c1a] text-white text-sm rounded-xl hover:bg-[#2d2d2a] transition-all duration-200"
      >
        Explore the Store
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
