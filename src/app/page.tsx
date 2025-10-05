'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Search, ChevronDown, Zap, Menu, X, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { useAuth, useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/LoaderSpinner'
import { validateURL, URLValidation } from '@/lib/urlValidator'
import logo from '@/app/assets/wnp1.png'
import webflowLogo from '@/app/assets/w.png'
import framerLogo from '@/app/assets/fr.png'
import wordpressLogo from '@/app/assets/wp.png'
import shopifyLogo from '@/app/assets/sh.png'
import squarespaceLog from '@/app/assets/ss.png'
import replitLogo from '@/app/assets/r.png'
import { Marquee } from "@/components/ui/marquee"

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
  { value: 'general', label: 'General' },
]

const scrapeOptions = [
  { value: 'single_page', label: 'Single Page' },
  { value: 'multi_page', label: 'Multi Page' },
]

const featuredSites = [
  {
    name: 'FramerApp',
    description: 'UI layout rebuilt in code"',
    domain: 'website.framerapp.app',
    category: 'design',
  },
  {
    name: 'WebflowSite',
    description: 'Dynamic template rebuilt in React',
    domain: 'website.webflowsite.io',
    category: 'ecommerce',
  },
  {
    name: 'NotionPage',
    description: 'Knowledge base exported to static site',
    domain: 'notionpage.docs',
    category: 'docs',
  },
  {
    name: 'WordPressBlog',
    description: 'Content management extracted',
    domain: 'website.wordpress.blog',
    category: 'blog',
  },
  {
    name: 'ShopifyStore',
    description: 'Online store template exported',
    domain: 'website.shopify.store',
    category: 'ecommerce',
  },
  {
    name: 'WixPortfolio',
    description: 'Creative portfolio rebuild',
    domain: 'wixportfolio.io',
    category: 'portfolio',
  },
]

const categories = [
  'Design',
  'E-commerce',
  'Documentation',
  'Portfolio',
  'Blog',
  'Landing Page',
  'Dashboard',
  'Business',
]

const platformLogos = [
  { name: 'Webflow', logo: webflowLogo },
  { name: 'Framer', logo: framerLogo },
  { name: 'WordPress', logo: wordpressLogo },
  { name: 'Shopify', logo: shopifyLogo },
  { name: 'SquareSpace', logo: squarespaceLog },
  { name: 'Replit', logo: replitLogo },
]

const testimonials = [
  {
    quote: "Simply paste your no-code website link and let us handle the rest. No technical knowledge required—just your URL and you are ready to unlock full control of your website.",
    name: 'Step 1:',
    title: 'Enter your website URL',
    website: 'webunpack',
    domain: 'com'
  },
  {
    quote: "Our AI-powered engine analyzes your site, optimizes performance, and applies best practices automatically. Sit back while we transform your website in seconds.",
    name: 'Step 2:',
    title: 'sit back and relax',
    website: 'webunpack',
    domain: 'com'
  },
  {
    quote: "Download your fully optimized website package. Enjoy clean structured data, benefits of self-hosting, and a seamless experience across all devices. just within seconds",
    name: 'Step 3:',
    title: 'Your Website is ready',
    website: 'webunpack',
    domain: 'com'
  }
]

