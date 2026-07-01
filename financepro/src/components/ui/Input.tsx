import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: ReactNode
  trailing?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, trailing, className, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
      <div className="w-full">
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-text-secondary">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'h-11 w-full rounded-lg border border-border bg-surface-elevated text-sm text-text-primary',
              'placeholder:text-text-muted outline-none transition-colors',
              'focus:border-accent focus:ring-1 focus:ring-accent',
              icon ? 'pl-10' : 'pl-3.5',
              trailing ? 'pr-10' : 'pr-3.5',
              error && 'border-negative focus:border-negative focus:ring-negative',
              className,
            )}
            {...props}
          />
          {trailing && <span className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</span>}
        </div>
        {error && <p className="mt-1.5 text-xs text-negative">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
