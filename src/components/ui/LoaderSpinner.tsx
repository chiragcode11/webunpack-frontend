import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`${sizeClasses[size]} border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-4`}
      />
      <p style={{ color: 'rgb(121, 131, 140)' }} className="text-sm">
        {text}
      </p>
    </div>
  )
}
