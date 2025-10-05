'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, MessageCircle, Send, Twitter, CheckCircle, AlertTriangle, DiscIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useApiService } from '@/lib/api'

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

export default function ContactPage() {
  const api = useApiService()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [ticketId, setTicketId] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const result = await api.submitContactForm({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      })
      
      if (result.success) {
        setIsSubmitted(true)
        if (result.ticket_id) {
          setTicketId(result.ticket_id)
          localStorage.setItem('lastContactTicket', result.ticket_id)
        }
      } else {
        setError(result.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setTicketId('')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setError('')
  }

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
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold mb-6" style={{ color: 'rgb(240, 236, 230)' }}>
              Get In Touch
            </h1>
            <p style={{ color: 'rgb(121, 131, 140)' }} className="text-xl max-w-3xl mx-auto leading-relaxed">
              Have questions, suggestions, or need support? We&apos;d love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: 'rgb(240, 236, 230)' }}>
                  Send us a message
                </h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                    <p className="text-red-300">{error}</p>
                  </div>
                )}

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2" style={{ color: 'rgb(240, 236, 230)' }}>
                      Message Sent!
                    </h3>
                    <p style={{ color: 'rgb(121, 131, 140)' }} className="mb-4">
                      Thanks for reaching out. We will get back to you within 24 hours.
                    </p>
                   <Button onClick={resetForm} variant="secondary">
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your name"
                      />
                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>

                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="What is this about?"
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: 'rgb(240, 236, 230)' }}>
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="Tell us more..."
                        className="w-full px-4 py-3 rounded-lg border transition-colors resize-none"
                        style={{
                          backgroundColor: 'rgb(22, 24, 32)',
                          borderColor: 'rgb(55, 65, 81)',
                          color: 'rgb(240, 236, 230)',
                        }}
                      />
                    </div>

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      size="lg"
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
                <Mail className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'rgb(240, 236, 230)' }}>
                  Email Us
                </h3>
                <p style={{ color: 'rgb(121, 131, 140)' }} className="mb-4">
                  For general inquiries, support, or business partnerships
                </p>
                <a
                  href="mailto:hello@webunpack.dev"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  chiragyadav2k3@gmail.com
                </a>
              </div>

              <div className="p-8 rounded-xl" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}>
                <h3 className="text-xl font-semibold mb-6" style={{ color: 'rgb(240, 236, 230)' }}>
                  Follow Us
                </h3>
                <div className="space-y-4">
                  <a
                    href="https://x.com/chirag_yy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-800/50"
                  >
                    <Twitter className="w-6 h-6 text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium" style={{ color: 'rgb(240, 236, 230)' }}>Twitter</p>
                      <p className="text-sm" style={{ color: 'rgb(121, 131, 140)' }}>Latest updates and tips</p>
                    </div>
                  </a>
                  <a
                    href="https://discord.gg/NafBdk4e"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-800/50"
                  >
                    <DiscIcon className="w-6 h-6 text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium" style={{ color: 'rgb(240, 236, 230)' }}>Discord</p>
                      <p className="text-sm" style={{ color: 'rgb(121, 131, 140)' }}>Join our community</p>
                    </div>
                  </a>
              </div>
              </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
