'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { cn } from '@lib/util/cn'
import { EyeIcon, EyeOffIcon, SearchIcon } from '@modules/common/icons'

import { Box } from '../box'
import { Label } from '../label'

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string
  error?: string
  /** @deprecated use error instead */
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  topLabel?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, topLabel, touched, errors, required, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useImperativeHandle(ref, () => inputRef.current!)

    const handleClick = () => {
      inputRef.current?.focus()
    }

    useEffect(() => {
      if (type === 'password' && showPassword) {
        setInputType('text')
      }

      if (type === 'password' && !showPassword) {
        setInputType('password')
      }
    }, [type, showPassword])

    return (
      <Box className="flex w-full flex-col gap-2">
        {(topLabel || label) && (
          <Label
            size="sm"
            htmlFor={name}
            className={cn('text-secondary', {
              'text-negative': props.error,
            })}
          >
            {topLabel || label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </Label>
        )}
        <Box
          className={cn(
            'border-primary focus-within:ring-action-primary focus-within:ring-offset-action-primary relative flex h-12 w-full items-center border bg-secondary px-4 py-3.5 outline-none file:border-0 file:bg-transparent file:pt-1 file:text-md file:font-medium focus-within:border focus-within:border-action-primary focus-within:ring-0 focus-within:ring-offset-0',
            {
              'cursor-not-allowed border-transparent bg-disabled text-disabled':
                props.disabled,
            },
            { '!border-negative': props.error },
            props.className
          )}
          onClick={handleClick}
        >
          {type === 'search' && <SearchIcon className="mr-2 h-5 w-5" />}
          <input
            type={inputType}
            name={name}
            id={name}
            ref={inputRef}
            placeholder={props.placeholder ?? ' '}
            className="w-full touch-none !bg-transparent text-lg text-basic-primary outline-none placeholder:text-secondary focus-visible:ring-0 focus-visible:ring-offset-0 medium:text-md"
            {...props}
          />
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-3.5 px-4 text-basic-primary outline-none transition-all duration-150 focus:text-basic-primary focus:outline-none"
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon className="h-5 w-5" />}
            </button>
          )}
        </Box>
        {props.error && (
          <p className="text-sm font-medium text-negative">{props.error}</p>
        )}
      </Box>
    )
  }
)

Input.displayName = 'Input'

export default Input
