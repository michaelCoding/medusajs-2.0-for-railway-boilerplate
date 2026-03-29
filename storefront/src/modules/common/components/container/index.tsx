import React from 'react'
import { cn } from '@lib/util/cn'
import { cva, VariantProps } from 'cva'

const containerVariants = cva({
  base: 'mx-auto w-full px-4 medium:px-6',
  variants: {
    size: {
      sm: 'max-w-2xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      full: 'max-w-none',
    },
  },
  defaultVariants: { size: 'lg' },
})

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  )
)
Container.displayName = 'Container'
