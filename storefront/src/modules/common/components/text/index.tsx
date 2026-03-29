import React from 'react'
import { cn } from '@lib/util/cn'
import { cva, VariantProps } from 'cva'

const textVariants = cva({
  base: 'text-basic-primary',
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    tone: {
      primary: 'text-basic-primary',
      secondary: 'text-secondary',
      disabled: 'text-disabled',
      negative: 'text-negative',
      positive: 'text-positive',
    },
  },
  defaultVariants: { size: 'md', weight: 'normal', tone: 'primary' },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label'
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ as: Tag = 'p', className, size, weight, tone, ...props }, ref) => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref as any}
      className={cn(textVariants({ size, weight, tone }), className)}
      {...props}
    />
  )
)
Text.displayName = 'Text'
