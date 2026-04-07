import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-4 py-8 small:py-0">
      <div className="bg-[#faf7f3] rounded-2xl border border-[#e8e4dc] p-6 flex flex-col gap-5">
        <h2 className="font-lora text-[20px] text-[#1c1c1a]">Your Selection</h2>

        {/* Items preview */}
        <div>
          <ItemsPreviewTemplate items={cart?.items} />
        </div>

        {/* Totals */}
        <div className="border-t border-[#e8e4dc] pt-4">
          <CartTotals totals={cart} />
        </div>

        {/* Discount code */}
        <DiscountCode cart={cart} />
      </div>
    </div>
  )
}

export default CheckoutSummary
