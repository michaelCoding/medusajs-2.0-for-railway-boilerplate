import React from 'react'
import { cn } from '@lib/util/cn'

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel
  children: React.ReactNode
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = 'h2', className, children, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn('text-basic-primary', className)}
      {...props}
    >
      {children}
    </Tag>
  )
)
Heading.displayName = 'Heading'
