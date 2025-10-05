import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400/20 hover:scale-105 active:scale-95'
    
    const variants = {
      primary: 'text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700',
      outline: 'border border-gray-700 hover:bg-gray-800 text-white',
      ghost: 'hover:bg-gray-800 text-gray-300 hover:text-white'
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    }

    const primaryStyle = variant === 'primary' ? {
      backgroundColor: 'rgb(252, 138, 125)',
      color: 'rgb(15, 16, 18)'
    } : {}

    return (
      <button
        ref={ref}
        style={primaryStyle}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          (disabled || loading) && 'opacity-50 cursor-not-allowed hover:scale-100',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
