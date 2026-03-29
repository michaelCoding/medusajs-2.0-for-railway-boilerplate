import LocalizedClientLink from '@modules/common/components/localized-client-link'

export default function Footer() {
  return (
    <footer className="border-t border-basic-primary bg-primary">
      <div className="content-container py-12">
        <div className="grid grid-cols-2 gap-8 medium:grid-cols-4">
          <div>
            <p className="text-md font-semibold text-basic-primary mb-4">Shop</p>
            <ul className="flex flex-col gap-2">
              <li>
                <LocalizedClientLink href="/store" className="text-md text-secondary hover:text-basic-primary transition-colors">
                  All Products
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/categories" className="text-md text-secondary hover:text-basic-primary transition-colors">
                  Categories
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections" className="text-md text-secondary hover:text-basic-primary transition-colors">
                  Collections
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-md font-semibold text-basic-primary mb-4">Account</p>
            <ul className="flex flex-col gap-2">
              <li>
                <LocalizedClientLink href="/account" className="text-md text-secondary hover:text-basic-primary transition-colors">
                  Profile
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/account/orders" className="text-md text-secondary hover:text-basic-primary transition-colors">
                  Orders
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-md font-semibold text-basic-primary mb-4">Company</p>
            <ul className="flex flex-col gap-2">
              <li>
                <LocalizedClientLink href="/about-us" className="text-md text-secondary hover:text-basic-primary transition-colors">
                  About Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/blog" className="text-md text-secondary hover:text-basic-primary transition-colors">
                  Blog
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/faq" className="text-md text-secondary hover:text-basic-primary transition-colors">
                  FAQ
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-md font-semibold text-basic-primary mb-4">Legal</p>
            <ul className="flex flex-col gap-2">
              <li>
                <LocalizedClientLink href="/privacy-policy" className="text-md text-secondary hover:text-basic-primary transition-colors">
                  Privacy Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/terms-and-conditions" className="text-md text-secondary hover:text-basic-primary transition-colors">
                  Terms &amp; Conditions
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-basic-primary">
        <div className="content-container py-4 flex items-center justify-between">
          <p className="text-sm text-secondary">
            © {new Date().getFullYear()} Medusa Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
