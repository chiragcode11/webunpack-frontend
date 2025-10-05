'use client'

import { SignIn, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/ui/LoaderSpinner'

export default function SignInPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setIsRedirecting(true)
      router.push('/dashboard')
    }
  }, [isSignedIn, isLoaded, router])

  if (!isLoaded || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
        <LoadingSpinner size="lg" text={isRedirecting ? 'Redirecting to dashboard...' : 'Loading authentication...'} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ 
              color: 'rgb(240, 236, 230)',
              fontFamily: '"Funnel Display", sans-serif'
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: 'rgb(121, 131, 140)' }}>
            Sign in to continue scraping websites
          </p>
        </div>
        
        <div className="flex justify-center">
          <SignIn 
            routing="path"
            path="/sign-in"
            redirectUrl="/dashboard"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'w-full max-w-md mx-auto',
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
