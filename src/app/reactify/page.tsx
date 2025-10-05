// 'use client'

// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { ArrowLeft, Zap, Globe, Code, Download, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
// import Link from 'next/link'
// import { useAuth, useUser, UserButton } from '@clerk/nextjs'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import { LoadingSpinner } from '@/components/ui/LoaderSpinner'
// import { validateURL, URLValidation } from '@/lib/urlValidator'
// import { useApiService, PageInfo } from '@/lib/api'

// interface ConversionOptions {
//     framework: string
//     styling: string
//     typescript: boolean
//     optimization_level: string
//     include_tests: boolean
// }

// interface ReactifyJob {
//     id: string
//     job_id: string
//     page_url: string
//     status: string
//     file_size_mb?: number
//     components_generated?: number
//     created_at: string
//     error_message?: string
// }

// const BackgroundPattern = () => (
//     <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute inset-0" style={{
//             backgroundImage: `
//         linear-gradient(90deg, rgba(45, 50, 56, 0.3) 1px, transparent 1px),
//         linear-gradient(rgba(45, 50, 56, 0.3) 1px, transparent 1px)
//       `,
//             backgroundSize: '80px 80px',
//         }}>
//             <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg transform rotate-12"></div>
//             <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl transform -rotate-6"></div>
//             <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg transform rotate-45"></div>
//             <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg transform -rotate-12"></div>
//         </div>
//     </div>
// )

// export default function ReactifyPage() {
//     const { isSignedIn, isLoaded } = useAuth()
//     const { user } = useUser()
//     const router = useRouter()
//     const api = useApiService()

//     const [currentStep, setCurrentStep] = useState(0)
//     const [url, setUrl] = useState('')
//     const [discoveredPages, setDiscoveredPages] = useState<PageInfo[]>([])
//     const [selectedPage, setSelectedPage] = useState<PageInfo | null>(null)
//     const [conversionOptions, setConversionOptions] = useState<ConversionOptions>({
//         framework: 'nextjs',
//         styling: 'css_modules',
//         typescript: true,
//         optimization_level: 'standard',
//         include_tests: true
//     })
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState('')
//     const [urlValidation, setUrlValidation] = useState<URLValidation>({ isValid: true })
//     const [conversionJob, setConversionJob] = useState<ReactifyJob | null>(null)
//     const [jobStatus, setJobStatus] = useState<string>('pending')

//     const steps = [
//         { id: 'discover', title: 'Discover Pages', description: 'Find pages to convert' },
//         { id: 'select', title: 'Select Page', description: 'Choose your target page' },
//         { id: 'options', title: 'Conversion Options', description: 'Configure your React app' },
//         { id: 'convert', title: 'Generate React', description: 'AI-powered conversion' }
//     ]
//     useEffect(() => {
//         let pollInterval: NodeJS.Timeout | null = null

//         if (conversionJob && jobStatus !== 'completed' && jobStatus !== 'failed') {
//             pollInterval = setInterval(async () => {
//                 try {
//                     const status = await api.getReactifyStatus(conversionJob.job_id)
//                     setJobStatus(status.status)

//                     if (status.status === 'completed' || status.status === 'failed') {
//                         setConversionJob(status)
//                         if (pollInterval) {
//                             clearInterval(pollInterval)
//                         }
//                     }
//                 } catch (error) {
//                     console.error('Failed to poll conversion status:', error)
//                 }
//             }, 15000)
//         }

//         return () => {
//             if (pollInterval) {
//                 clearInterval(pollInterval)
//             }
//         }
//     }, [conversionJob?.job_id, jobStatus, api])


//     const handleDiscoverPages = async () => {
//         const validation = validateURL(url, 'general')
//         if (!validation.isValid) {
//             setError(validation.error || 'Please enter a valid URL')
//             return
//         }

//         setLoading(true)
//         setError('')

