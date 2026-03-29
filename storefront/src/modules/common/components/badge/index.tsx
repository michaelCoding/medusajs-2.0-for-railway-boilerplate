import React from 'react'
import { cn } from '@lib/util/cn'
import { cva, VariantProps } from 'cva'

const badgeVariants = cva({
  base: 'inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium',
  variants: {
    variant: {
      default: 'bg-fg-secondary text-action-primary',
      positive: 'bg-green-100 text-positive',
      negative: 'bg-red-100 text-negative',
      warning: 'bg-yellow-100 text-warning',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
)
Badge.displayName = 'Badge'
