import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
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
        <div className="relative">
          <select
            className={cn(
              'flex h-12 w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400/20 appearance-none cursor-pointer',
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
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
export { Select }
