import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label 
            className="block text-sm font-medium"
            style={{ color: 'rgb(240, 236, 230)' }}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400/20',
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-700 focus:border-orange-400',
            className
          )}
          style={{
            backgroundColor: 'rgb(22, 24, 32)',
            color: 'rgb(240, 236, 230)',
          }}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