//         try {
//             const pages = await api.discoverPagesForReactify(url)
//             setDiscoveredPages(pages)
//             setCurrentStep(1)
//         } catch (err) {
//             const errorMessage = err instanceof Error ? err.message : 'Failed to discover pages'
//             setError(errorMessage)
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handlePageSelect = (page: PageInfo) => {
//         setSelectedPage(page)
//         setCurrentStep(2)
//     }

//     const handleStartConversion = async () => {
//         if (!selectedPage) return

//         setLoading(true)
//         setError('')

//         try {
//             const result = await api.convertPageToReact(selectedPage.url, conversionOptions)

//             if (result.success) {
//                 setConversionJob({
//                     id: result.job_id || '',
//                     job_id: result.job_id || '',
//                     page_url: selectedPage.url,
//                     status: 'pending',
//                     created_at: new Date().toISOString()
//                 } as ReactifyJob)
//                 setJobStatus('pending')
//                 setCurrentStep(3)
//             } else {
//                 setError(result.message || 'Conversion failed')
//             }
//         } catch (err) {
//             const errorMessage = err instanceof Error ? err.message : 'Conversion failed'
//             setError(errorMessage)
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleDownloadReactProject = async () => {
//         if (!conversionJob) return

//         try {
//             const blob = await api.downloadReactProject(conversionJob.job_id)
//             const downloadUrl = window.URL.createObjectURL(blob)
//             const link = document.createElement('a')
//             link.href = downloadUrl
//             link.download = `react-project-${conversionJob.job_id}.zip`
//             document.body.appendChild(link)
//             link.click()
//             document.body.removeChild(link)
//             window.URL.revokeObjectURL(downloadUrl)
//         } catch (error) {
//             console.error('Download failed:', error)
//             setError('Failed to download React project')
//         }
//     }

//     const resetFlow = () => {
//         setCurrentStep(0)
//         setUrl('')
//         setDiscoveredPages([])
//         setSelectedPage(null)
//         setConversionJob(null)
//         setJobStatus('pending')
//         setError('')
//         setUrlValidation({ isValid: true })
//     }

//     if (!isLoaded) {
//         return (
//             <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
//                 <LoadingSpinner size="lg" text="Loading React-ify..." />
//             </div>
//         )
//     }

//     if (!isSignedIn) {
//         return (
//             <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
//                 <div className="text-center">
//                     <Zap className="w-16 h-16 mx-auto mb-6 text-blue-400" />
//                     <h1 className="text-3xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
//                         React-ify Authentication Required
//                     </h1>
//                     <p style={{ color: 'rgb(121, 131, 140)' }} className="mb-8">
//                         Please sign in to convert websites to React components
//                     </p>
//                     <Link
//                         href="/sign-in"
//                         className="px-6 py-3 rounded-lg font-medium transition-all duration-150"
//                         style={{ backgroundColor: 'rgb(59, 130, 246)', color: 'white' }}
//                     >
//                         Sign In to Continue
//                     </Link>
//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
//             <header className="border-b" style={{ borderColor: 'rgb(55, 65, 81)' }}>
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex items-center justify-between h-16">
//                         <Link
//                             href="/"
//                             className="inline-flex items-center text-blue-400 hover:text-blue-300"
//                         >
//                             <ArrowLeft className="w-4 h-4 mr-2" />
//                             Back to Home
//                         </Link>

//                         <div className="flex items-center space-x-4">
//                             <div className="flex items-center space-x-2">
//                                 <Zap className="w-5 h-5 text-blue-400" />
//                                 <span className="font-semibold text-white">React-ify</span>
//                             </div>
//                             <UserButton />
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <div className="relative">
//                 <BackgroundPattern />

//                 <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="text-center mb-12"
//                     >
//                         <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
//                             <Code className="w-8 h-8 text-white" />
//                         </div>

//                         <h1 className="text-4xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
//                             Convert Websites to React
//                         </h1>
//                         <p style={{ color: 'rgb(121, 131, 140)' }} className="text-lg max-w-2xl mx-auto">
//                             Transform any website into clean, modern React components using AI.
//                             Get production-ready code with TypeScript, tests, and best practices.
//                         </p>
//                     </motion.div>

//                     <div className="mb-12">
//                         <div className="flex justify-between items-center max-w-3xl mx-auto">
//                             {steps.map((step, index) => (
//                                 <div key={step.id} className="flex items-center">
//                                     <div className={`
//                     w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200
//                     ${currentStep >= index ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}
//                   `}>
//                                         {currentStep > index ? (
//                                             <CheckCircle className="w-5 h-5" />
//                                         ) : (
//                                             <span className="font-medium">{index + 1}</span>
//                                         )}
//                                     </div>
//                                     <div className="ml-3 hidden sm:block">
//                                         <p className={`font-medium ${currentStep >= index ? 'text-white' : 'text-gray-400'}`}>
//                                             {step.title}
//                                         </p>
//                                         <p className="text-sm text-gray-500">{step.description}</p>
//                                     </div>
//                                     {index < steps.length - 1 && (
//                                         <div className={`
//                       w-16 h-0.5 mx-4 transition-colors duration-200
//                       ${currentStep > index ? 'bg-blue-500' : 'bg-gray-700'}
//                     `} />
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <AnimatePresence>
//                         {error && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -10 }}
//                                 className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center"
//                             >
//                                 <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
//                                 <p className="text-red-300">{error}</p>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>

//                     <AnimatePresence mode="wait">
//                         <motion.div
//                             key={currentStep}
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: -20 }}
//                             transition={{ duration: 0.3 }}
//                         >
//                             {currentStep === 0 && (
//                                 <div className="rounded-xl p-8" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
//                                     <div className="flex items-center mb-6">
//                                         <Globe className="w-6 h-6 text-blue-400 mr-3" />
//                                         <h2 className="text-xl font-bold" style={{ color: 'rgb(240, 236, 230)' }}>
//                                             Enter Website URL
//                                         </h2>
//                                     </div>

