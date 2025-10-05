'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Globe, CheckCircle, AlertCircle, Download, ExternalLink, History, X } from 'lucide-react'
import Link from 'next/link'
import { useAuth, useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { LoadingSpinner } from '@/components/ui/LoaderSpinner'
import { validateURL, URLValidation } from '@/lib/urlValidator'
import { useApiService, PageInfo, ScrapeRequest, ScrapeJob } from '@/lib/api'
import { UserProfile } from '@/lib/api'

interface ScrapeStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'active' | 'completed'
}

const siteTypeOptions = [
  { value: 'framer', label: 'Framer' },
  { value: 'webflow', label: 'Webflow' },
  { value: 'wordpress', label: 'WordPress' },
  { value: 'wix', label: 'Wix' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'bolt', label: 'Bolt.new' },
  { value: 'lovable', label: 'Lovable' },
  { value: 'notion', label: 'Notion' },
  { value: 'squarespace', label: 'Squarespace' },
  { value: 'replit', label: 'Replit' },
  { value: 'gumroad', label: 'Gumroad' },
  { value: 'rocket', label: 'Rocket.new' },
  { value: 'general', label: 'Universal Scraper' },
]

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

const getUserFriendlyError = (technicalError: string): string => {
  const errorLower = technicalError.toLowerCase()

  if (errorLower.includes('network') || errorLower.includes('fetch') || errorLower.includes('connection')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.'
  }

  if (errorLower.includes('timeout')) {
    return 'The request took too long to complete. Please try again.'
  }

  if (errorLower.includes('unauthorized') || errorLower.includes('401')) {
    return 'Your session has expired. Please sign in again.'
  }

  if (errorLower.includes('forbidden') || errorLower.includes('403')) {
    return 'You don\'t have permission to perform this action.'
  }

  if (errorLower.includes('not found') || errorLower.includes('404')) {
    return 'The requested resource was not found. Please check the URL and try again.'
  }

  if (errorLower.includes('limit') || errorLower.includes('quota')) {
    return 'You\'ve reached your usage limit. Please upgrade your plan to continue.'
  }

  if (errorLower.includes('invalid url') || errorLower.includes('malformed')) {
    return 'The URL you entered is not valid. Please check and try again.'
  }

  if (errorLower.includes('scrape') || errorLower.includes('extract')) {
    return 'We couldn\'t extract content from this website. It may be protected or temporarily unavailable.'
  }

  if (errorLower.includes('file') || errorLower.includes('download')) {
    return 'There was an issue preparing your download. Please try again.'
  }

  if (errorLower.includes('pages') || errorLower.includes('discover')) {
    return 'We couldn\'t find pages on this website. Please verify the URL is correct.'
  }

  return 'Something went wrong. Please try again or contact support if the problem persists.'
}

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const api = useApiService()

  const [currentStep, setCurrentStep] = useState(0)
  const [url, setUrl] = useState('')
  const [siteType, setSiteType] = useState('framer')
  const [scrapeMode, setScrapeMode] = useState<'single_page' | 'multi_page'>('single_page')
  const [discoveredPages, setDiscoveredPages] = useState<PageInfo[]>([])
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [scrapeResult, setScrapeResult] = useState<any>(null)
  const [userJobs, setUserJobs] = useState<ScrapeJob[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [isNavigating, setIsNavigating] = useState(false)
  const [urlValidation, setUrlValidation] = useState<URLValidation>({ isValid: true })
  const [jobsLoading, setJobsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [jobStatus, setJobStatus] = useState<string>('pending')
  const [jobsFetched, setJobsFetched] = useState(false)

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isPollingRef = useRef(false)

  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    try {
      const isOnline = await api.healthCheck()
      setApiStatus(isOnline ? 'online' : 'offline')
    } catch {
      setApiStatus('offline')
    }
  }

  const fetchUserProfile = async () => {
    try {
      const profile = await api.getUserProfile()
      setUserProfile(profile)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load profile'
      setError(getUserFriendlyError(errorMessage))
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const urlParam = params.get('url')
      const typeParam = params.get('type')
      const modeParam = params.get('mode')

      if (urlParam) {
        const decodedUrl = decodeURIComponent(urlParam)
        setUrl(decodedUrl)
        if (typeParam) {
          const validation = validateURL(decodedUrl, typeParam)
          setUrlValidation(validation)
        }
      }
      if (typeParam) setSiteType(typeParam)
      if (modeParam) setScrapeMode(modeParam as 'single_page' | 'multi_page')
    }
  }, [])

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      fetchUserProfile()
    }
  }, [isSignedIn, isLoaded])

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
    isPollingRef.current = false
  }

  const startPolling = (jobId: string) => {
    if (isPollingRef.current) {
      return
    }

    stopPolling()
    isPollingRef.current = true

    pollIntervalRef.current = setInterval(async () => {
      try {
        const status = await api.getJobStatus(jobId)
        setJobStatus(status.status)

        if (status.status === 'completed') {
          setScrapeResult((prev: typeof scrapeResult) => ({
            ...prev,
            status: 'completed'
          }))
          stopPolling()
          if (showHistory && !jobsLoading) {
            fetchUserJobs()
          }
        } else if (status.status === 'failed') {
          const friendlyError = status.error_message
            ? getUserFriendlyError(status.error_message)
            : 'The export process failed. Please try again.'
          setError(friendlyError)
          setScrapeResult((prev: typeof scrapeResult) => ({
            ...prev,
            status: 'failed'
          }))
          stopPolling()
          if (showHistory && !jobsLoading) {
            fetchUserJobs()
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Status check failed'
        setError(getUserFriendlyError(errorMessage))
      }
    }, 10000)
  }

  useEffect(() => {
    if (scrapeResult?.job_id && jobStatus !== 'completed' && jobStatus !== 'failed') {
      startPolling(scrapeResult.job_id)
    } else {
      stopPolling()
    }

    return () => {
      stopPolling()
    }
  }, [scrapeResult?.job_id, jobStatus])

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopPolling()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const fetchUserJobs = async () => {
    if (jobsLoading) return

    setJobsLoading(true)
    try {
      const jobs = await api.getUserJobs()
      setUserJobs(jobs)
      setJobsFetched(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load jobs'
      setError(getUserFriendlyError(errorMessage))
    } finally {
      setJobsLoading(false)
    }
  }

  const handleShowHistory = () => {
    setShowHistory(true)
    if (!jobsFetched) {
      fetchUserJobs()
    }
  }

  const handleDownload = async (jobId: string) => {
    try {
      setLoading(true)
      const blob = await api.downloadFile(jobId)
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `exported_site_${jobId}.zip`
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Download failed'
      setError(getUserFriendlyError(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  const handleUrlChange = (value: string) => {
    setUrl(value)
    setError('')
    if (value.trim()) {
      const validation = validateURL(value, siteType)
      setUrlValidation(validation)
    } else {
      setUrlValidation({ isValid: true })
    }
  }

  const handleSiteTypeChange = (value: string) => {
    setSiteType(value)
    if (url.trim()) {
      const validation = validateURL(url, value)
      setUrlValidation(validation)
    }
  }

  const steps: ScrapeStep[] = [
    {
      id: 'setup',
      title: 'Setup',
      description: 'Enter website URL and select platform',
      status: currentStep === 0 ? 'active' : currentStep > 0 ? 'completed' : 'pending'
    },
    {
      id: 'pages',
      title: 'Select Pages',
      description: 'Choose which pages to export',
      status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending'
    },
    {
      id: 'scrape',
      title: 'Extract',
      description: 'Download your website files',
      status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : 'pending'
    }
  ]

  const handleDiscoverPages = async () => {
    const validation = validateURL(url, siteType)
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid URL')
      return
    }

    setLoading(true)
    setError('')

    try {
      const pages = await api.discoverPages(url, siteType)
      setDiscoveredPages(pages)

      if (siteType === 'general') {
        setSelectedPages(pages.slice(0, 25).map(p => p.url))
      } else {
        setSelectedPages(pages.map(p => p.url))
      }

      setCurrentStep(1)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to discover pages'
      setError(getUserFriendlyError(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  const handleStartScrape = async () => {
    const validation = validateURL(url, siteType)
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid URL')
      return
    }

    setLoading(true)
    setError('')

    try {
      const request: ScrapeRequest = {
        url,
        site_type: siteType,
        scrape_mode: scrapeMode,
        selected_pages: scrapeMode === 'multi_page' ? selectedPages : undefined
      }

      const result = await api.scrapeSite(request)
      setScrapeResult({
        ...result,
        status: 'pending'
      })
      setJobStatus('pending')
      setCurrentStep(2)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Scraping failed'
      setError(getUserFriendlyError(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  const togglePageSelection = (pageUrl: string) => {
    setSelectedPages(prev => {
      if (prev.includes(pageUrl)) {
        return prev.filter(u => u !== pageUrl)
      } else {
        if (siteType === 'general' && prev.length >= 25) {
          return prev
        }
        return [...prev, pageUrl]
      }
    })
  }

  const resetForm = () => {
    stopPolling()
    setCurrentStep(0)
    setUrl('')
    setDiscoveredPages([])
    setSelectedPages([])
    setScrapeResult(null)
    setJobStatus('pending')
    setError('')
    setUrlValidation({ isValid: true })
  }

  const handleBackToHome = () => {
    setIsNavigating(true)
    router.push('/')
  }

  if (!isLoaded || isNavigating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
        <LoadingSpinner size="lg" text={isNavigating ? 'Navigating...' : 'Loading dashboard...'} />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
        <div className="text-center">
          <h1
            className="text-3xl font-bold mb-4"
            style={{
              color: 'rgb(240, 236, 230)',
              fontFamily: '"Funnel Display", sans-serif'
            }}
          >
            Authentication Required
          </h1>
          <p style={{ color: 'rgb(121, 131, 140)' }} className="mb-8">
            Please sign in to access the dashboard
          </p>
          <Link
            href="/sign-in"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-150"
            style={{
              backgroundColor: 'rgb(252, 138, 125)',
              color: 'rgb(15, 16, 18)',
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
      <header className="border-b" style={{ borderColor: 'rgb(55, 65, 81)', backgroundColor: 'rgba(15, 16, 18, 0.9)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </button>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-green-500' :
                  apiStatus === 'offline' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></div>
              </div>

              <button
                onClick={handleShowHistory}
                className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <History className="w-4 h-4 mr-2" />
                Job History
              </button>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <div className="relative">
        <BackgroundPattern />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {user && userProfile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1
                className="text-3xl font-bold mb-2"
                style={{
                  color: 'rgb(240, 236, 230)',
                  fontFamily: '"Funnel Display", sans-serif'
                }}
              >
                Welcome back, {user.firstName || 'Developer'}!
              </h1>
              <p style={{ color: 'rgb(121, 131, 140)' }} className="mb-4">
                Ready to extract some websites? Lets get started.
              </p>

              <div className="flex justify-center space-x-8 text-sm">
                <div className="text-center">
                  <span style={{ color: 'rgb(240, 236, 230)' }}>
                    {userProfile.usage.single_page_used}/{userProfile.usage.single_page_limit}
                  </span>
                  <p style={{ color: 'rgb(121, 131, 140)' }}>Single Page</p>
                </div>
                <div className="text-center">
                  <span style={{ color: 'rgb(240, 236, 230)' }}>
                    {userProfile.usage.multi_page_used}/{userProfile.usage.multi_page_limit}
                  </span>
                  <p style={{ color: 'rgb(121, 131, 140)' }}>Multi Page</p>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="fixed right-0 top-0 h-full w-96 z-50 border-l"
                style={{
                  backgroundColor: 'rgb(15, 16, 18)',
                  borderColor: 'rgb(55, 65, 81)'
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2
                      className="text-xl font-bold"
                      style={{ color: 'rgb(240, 236, 230)' }}
                    >
                      Your Export History
                    </h2>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                    {jobsLoading ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner size="sm" text="Loading jobs..." />
                      </div>
                    ) : userJobs.length === 0 ? (
                      <p style={{ color: 'rgb(121, 131, 140)' }}>
                        No Export jobs yet. Start by extracting your first website!
                      </p>
                    ) : (
                      userJobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-4 rounded-lg border"
                          style={{
                            backgroundColor: 'rgba(22, 24, 32, 0.5)',
                            borderColor: 'rgb(55, 65, 81)'
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className="text-sm font-medium"
                              style={{ color: 'rgb(240, 236, 230)' }}
                            >
                              {job.site_type.charAt(0).toUpperCase() + job.site_type.slice(1)}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${job.status === 'completed'
                                ? 'bg-green-900/20 text-green-400'
                                : job.status === 'failed'
                                  ? 'bg-red-900/20 text-red-400'
                                  : 'bg-yellow-900/20 text-yellow-400'
                                }`}
                            >
                              {job.status}
                            </span>
                          </div>
                          <p
                            className="text-xs mb-3 truncate"
                            style={{ color: 'rgb(121, 131, 140)' }}
                          >
                            {job.url}
                          </p>
                          <div className="flex items-center justify-between">
                            <span
                              className="text-xs"
                              style={{ color: 'rgb(121, 131, 140)' }}
                            >
                              {new Date(job.created_at).toLocaleDateString()}
                            </span>
                            {job.status === 'completed' && (
                              <button
                                onClick={() => handleDownload(job.job_id)}
                                className="text-xs text-blue-400 hover:text-blue-300"
                              >
                                Download
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between max-w-4xl mx-auto gap-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center w-full">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0
                      ${step.status === 'completed' ? 'bg-emerald-500 border-emerald-500' :
                        step.status === 'active' ? 'bg-blue-500 border-blue-500' :
                          'bg-gray-800 border-gray-700'}
                    `}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-white font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className={`font-medium ${step.status === 'active' ? 'text-white' : 'text-gray-400'}`}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      hidden lg:block w-24 h-0.5 mx-8 transition-colors duration-200
                      ${step.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-700'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center"
              >
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <p className="text-red-300">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <div
                  className="rounded-xl p-8"
                  style={{
                    backgroundColor: 'rgba(22, 24, 32, 0.5)',
                    border: '1px solid rgb(55, 65, 81)'
                  }}
                >
                  <div className="flex items-center mb-6">
                    <Globe className="w-6 h-6 text-blue-400 mr-3" />
                    <h2
                      className="text-xl font-bold"
                      style={{ color: 'rgb(240, 236, 230)' }}
                    >
                      Website Setup
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Input
                        label="Website URL"
                        placeholder="https://example.framer.website/"
                        value={url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                      />
                      {urlValidation.error && (
                        <p className="text-red-400 text-sm">{urlValidation.error}</p>
                      )}
                      {urlValidation.warning && !urlValidation.error && (
                        <p className="text-yellow-400 text-sm">{urlValidation.warning}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Select
                        label="Platform Type"
                        options={siteTypeOptions}
                        value={siteType}
                        onChange={(e) => handleSiteTypeChange(e.target.value)}
                      />
                      {urlValidation.warning && !urlValidation.error && (
                        <p className="text-yellow-400 text-sm">{urlValidation.warning}</p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-3"
                        style={{ color: 'rgb(240, 236, 230)' }}
                      >
                        Export Mode
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={() => setScrapeMode('single_page')}
                          className={`p-4 rounded-lg border transition-all duration-200 ${scrapeMode === 'single_page'
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                            : 'border-gray-700 hover:border-gray-600 text-gray-400'
                            }`}
                        >
                          <h3 className="font-medium mb-1">Single Page</h3>
                          <p className="text-sm opacity-80">Extract only the main page</p>
                        </button>
                        <button
                          onClick={() => setScrapeMode('multi_page')}
                          className={`p-4 rounded-lg border transition-all duration-200 ${scrapeMode === 'multi_page'
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                            : 'border-gray-700 hover:border-gray-600 text-gray-400'
                            }`}
                        >
                          <h3 className="font-medium mb-1">Multi Page</h3>
                          <p className="text-sm opacity-80">Extract multiple pages</p>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      {scrapeMode === 'single_page' ? (
                        <Button
                          onClick={handleStartScrape}
                          loading={loading}
                          size="lg"
                          disabled={!url || !urlValidation.isValid}
                        >
                          Start Exporting
                        </Button>
                      ) : (
                        <Button
                          onClick={handleDiscoverPages}
                          loading={loading}
                          size="lg"
                          disabled={!url || !urlValidation.isValid}
                        >
                          Discover Pages
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div
                  className="rounded-xl p-8"
                  style={{
                    backgroundColor: 'rgba(22, 24, 32, 0.5)',
                    border: '1px solid rgb(55, 65, 81)'
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-emerald-400 mr-3" />
                      <h2
                        className="text-xl font-bold"
                        style={{ color: 'rgb(240, 236, 230)' }}
                      >
                        Select Pages to Export
                      </h2>
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: 'rgb(121, 131, 140)' }}
                    >
                      {selectedPages.length} of {discoveredPages.length} selected
                      {siteType === 'general' && (
                        <span className="text-yellow-400 ml-2">(Max 25)</span>
                      )}
                    </span>
                  </div>

                  {siteType === 'general' && selectedPages.length > 25 && (
                    <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                      <p className="text-yellow-400 text-sm">
                        You can select maximum 25 pages for universal exporting. Please deselect {selectedPages.length - 25} pages.
                      </p>
                    </div>
                  )}

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {discoveredPages.map((page) => (
                      <div
                        key={page.url}
                        className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${selectedPages.includes(page.url)
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                          }`}
                        onClick={() => {
                          if (siteType === 'general' && !selectedPages.includes(page.url) && selectedPages.length >= 25) {
                            return
                          }
                          togglePageSelection(page.url)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3
                              className="font-medium"
                              style={{ color: 'rgb(240, 236, 230)' }}
                            >
                              {page.title}
                            </h3>
                            <p
                              className="text-sm"
                              style={{ color: 'rgb(121, 131, 140)' }}
                            >
                              {page.path}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                            <input
                              type="checkbox"
                              checked={selectedPages.includes(page.url)}
                              readOnly
                              className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500"
                              disabled={siteType === 'general' && !selectedPages.includes(page.url) && selectedPages.length >= 25}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      variant="secondary"
                      onClick={() => setCurrentStep(0)}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleStartScrape}
                      loading={loading}
                      disabled={selectedPages.length === 0 || (siteType === 'general' && selectedPages.length > 25)}
                      size="lg"
                    >
                      Export Selected Pages ({selectedPages.length})
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && scrapeResult && (
                <div
                  className="rounded-xl p-8 text-center"
                  style={{
                    backgroundColor: 'rgba(22, 24, 32, 0.5)',
                    border: '1px solid rgb(55, 65, 81)'
                  }}
                >
                  {jobStatus === 'completed' && scrapeResult.status === 'completed' ? (
                    <>
                      <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>

                      <h2
                        className="text-2xl font-bold mb-4"
                        style={{ color: 'rgb(240, 236, 230)' }}
                      >
                        Exporting Complete!
                      </h2>
                      <p
                        className="mb-8"
                        style={{ color: 'rgb(121, 131, 140)' }}
                      >
                        Your website has been successfully extracted and is ready for download.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          onClick={() => handleDownload(scrapeResult.job_id)}
                          size="lg"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download Files
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={resetForm}
                          size="lg"
                        >
                          Export Another Site
                        </Button>
                      </div>
                    </>
                  ) : jobStatus === 'failed' || scrapeResult.status === 'failed' ? (
                    <>
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>

                      <h2
                        className="text-2xl font-bold mb-4"
                        style={{ color: 'rgb(240, 236, 230)' }}
                      >
                        Exporting Failed
                      </h2>
                      <p
                        className="mb-8"
                        style={{ color: 'rgb(121, 131, 140)' }}
                      >
                        There was an error processing your request. Please try again.
                      </p>

                      <Button
                        variant="secondary"
                        onClick={resetForm}
                        size="lg"
                      >
                        Try Again
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>

                      <h2
                        className="text-2xl font-bold mb-4"
                        style={{ color: 'rgb(240, 236, 230)' }}
                      >
                        Processing Your Request
                      </h2>
                      <p
                        className="mb-8"
                        style={{ color: 'rgb(121, 131, 140)' }}
                      >
                        We are extracting your website files. This may take a few moments...
                      </p>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}