const faqs = [
  {
    id: '1',
    question: 'What is WebUnpack, and who can use it?',
    answer: 'WebUnpack is a professional website export and conversion tool built for developers, designers, and agencies. It lets you export websites from platforms like Webflow, Framer, Wix, WordPress, Notion, and more into clean static HTML or React code ready for deployment.'
  },
  {
    id: '2',
    question: 'How do I export a website using WebUnpack?',
    answer: 'Simply enter the website URL, select its platform (for example, Webflow, Framer, Wix, or Shopify), and click "Export." WebUnpack will generate a downloadable ZIP with HTML, CSS, JS, and assets — or React components if you choose React mode.'
  },
  {
    id: '3',
    question: 'Can WebUnpack convert Framer or Webflow sites to HTML?',
    answer: 'Yes! WebUnpack automatically converts Framer, Webflow, Wix, and other no-code projects into fully structured static HTML with CSS and assets. You can also export directly to React code for custom development or hosting.'
  },
  {
    id: '4',
    question: 'What is the difference between single-page and full-site export?',
    answer: 'Single-page export downloads only the current pages HTML and assets. Full-site export automatically detects and converts all linked pages across your project — ideal for migrating entire no-code sites to HTML or React.'
  },
  {
    id: '5',
    question: 'Can I export websites from tools like Lovable, Bolt.new, or Replit?',
    answer: 'Absolutely. WebUnpack supports modern builders like Lovable, Bolt.new, Replit, Shopify, Notion, and Squarespace. You can export your entire project to static HTML or React code and host it anywhere you like.'
  },
  {
    id: '6',
    question: 'Do I need coding experience to use WebUnpack?',
    answer: 'Not at all. WebUnpack is designed for both developers and non-coders. Just paste a URL and choose your format — HTML or React — and the platform automatically organizes your files for clean deployment.'
  },
  {
    id: '7',
    question: 'Where can I host my exported website?',
    answer: 'Once exported, your website can be hosted on any platform — including Netlify, Vercel, GitHub Pages, Cloudflare Pages, or your preferred hosting provider. The files are optimized for instant deployment.'
  },
  {
    id: '8',
    question: 'What file formats are included in the export?',
    answer: 'Every export includes a clean folder structure with HTML, CSS, JS, and image assets. If you choose React export, you will receive reusable component files ready to integrate into your React project.'
  },
  {
    id: '9',
    question: 'Does WebUnpack offer API or bulk export features?',
    answer: 'Yes, API and bulk export features are part of our upcoming professional plan. They will allow automation and integration for agencies managing multiple Webflow or Framer projects at once.'
  },
  {
    id: '10',
    question: 'Is WebUnpack free to use?',
    answer: 'WebUnpack currently offers free exports with fair usage limits. Premium plans with additional features like React conversion, API access, and full-site export will be available soon.'
  },
  {
    id: '11',
    question: 'How do I migrate from Webflow to self-hosted HTML?',
    answer: 'Enter your Webflow site URL in WebUnpack, select "Webflow" as the platform type, and export. You will receive clean HTML, CSS, and JavaScript files that can be uploaded to any hosting service, giving you full control without Webflow hosting fees.'
  },
  {
    id: '12',
    question: 'Can I convert my Notion page to a standalone website?',
    answer: 'Yes. WebUnpack can export Notion pages into static HTML websites with all content, styling, and assets preserved. This is perfect for creating public documentation sites or portfolios from your Notion workspace.'
  },
  {
    id: '13',
    question: 'Does WebUnpack remove platform branding and badges?',
    answer: 'Yes. WebUnpack automatically removes Made with Webflow, Built on Framer, and similar platform badges from your exported site, giving you a clean, professional result ready for your own branding.'
  },
  {
    id: '14',
    question: 'How does WebUnpack handle responsive design and mobile layouts?',
    answer: 'WebUnpack preserves all responsive breakpoints and mobile-optimized styles from your original site. The exported HTML and CSS maintain full responsiveness across all devices without any additional configuration needed.'
  },
  {
    id: '15',
    question: 'Can I export WordPress themes as static HTML sites?',
    answer: 'Yes. WebUnpack can convert WordPress sites into fast, static HTML versions. This is ideal for improving site speed, reducing hosting costs, and eliminating the need for database maintenance while keeping your design intact.'
  }
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
      <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-gray-800/20 rounded-xl transform rotate-30"></div>
      <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gray-700/30 rounded-lg transform -rotate-45"></div>
    </div>
  </div>
)

interface TestimonialCardProps {
  quote: string
  name: string
  title: string
  website: string
  domain: string
}

const TestimonialCard = ({ quote, name, title, website, domain }: TestimonialCardProps) => (
  <div
    className="w-full max-w-sm rounded-3xl p-6 pb-10 flex flex-col justify-between"
    style={{
      backgroundColor: 'rgba(22, 24, 32, 0.3)',
      border: '1px solid rgba(240, 236, 230, 0.075)'
    }}
  >
    <div>
      <p
        className="text-sm leading-5 mb-0"
        style={{ color: 'rgb(121, 131, 140)' }}
      >
        {quote}
      </p>
    </div>
    <div className="mt-12">
      <div className="text-xs">
        <span
          className="font-medium"
          style={{ color: 'rgb(240, 236, 230)' }}
        >
          {name}
        </span>
        <small
          className="block mt-1 text-xs"
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            color: 'rgb(121, 131, 140)'
          }}
        >
          {title}
        </small>
      </div>
      <div
        className="flex items-center mt-3 text-xs"
        style={{
          fontFamily: '"IBM Plex Mono", monospace',
          color: 'rgb(240, 236, 230)'
        }}
      >
        <span
          className="w-2 h-2 mr-2 bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.8 4.153V0H10.001v5.2H5.809a.582.582 0 0 0-.226.048H5.58a.602.602 0 0 0-.381.575V10H0V4.8H4.193a.578.578 0 0 0 .225-.048h.002a.602.602 0 0 0 .251-.187l.009-.013a.63.63 0 0 0 .12-.376z' fill='%23bdceb4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        www.{website}
        <span style={{ color: 'rgb(202, 184, 236)' }}>.{domain}</span>
      </div>
    </div>
  </div>
)

