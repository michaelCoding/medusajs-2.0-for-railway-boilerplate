import React from 'react'
import { cn } from '@lib/util/cn'
import LocalizedClientLink from '@modules/common/components/localized-client-link'

export interface NavigationItemProps {
  href: string
  children: React.ReactNode
  className?: string
  'data-testid'?: string
}

export const NavigationItem = React.forwardRef<HTMLAnchorElement, NavigationItemProps>(
  ({ href, children, className, ...props }, ref) => (
    <LocalizedClientLink
      href={href}
      className={cn(
        'flex items-center py-3 text-md text-action-primary hover:text-action-primary-hover transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </LocalizedClientLink>
  )
)
NavigationItem.displayName = 'NavigationItem'
