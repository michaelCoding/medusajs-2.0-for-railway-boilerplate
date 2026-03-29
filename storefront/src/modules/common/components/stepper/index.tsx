import React from 'react'
import { cn } from '@lib/util/cn'

export interface StepperProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        return (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium transition-colors',
                  {
                    'bg-fg-primary text-static': isCompleted || isActive,
                    'bg-disabled text-disabled': !isCompleted && !isActive,
                  }
                )}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 3L5 8.5L2 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn('text-md', {
                  'text-action-primary': isActive || isCompleted,
                  'text-disabled': !isCompleted && !isActive,
                })}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn('h-px flex-1 transition-colors', {
                  'bg-fg-primary': isCompleted,
                  'bg-disabled': !isCompleted,
                })}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