interface FAQItemProps {
  item: {
    id: string
    question: string
    answer: string
  }
  isExpanded: boolean
  onToggle: () => void
}

const FAQItem = ({ item, isExpanded, onToggle }: FAQItemProps) => (
  <div className="border-b overflow-hidden" style={{ borderColor: 'rgb(55, 65, 81)' }}>
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-5 text-left hover:text-gray-200 transition-colors focus:outline-none focus:text-gray-200"
      aria-expanded={isExpanded}
    >
      <span
        className="text-sm leading-relaxed pr-4"
        style={{ color: 'rgb(240, 236, 230)' }}
      >
        {item.question}
      </span>
      <div className="flex-shrink-0 ml-4">
        {isExpanded ? (
          <Minus className="w-2.5 h-2.5" style={{ color: 'rgb(252, 138, 125)' }} />
        ) : (
          <Plus className="w-2.5 h-2.5" style={{ color: 'rgb(252, 138, 125)' }} />
        )}
      </div>
    </button>
    <div
      className={`transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
        } overflow-hidden`}
    >
      <div
        className="text-sm leading-relaxed pr-5"
        style={{ color: 'rgb(121, 131, 140)' }}
      >
        <p>{item.answer}</p>
      </div>
    </div>
  </div>
)

export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [siteType, setSiteType] = useState('framer')
  const [scrapeMode, setScrapeMode] = useState('single_page')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Design')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [showAllFaqs, setShowAllFaqs] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [urlValidation, setUrlValidation] = useState<URLValidation>({ isValid: true })

  const handleUrlChange = (value: string) => {
    setUrl(value)
    if (value.trim()) {
      const validation = validateURL(value, siteType)
      setUrlValidation(validation)
    } else {
      setUrlValidation({ isValid: true, error: '', warning: '' })
    }
  }

  const handleSiteTypeChange = (value: string) => {
    setSiteType(value)
    if (url.trim()) {
      const validation = validateURL(url, value)
      setUrlValidation(validation)
    }
  }

  const handleGetStartedClick = () => {
    if (!isLoaded) return

    setIsNavigating(true)
    if (!isSignedIn) {
      router.push('/sign-up')
    } else {
      router.push('/dashboard')
    }
  }

  const handleSignInClick = () => {
    if (!isLoaded) return

    setIsNavigating(true)
    router.push('/sign-in')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    const validation = validateURL(url, siteType)
    if (!validation.isValid) {
      setUrlValidation(validation)
      return
    }

    setIsNavigating(true)
    if (!isSignedIn) {
      router.push('/sign-up')
      return
    }
    router.push(`/dashboard?url=${encodeURIComponent(url)}&type=${siteType}&mode=${scrapeMode}`)
  }

  const toggleFaqItem = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const visibleFaqs = showAllFaqs ? faqs : faqs.slice(0, 5)

  if (!isLoaded || isNavigating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
        <LoadingSpinner
          size="lg"
          text={isNavigating ? 'Navigating...' : 'Loading WebUnpack...'}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(15, 16, 18)', color: 'rgb(121, 131, 140)' }}>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full px-4 h-20" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <Link
            href="/"
            className="flex items-center space-x-3 text-green-200 hover:text-green-100 transition-colors duration-150"
          >
            <Image
              src={logo}
              alt="WebUnpack Logo"
              width={56}
              height={56}
              className="object-contain"
            />
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

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#showcase"
              className="text-gray-200 hover:text-white transition-colors duration-150 text-sm"
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              features
            </Link>
            <Link
              href="/feedback"
              className="text-gray-200 hover:text-white transition-colors duration-150 text-sm"
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              feedback
            </Link>
            <Link
              href="/api-access"
              className="text-gray-200 hover:text-white transition-colors duration-150 text-sm"
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              Api Access
            </Link>
            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-200 hover:text-white transition-colors duration-150 text-sm"
                  style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                >
                  dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8',
                    }
                  }}
                />
              </>
            ) : (
              <>
                <button
                  onClick={handleSignInClick}
                  disabled={!isLoaded}
                  className="text-gray-200 hover:text-white transition-colors duration-150 text-sm disabled:opacity-50"
                  style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                >
                  sign in
                </button>
                <button
                  onClick={handleGetStartedClick}
                  disabled={!isLoaded}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-150 text-sm hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{
                    backgroundColor: 'rgb(252, 138, 125)',
                    color: 'rgb(15, 16, 18)',
                    fontFamily: '"IBM Plex Mono", monospace'
                  }}
                >
                  get started
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-200 hover:text-white transition-colors duration-150"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4" style={{ borderTop: '1px solid rgb(55, 65, 81)' }}>
            <div className="flex flex-col space-y-4">
              <Link
                href="#showcase"
                className="text-gray-200 hover:text-white transition-colors duration-150 text-sm text-center py-2"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                features
              </Link>
              <Link
                href="/feedback"
                className="text-gray-200 hover:text-white transition-colors duration-150 text-sm text-center py-2"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                feedback
              </Link>
              <Link
                href="/api-access"
                className="text-gray-200 hover:text-white transition-colors duration-150 text-sm text-center py-2"
                style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Api Access
              </Link>
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="text-gray-200 hover:text-white transition-colors duration-150 text-sm text-center py-2"
                  style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  dashboard
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      handleSignInClick()
                    }}
                    disabled={!isLoaded}
                    className="text-gray-200 hover:text-white transition-colors duration-150 text-sm text-center py-2 disabled:opacity-50"
                    style={{ fontFamily: '"IBM Plex Mono", monospace' }}
                  >
                    sign in
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      handleGetStartedClick()
                    }}
                    disabled={!isLoaded}
                    className="text-center py-2 px-4 rounded-lg font-medium transition-all duration-150 text-sm disabled:opacity-50"
                    style={{
                      backgroundColor: 'rgb(252, 138, 125)',
                      color: 'rgb(15, 16, 18)',
                      fontFamily: '"IBM Plex Mono", monospace'
                    }}
                  >
                    get started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <section className="relative pt-32 pb-20 overflow-hidden">
        <BackgroundPattern />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center min-h-[600px]">
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1
                  className="text-3xl lg:text-4xl font-normal leading-tight mb-6"
                  style={{
                    color: 'rgb(240, 236, 230)',
                    fontFamily: '"Funnel Display", sans-serif',
                    letterSpacing: '-0.85px',
                  }}
                >
                  Export your no-code site to full control{' '}
                  <br className="hidden sm:block" />
                  or turn pages into React code with{' '}
                  <span style={{ color: 'rgb(252, 138, 125)' }}>
                    .WebUnpack
                    <span style={{ color: 'rgb(252, 138, 125)' }}>_</span>
                  </span>
                </h1>

                <div className="mb-12">
                  <p
                    className="text-lg leading-relaxed max-w-md"
                    style={{
                      color: 'rgb(121, 131, 140)',
                      fontFamily: '"DM Sans", sans-serif'
                    }}
                  >
                    No fluff. No extra steps. Just clean website extraction{' '}
                    <br className="hidden sm:block" />
                    that removes badges and organizes everything perfectly.
                  </p>
                </div>

                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-4 max-w-2xl mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 opacity-60">
                        <Search className="w-full h-full" />
                      </div>
                      <input
                        type="text"
                        placeholder="query: &quot;https://example.framer.website&quot;"
                        value={url}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        required
                        disabled={!isLoaded}
                        className="w-full py-4 pl-12 pr-4 bg-gray-100 text-gray-900 placeholder-gray-600 rounded focus:outline-none disabled:opacity-50"
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: '14px',
                          letterSpacing: '0.47685px'
                        }}
                      />
                    </div>
                    {urlValidation.error && (
                      <p className="text-red-400 text-sm">{urlValidation.error}</p>
                    )}
                    {urlValidation.warning && !urlValidation.error && (
                      <p className="text-yellow-400 text-sm">⚠️ {urlValidation.warning}</p>
                    )}
                  </div>

                  <div className="flex items-center bg-gray-100 rounded">
                    <div className="flex-1 relative">
                      <select
                        value={siteType}
                        onChange={(e) => handleSiteTypeChange(e.target.value)}
                        disabled={!isLoaded}
                        className="w-full py-4 px-4 bg-transparent text-gray-900 focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: '14px'
                        }}
                      >
                        {siteTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>

                    <div className="flex-1 relative border-l border-gray-300">
                      <select
                        value={scrapeMode}
                        onChange={(e) => setScrapeMode(e.target.value)}
                        disabled={!isLoaded}
                        className="w-full py-4 px-4 bg-transparent text-gray-900 focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: '14px'
                        }}
                      >
                        {scrapeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>

                    <button
                      type="submit"
                      disabled={!isLoaded || !url || !urlValidation.isValid}
                      className="flex items-center justify-center px-8 py-3 m-1 font-medium rounded transition-all duration-150 disabled:opacity-50"
                      style={{
                        backgroundColor: 'rgb(252, 138, 125)',
                        color: 'rgb(15, 16, 18)',
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '14px'
                      }}
                    >
                      <ArrowRight className="w-3 h-3 mr-3" />
                      extract
                    </button>
                  </div>
                </motion.form>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-6"
                >
                  <Link
                    href="/waitlist"
                    className="flex items-center justify-center px-8 py-3 m-1 font-medium rounded transition-all duration-150"
                    style={{
                      backgroundColor: 'rgb(252, 138, 125)',
                      color: 'rgb(15, 16, 18)',
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '14px',
                      width: 'fit-content'
                    }}
                  >
                    <ArrowRight className="w-3 h-3 mr-3" />
                    React-ify Your Site
                  </Link>
                </motion.div>

                {isSignedIn && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgba(240, 236, 230, 0.1)' }}
                  >
                    <p className="text-sm" style={{ color: 'rgb(121, 131, 140)' }}>
                      Welcome back, <span style={{ color: 'rgb(240, 236, 230)' }}>{user.firstName || user.emailAddresses[0].emailAddress}</span>!
                      Ready to extract some websites?
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="showcase" className="relative w-full px-4 py-12" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <BackgroundPattern />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="mb-4 text-3xl lg:text-4xl font-normal leading-tight"
              style={{
                color: 'rgb(240, 236, 230)',
                fontFamily: '"Funnel Display", sans-serif',
              }}
            >
              <span style={{ color: 'rgb(202, 184, 236)' }}>1000+ developers</span>
              <br />
              trust WebUnpack for <br />
              their extraction needs.
            </h2>
            <p className="mb-8 text-base leading-relaxed max-w-2xl mx-auto">
              A WebUnpack extraction makes your workflow unmistakable for
              developers, users and the world.
            </p>
          </motion.div>

          <div className="mb-16">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 pb-4 px-8 min-w-max">
                {featuredSites.map((site, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="rounded-3xl p-6 min-w-[200px] text-left flex flex-col"
                    style={{
                      backgroundColor: 'rgb(22, 24, 32)',
                      border: '1px solid rgba(240, 236, 230, 0.075)'
                    }}
                  >
                    <div className="h-8 mb-2 flex items-center">
                      <div
                        className="px-3 py-1 rounded text-xs font-semibold"
                        style={{ backgroundColor: 'rgb(252, 138, 125)', color: 'rgb(15, 16, 18)' }}
                      >
                        {site.name}
                      </div>
                    </div>
                    <p
                      className="text-xs mb-6 flex-grow"
                      style={{
                        color: 'rgb(121, 131, 140)',
                        fontFamily: '"IBM Plex Mono", monospace',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {site.description}
                    </p>
                    <h4
                      className="text-xs border-t pt-3 mt-auto"
                      style={{
                        color: 'rgb(121, 131, 140)',
                        fontFamily: '"IBM Plex Mono", monospace',
                        borderColor: 'rgba(240, 236, 230, 0.075)'
                      }}
                    >
                      www.{site.domain.split('.')[0]}
                      <span style={{ color: 'rgb(240, 236, 230)' }}>
                        .{site.domain.split('.')[1]}
                      </span>
                    </h4>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex justify-center gap-8 min-w-max px-4">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`relative text-xs uppercase tracking-wider underline underline-offset-2 transition-colors ${activeCategory === category
                      ? 'text-white'
                      : 'hover:text-white'
                      }`}
                    style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      color: activeCategory === category ? 'rgb(240, 236, 230)' : 'rgb(121, 131, 140)'
                    }}
                  >
                    {category}
                    {index < categories.length - 1 && (
                      <span className="absolute -right-4 top-0 text-xs">/</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="relative w-full px-4 py-12">
            <div className="relative z-10 max-w-6xl mx-auto">
              <Marquee speed={30} pauseOnHover>
                {platformLogos.map((platform, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center gap-6 mx-8"
                  >
                    <div className="w-24 h-24 flex items-center justify-center">
                      <Image
                        src={platform.logo}
                        alt={`${platform.name} logo`}
                        width={56}
                        height={56}
                        className="object-contain"
                      />
                    </div>
                    <div
                      className="rounded px-3 py-2 text-xs whitespace-nowrap"
                      style={{
                        backgroundColor: 'rgb(22, 24, 32)',
                        border: '1px solid rgba(240, 236, 230, 0.05)',
                        fontFamily: '"IBM Plex Mono", monospace',
                        color: 'rgb(121, 131, 140)'
                      }}
                    >
                      www.{platform.name.toLowerCase()}
                      <span style={{ color: 'rgb(240, 236, 230)' }}>
                        .com
                      </span>
                    </div>
                  </div>
                ))}
              </Marquee>
            </div>
          </section>
        </div>
      </section>

      <section className="relative py-20 overflow-hidden" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <BackgroundPattern />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-between items-start gap-8">
            <div className="w-full lg:w-2/5 lg:pr-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2
                  className="mb-4 mt-0 font-normal leading-9 text-3xl tracking-wide"
                  style={{
                    color: 'rgb(240, 236, 230)',
                    fontFamily: '"Funnel Display", sans-serif',
                  }}
                >
                  From every aspect, <br />
                  <span style={{ color: 'rgb(202, 184, 236)' }}>"WebUnpack just makes sense!"</span>
                </h2>
                <p
                  className="text-sm leading-5 mb-2"
                  style={{ color: 'rgb(121, 131, 140)' }}
                >
                  A export tool tells the world exactly <br />
                  what they do—right from the start.
                </p>
              </motion.div>
            </div>

            <div className="w-full flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
                {testimonials.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="h-full"
                  >
                    <TestimonialCard {...step} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="relative w-full px-4 py-12" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <BackgroundPattern />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-between items-start gap-8 mb-10">
            <div className="w-full lg:w-96 lg:pr-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2
                  className="text-3xl lg:text-4xl font-normal leading-tight mb-4"
                  style={{
                    color: 'rgb(240, 236, 230)',
                    fontFamily: '"Funnel Display", sans-serif',
                    letterSpacing: '0.2px',
                  }}
                >
                  <span style={{ color: 'rgb(202, 184, 236)' }}>questions?</span>
                  <br />
                  consider them
                  <br />
                  answered.
                </h2>
              </motion.div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <div className="border-t" style={{ borderColor: 'rgb(55, 65, 81)' }}>
                  {visibleFaqs.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <FAQItem
                        item={item}
                        isExpanded={expandedItems.has(item.id)}
                        onToggle={() => toggleFaqItem(item.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowAllFaqs(!showAllFaqs)}
                className="inline-flex items-center gap-3 bg-transparent border px-5 py-2.5 rounded text-sm font-medium hover:border-gray-500 hover:text-white transition-all duration-150 focus:outline-none"
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  borderColor: 'rgb(75, 85, 99)',
                  color: 'rgb(240, 236, 230)'
                }}
              >
                <div
                  className="w-2 h-2.5 bg-no-repeat bg-center transition-all duration-150"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M19.98 9.14c-10.203.036-9.14 1.007-9.122-9.14h-1.72c.027 10.216 1.041 9.161-9.14 9.14v1.72c10.187-.034 9.166-1.017 9.14 9.14h1.72c-.038-10.166-1.003-9.17 9.14-9.14V9.14z' fill='%23fc8a7d'/%3E%3C/svg%3E")`,
                    backgroundSize: '100% 100%',
                    filter: 'brightness(0) invert(1)',
                    transform: showAllFaqs ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                />
                {showAllFaqs ? 'show less' : 'show more'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-12" style={{ borderColor: 'rgb(55, 65, 81)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Image
                src={logo}
                alt="WebUnpack Logo"
                width={56}
                height={56}
                className="object-contain"
              />
              <span
                className="text-xl font-bold"
                style={{
                  color: 'rgb(240, 236, 230)',
                  fontFamily: '"Funnel Display", sans-serif'
                }}
              >
                WebUnpack
              </span>
            </div>

            <div className="flex space-x-8 text-sm">
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/my-submissions" className="hover:text-white transition-colors">
                My Submissions
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: 'rgb(55, 65, 81)' }}>
            <p
              className="text-sm"
              style={{ color: 'rgb(121, 131, 140)' }}
            >
              © 2025 WebUnpack Inc. All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}