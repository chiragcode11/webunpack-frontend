'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoaderSpinner'
import { useApiService } from '@/lib/api'

const BackgroundPattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(90deg, rgba(45, 50, 56, 0.3) 1px, transparent 1px),
        linear-gradient(rgba(45, 50, 56, 0.3) 1px, transparent 1px)
      `,
      backgroundSize: '80px 80px',
    }}>
      <div className="absolute top-20 left-10 w-20 h-20 bg-gray-800/40 rounded-lg transform rotate-12"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gray-700/20 rounded-xl transform -rotate-6"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-gray-800/30 rounded-lg transform rotate-45"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-gray-700/40 rounded-lg transform -rotate-12"></div>
    </div>
  </div>
)

const TechIcon = () => (
  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
    <Zap className="w-5 h-5 text-white" />
  </div>
)

export default function WaitlistPage() {
  const api = useApiService()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await api.joinWaitlist(email)
      if (response.success) {
        setIsSubmitted(true)
      } else {
        setError(response.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join waitlist. Please try again.'
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full px-4 h-20" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <Link
            href="/"
            className="flex items-center space-x-3 text-green-200 hover:text-green-100 transition-colors duration-150"
          >
            <TechIcon />
            <span
              className="text-xl font-bold"
              style={{
                fontFamily: '"Funnel Display", sans-serif',
                color: 'rgb(240, 236, 230)'
              }}
            >
              WebUnpack
            </span>
          </Link>

          <Link 
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="relative pt-32 pb-20 overflow-hidden">
        <BackgroundPattern />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {!isSubmitted ? (
              <>
                <h1
                  className="text-4xl lg:text-6xl font-normal leading-tight mb-8"
                  style={{
                    color: 'rgb(240, 236, 230)',
                    fontFamily: '"Funnel Display", sans-serif',
                    letterSpacing: '-0.85px',
                  }}
                >
                  React-ify Your Site
                  <br />
                  <span style={{ color: 'rgb(252, 138, 125)' }}>Coming Soon</span>
                </h1>

                <p
                  className="text-xl leading-relaxed mb-12 max-w-2xl mx-auto"
                  style={{
                    color: 'rgb(121, 131, 140)',
                    fontFamily: '"DM Sans", sans-serif'
                  }}
                >
                  Transform any website into clean, modern React components. 
                  Be the first to know when we launch this revolutionary feature.
                </p>

                <div className="max-w-md mx-auto">
                  {isSubmitting ? (
                    <div className="py-12">
                      <LoadingSpinner size="lg" text="Joining waitlist..." />
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={error}
                      />
                      
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={!email}
                      >
                        Join Waitlist
                      </Button>
                    </form>
                  )}

                  <p className="mt-4 text-sm" style={{ color: 'rgb(121, 131, 140)' }}>
                    No spam, just updates on React-ify launch
                  </p>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                
                <h1
                  className="text-3xl lg:text-4xl font-normal leading-tight mb-6"
                  style={{
                    color: 'rgb(240, 236, 230)',
                    fontFamily: '"Funnel Display", sans-serif',
                  }}
                >
                  You are on the list!
                </h1>
                
                <p
                  className="text-lg leading-relaxed mb-8"
                  style={{ color: 'rgb(121, 131, 140)' }}
                >
                  We will notify you as soon as React-ify is ready to transform your websites into beautiful React components.
                </p>
                
                <Link
                  href="/"
                  className="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-150"
                  style={{
                    backgroundColor: 'rgb(252, 138, 125)',
                    color: 'rgb(15, 16, 18)',
                  }}
                >
                  Back to WebUnpack
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
