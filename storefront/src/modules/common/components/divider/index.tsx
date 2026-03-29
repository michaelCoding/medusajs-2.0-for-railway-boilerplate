import React from 'react'
import { cn } from '@lib/util/cn'

export const Divider = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn('border-t border-basic-primary', className)}
    {...props}
  />
))
Divider.displayName = 'Divider'

export default Divider
