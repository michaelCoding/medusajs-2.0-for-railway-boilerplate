import CartButton from '@modules/layout/components/cart-button'
import ProfileButton from '@modules/layout/components/profile-button'

export default function NavActions() {
  return (
    <div className="flex items-center gap-1">
      <ProfileButton />
      <CartButton />
    </div>
  )
}
