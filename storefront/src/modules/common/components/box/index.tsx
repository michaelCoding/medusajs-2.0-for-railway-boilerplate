import React from 'react'
import { cn } from '@lib/util/cn'

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  )
)
Box.displayName = 'Box'
