'use client'
import { motion } from 'framer-motion'
import { ArrowLeft, Code, Zap, Users, Shield, ExternalLink, MessageSquare, DollarSign, Settings, Mail } from 'lucide-react'
import Link from 'next/link'

const BackgroundPattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(90deg, rgba(45, 50, 56, 0.3) 1px, transparent 1px),
        linear-gradient(rgba(45, 50, 56, 0.3) 1px, transparent 1px)
      `,
      backgroundSize: '80px 80px',
    }} />
  </div>
)

export default function ApiAccessPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
      <header className="border-b" style={{ borderColor: 'rgb(55, 65, 81)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="relative">
        <BackgroundPattern />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Code className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold mb-6" style={{ color: 'rgb(240, 236, 230)' }}>
              WebUnpack API
            </h1>
            <p style={{ color: 'rgb(121, 131, 140)' }} className="text-xl max-w-3xl mx-auto leading-relaxed">
              Integrate our powerful web scraping and React conversion capabilities directly into your applications
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-20"
          >
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'rgb(240, 236, 230)' }}>
              API Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(240, 236, 230)' }}>
                  Fast Extraction
                </h3>
                <p style={{ color: 'rgb(121, 131, 140)' }} className="text-sm">
                  Extract website content in seconds with our optimized scraping engine
                </p>
              </div>

              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(240, 236, 230)' }}>
                  React Conversion
                </h3>
                <p style={{ color: 'rgb(121, 131, 140)' }} className="text-sm">
                  AI-powered conversion to clean, modern React components
                </p>
              </div>

              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(240, 236, 230)' }}>
                  Enterprise Security
                </h3>
                <p style={{ color: 'rgb(121, 131, 140)' }} className="text-sm">
                  SOC 2 compliant with end-to-end encryption and secure processing
                </p>
              </div>

              <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(240, 236, 230)' }}>
                  Developer Support
                </h3>
                <p style={{ color: 'rgb(121, 131, 140)' }} className="text-sm">
                  Comprehensive documentation and dedicated developer support
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-20"
          >
            <div className="text-center p-12 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.3)', border: '1px solid rgb(55, 65, 81)' }}>
              <h2 className="text-3xl font-bold mb-12" style={{ color: 'rgb(240, 236, 230)' }}>
                Enterprise API Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: 'rgb(240, 236, 230)' }}>
                    High-Volume Processing
                  </h3>
                  <p style={{ color: 'rgb(121, 131, 140)' }} className="text-sm">
                    Bulk conversion capabilities for enterprise workloads with unlimited requests
                  </p>
                </div>

                <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: 'rgb(240, 236, 230)' }}>
                    Secure & Reliable
                  </h3>
                  <p style={{ color: 'rgb(121, 131, 140)' }} className="text-sm">
                    Enterprise-grade security with SSL encryption and 99.9% uptime guarantee
                  </p>
                </div>

                <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3" style={{ color: 'rgb(240, 236, 230)' }}>
                    Custom Integration
                  </h3>
                  <p style={{ color: 'rgb(121, 131, 140)' }} className="text-sm">
                    Tailored solutions with webhooks, custom endpoints, and dedicated support
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-20"
          >
            <div className="text-center p-12 rounded-xl" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
                Custom Pricing
              </h2>
              <p style={{ color: 'rgb(121, 131, 140)' }} className="text-lg mb-8 max-w-3xl mx-auto">
                API access is available on a case-by-case basis with custom pricing based on your specific needs, 
                volume requirements, and integration complexity. Contact us to discuss your project and get a 
                personalized quote.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                  <span className="text-green-400 font-medium text-sm">Volume-based pricing</span>
                </div>
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                  <span className="text-green-400 font-medium text-sm">Flexible payment terms</span>
                </div>
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                  <span className="text-green-400 font-medium text-sm">Enterprise support</span>
                </div>
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                  <span className="text-green-400 font-medium text-sm">Custom SLA available</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
          >
            <div className="text-center p-12 rounded-xl" style={{ backgroundColor: 'rgba(114, 137, 218, 0.1)', border: '1px solid rgba(114, 137, 218, 0.2)' }}>
              <MessageSquare className="w-16 h-16 text-[#7289da] mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
                Join Our Developer Community
              </h2>
              <p style={{ color: 'rgb(121, 131, 140)' }} className="text-lg mb-8 max-w-2xl mx-auto">
                Connect with other developers, get help with integration, share feedback, and stay updated on new features.
              </p>
              <a
                href="https://discord.gg/NafBdk4e"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-[#7289da] text-white rounded-lg font-medium transition-all duration-150 hover:bg-[#5865f2]"
              >
                <MessageSquare className="mr-3 w-5 h-5" />
                Join Discord Community
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="p-12 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.3)', border: '1px solid rgb(55, 65, 81)' }}>
              <Mail className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
                Ready to Get Started?
              </h2>
              <p style={{ color: 'rgb(121, 131, 140)' }} className="text-lg mb-8 max-w-2xl mx-auto">
                Contact us to discuss your API requirements, get custom pricing, and start integrating WebUnpack into your applications.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:api@webunpack.dev?subject=API Access Inquiry&body=Hi, I'm interested in API access for WebUnpack. Please provide more details about pricing and integration."
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-medium transition-all duration-150 hover:bg-blue-700"
                >
                  <Mail className="mr-2 w-5 h-5" />
                  Contact for API Access
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium transition-all duration-150 hover:bg-gray-800"
                >
                  General Contact
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Link>
              </div>
              
              <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Email us at:</strong> chiragyadav2k3@gmail.com for enterprise inquiries and API access requests
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
