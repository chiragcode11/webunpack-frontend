'use client'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Target, Zap, Code, Users, Globe } from 'lucide-react'
import Link from 'next/link'

const BackgroundPattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0" style={{
      backgroundImage: `
        linear-gradient(90deg, rgba(45, 50, 56, 0.3) 1px, transparent 1px),
        linear-gradient(rgba(45, 50, 56, 0.3) 1px, transparent 1px)
      `,
      backgroundSize: '80px 80px',
    }}>
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg transform rotate-12"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl transform -rotate-6"></div>
    </div>
  </div>
)

export default function AboutPage() {
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

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold mb-6" style={{ color: 'rgb(240, 236, 230)' }}>
              About WebUnpack
            </h1>
            <p style={{ color: 'rgb(121, 131, 140)' }} className="text-xl max-w-3xl mx-auto leading-relaxed">
              Democratizing web development by making website extraction and React conversion accessible to everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
                <Target className="w-10 h-10 text-blue-400 mb-4" />
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
                  Our Mission
                </h2>
                <p style={{ color: 'rgb(121, 131, 140)' }} className="text-lg leading-relaxed">
                  To bridge the gap between design inspiration and development implementation. We believe every developer should be able to learn from and build upon existing web designs, transforming them into modern, maintainable React applications.
                </p>
              </div>

              <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
                <Zap className="w-10 h-10 text-purple-400 mb-4" />
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
                  Why It Matters
                </h2>
                <ul style={{ color: 'rgb(121, 131, 140)' }} className="text-lg space-y-3">
                  <li>• <strong style={{ color: 'rgb(240, 236, 230)' }}>Learn faster:</strong> Study real-world implementations</li>
                  <li>• <strong style={{ color: 'rgb(240, 236, 230)' }}>Save time:</strong> Skip the tedious conversion process</li>
                  <li>• <strong style={{ color: 'rgb(240, 236, 230)' }}>Modern standards:</strong> Get clean, TypeScript React code</li>
                  <li>• <strong style={{ color: 'rgb(240, 236, 230)' }}>Best practices:</strong> Follow industry conventions</li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
                <Code className="w-10 h-10 text-green-400 mb-4" />
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
                  About the Developer
                </h2>
                <p style={{ color: 'rgb(121, 131, 140)' }} className="text-lg leading-relaxed mb-6">
                  Built by a passionate full-stack developer who understands the frustration of manually converting inspiring designs into React components. After spending countless hours on repetitive conversion tasks, I decided to create a tool that automates this process while maintaining code quality.
                </p>
                <p style={{ color: 'rgb(121, 131, 140)' }} className="text-lg leading-relaxed">
                  Combining expertise in web scraping, AI integration, and modern React development, WebUnpack represents the intersection of practical developer needs and cutting-edge technology.
                </p>
              </div>

              <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
                <Globe className="w-10 h-10 text-orange-400 mb-4" />
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
                  Our Vision
                </h2>
                <p style={{ color: 'rgb(121, 131, 140)' }} className="text-lg leading-relaxed">
                  To create a world where developers can focus on innovation rather than repetitive conversion tasks. We envision WebUnpack as the go-to platform for transforming web inspiration into production-ready React applications.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'rgb(240, 236, 230)' }}>
              What Makes Us Different
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.3)', border: '1px solid rgb(55, 65, 81)' }}>
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'rgb(240, 236, 230)' }}>
                  AI-Powered Conversion
                </h3>
                <p style={{ color: 'rgb(121, 131, 140)' }}>
                  Advanced AI analyzes HTML structure and generates clean, semantic React components
                </p>
              </div>

              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.3)', border: '1px solid rgb(55, 65, 81)' }}>
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'rgb(240, 236, 230)' }}>
                  Production Ready
                </h3>
                <p style={{ color: 'rgb(121, 131, 140)' }}>
                  Generated code follows industry best practices with TypeScript, tests, and documentation
                </p>
              </div>

              <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.3)', border: '1px solid rgb(55, 65, 81)' }}>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'rgb(240, 236, 230)' }}>
                  Developer Focused
                </h3>
                <p style={{ color: 'rgb(121, 131, 140)' }}>
                  Built by developers, for developers. We understand your workflow and pain points
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center p-8 rounded-xl"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
              Ready to Transform Your Workflow?
            </h2>
            <p style={{ color: 'rgb(121, 131, 140)' }} className="text-lg mb-6">
              Join thousands of developers who are already using WebUnpack to accelerate their development process.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all duration-150 hover:bg-blue-700"
            >
              Get Started Now
              <Zap className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