//                                     <div className="space-y-6">
//                                         <div className="space-y-2">
//                                             <Input
//                                                 label="Website URL"
//                                                 placeholder="https://example.com"
//                                                 value={url}
//                                                 onChange={(e) => {
//                                                     setUrl(e.target.value)
//                                                     setError('')
//                                                     if (e.target.value.trim()) {
//                                                         const validation = validateURL(e.target.value, 'general')
//                                                         setUrlValidation(validation)
//                                                     } else {
//                                                         setUrlValidation({ isValid: true })
//                                                     }
//                                                 }}
//                                             />
//                                             {urlValidation.error && (
//                                                 <p className="text-red-400 text-sm">{urlValidation.error}</p>
//                                             )}
//                                             {urlValidation.warning && !urlValidation.error && (
//                                                 <p className="text-yellow-400 text-sm">⚠️ {urlValidation.warning}</p>
//                                             )}
//                                         </div>

//                                         <div className="flex justify-end">
//                                             <Button
//                                                 onClick={handleDiscoverPages}
//                                                 loading={loading}
//                                                 size="lg"
//                                                 disabled={!url || !urlValidation.isValid}
//                                             >
//                                                 Discover Pages
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {currentStep === 1 && (
//                                 <div className="rounded-xl p-8" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
//                                     <div className="flex items-center justify-between mb-6">
//                                         <h2 className="text-xl font-bold" style={{ color: 'rgb(240, 236, 230)' }}>
//                                             Select Page to Convert
//                                         </h2>
//                                         <span className="text-sm" style={{ color: 'rgb(121, 131, 140)' }}>
//                                             {discoveredPages.length} pages found
//                                         </span>
//                                     </div>

//                                     <div className="grid gap-4 max-h-96 overflow-y-auto">
//                                         {discoveredPages.map((page, index) => (
//                                             <div
//                                                 key={index}
//                                                 onClick={() => handlePageSelect(page)}
//                                                 className="p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:border-blue-500 hover:bg-blue-500/5"
//                                                 style={{ borderColor: 'rgb(55, 65, 81)' }}
//                                             >
//                                                 <div className="flex items-center justify-between">
//                                                     <div className="flex-1">
//                                                         <h3 className="font-medium mb-1" style={{ color: 'rgb(240, 236, 230)' }}>
//                                                             {page.title}
//                                                         </h3>
//                                                         <p className="text-sm mb-2" style={{ color: 'rgb(121, 131, 140)' }}>
//                                                             {page.path}
//                                                         </p>
//                                                         <div className="flex items-center space-x-4 text-xs">
//                                                             <span style={{ color: 'rgb(121, 131, 140)' }}>
//                                                                 Complexity: {(page as any).complexity_score}/10
//                                                             </span>
//                                                             <span style={{ color: 'rgb(121, 131, 140)' }}>
//                                                                 Est. Time: {(page as any).conversion_time_estimate}
//                                                             </span>
//                                                         </div>
//                                                     </div>
//                                                     <ExternalLink className="w-4 h-4 text-gray-500 ml-4" />
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     <div className="flex justify-between mt-6">
//                                         <Button variant="secondary" onClick={() => setCurrentStep(0)}>
//                                             Back
//                                         </Button>
//                                     </div>
//                                 </div>
//                             )}

//                             {currentStep === 2 && selectedPage && (
//                                 <div className="rounded-xl p-8" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
//                                     <h2 className="text-xl font-bold mb-6" style={{ color: 'rgb(240, 236, 230)' }}>
//                                         Conversion Options
//                                     </h2>

//                                     <div className="space-y-6">
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                             <div>
//                                                 <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(240, 236, 230)' }}>
//                                                     Framework
//                                                 </label>
//                                                 <select
//                                                     value={conversionOptions.framework}
//                                                     onChange={(e) => setConversionOptions(prev => ({ ...prev, framework: e.target.value }))}
//                                                     className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
//                                                 >
//                                                     <option value="nextjs">Next.js</option>
//                                                     <option value="react">React</option>
//                                                 </select>
//                                             </div>

//                                             <div>
//                                                 <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(240, 236, 230)' }}>
//                                                     Styling
//                                                 </label>
//                                                 <select
//                                                     value={conversionOptions.styling}
//                                                     onChange={(e) => setConversionOptions(prev => ({ ...prev, styling: e.target.value }))}
//                                                     className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600"
//                                                 >
//                                                     <option value="css_modules">CSS Modules</option>
//                                                     <option value="tailwind">Tailwind CSS</option>
//                                                     <option value="styled_components">Styled Components</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                             <label className="flex items-center space-x-3">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={conversionOptions.typescript}
//                                                     onChange={(e) => setConversionOptions(prev => ({ ...prev, typescript: e.target.checked }))}
//                                                     className="w-4 h-4"
//                                                 />
//                                                 <span style={{ color: 'rgb(240, 236, 230)' }}>TypeScript</span>
//                                             </label>

//                                             <label className="flex items-center space-x-3">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={conversionOptions.include_tests}
//                                                     onChange={(e) => setConversionOptions(prev => ({ ...prev, include_tests: e.target.checked }))}
//                                                     className="w-4 h-4"
//                                                 />
//                                                 <span style={{ color: 'rgb(240, 236, 230)' }}>Include Tests</span>
//                                             </label>
//                                         </div>

//                                         <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
//                                             <h3 className="font-medium mb-2" style={{ color: 'rgb(240, 236, 230)' }}>
//                                                 Selected Page: {selectedPage.title}
//                                             </h3>
//                                             <p className="text-sm" style={{ color: 'rgb(121, 131, 140)' }}>
//                                                 {selectedPage.url}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <div className="flex justify-between mt-6">
//                                         <Button variant="secondary" onClick={() => setCurrentStep(1)}>
//                                             Back
//                                         </Button>
//                                         <Button onClick={handleStartConversion} loading={loading} size="lg">
//                                             Start Conversion
//                                         </Button>
//                                     </div>
//                                 </div>
//                             )}

//                             {currentStep === 3 && (
//                                 <div className="rounded-xl p-8 text-center" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
//                                     {jobStatus === 'completed' ? (
//                                         <>
//                                             <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
//                                                 <CheckCircle className="w-8 h-8 text-white" />
//                                             </div>

//                                             <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
//                                                 React Project Ready!
//                                             </h2>
//                                             <p className="mb-8" style={{ color: 'rgb(121, 131, 140)' }}>
//                                                 Your website has been successfully converted to a React application.
//                                             </p>

//                                             {conversionJob && (
//                                                 <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
//                                                     <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
//                                                         <div className="text-lg font-semibold text-blue-400">
//                                                             {conversionJob.components_generated || 'Multiple'}
//                                                         </div>
//                                                         <div className="text-sm" style={{ color: 'rgb(121, 131, 140)' }}>
//                                                             Components
//                                                         </div>
//                                                     </div>
//                                                     <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
//                                                         <div className="text-lg font-semibold text-blue-400">
//                                                             {conversionJob.file_size_mb?.toFixed(1) || '1.2'}MB
//                                                         </div>
//                                                         <div className="text-sm" style={{ color: 'rgb(121, 131, 140)' }}>
//                                                             Project Size
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}

//                                             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                                                 <Button onClick={handleDownloadReactProject} size="lg">
//                                                     <Download className="w-5 h-5 mr-2" />
//                                                     Download React Project
//                                                 </Button>
//                                                 <Button variant="secondary" onClick={resetFlow} size="lg">
//                                                     Convert Another Page
//                                                 </Button>
//                                             </div>
//                                         </>
//                                     ) : jobStatus === 'failed' ? (
//                                         <>
//                                             <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
//                                                 <AlertCircle className="w-8 h-8 text-white" />
//                                             </div>

//                                             <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
//                                                 Conversion Failed
//                                             </h2>
//                                             <p className="mb-8" style={{ color: 'rgb(121, 131, 140)' }}>
//                                                 {conversionJob?.error_message || 'There was an error converting your page. Please try again.'}
//                                             </p>

//                                             <Button variant="secondary" onClick={resetFlow} size="lg">
//                                                 Try Again
//                                             </Button>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
//                                                 <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                             </div>

//                                             <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
//                                                 Converting to React
//                                             </h2>
//                                             <p className="mb-8" style={{ color: 'rgb(121, 131, 140)' }}>
//                                                 Our AI is analyzing your page and generating clean React components. This usually takes 2-4 minutes.
//                                             </p>

//                                             <div className="max-w-md mx-auto">
//                                                 <div className="w-full bg-gray-700 rounded-full h-2">
//                                                     <div
//                                                         className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//                                                         style={{ width: jobStatus === 'processing' ? '60%' : '30%' }}
//                                                     ></div>
//                                                 </div>
//                                                 <p className="text-sm mt-2" style={{ color: 'rgb(121, 131, 140)' }}>
//                                                     {jobStatus === 'processing' ? 'Generating React components...' : 'Starting conversion...'}
//                                                 </p>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>
//                             )}
//                         </motion.div>
//                     </AnimatePresence>
//                 </div>
//             </div>
//         </div>
//     )
// }
