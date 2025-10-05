'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare, Send, CheckCircle, Lightbulb, Bug, ThumbsUp, AlertTriangle } from 'lucide-react'
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

export default function FeedbackPage() {
  const api = useApiService()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    title: '',
    description: '',
    priority: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submissionMessage, setSubmissionMessage] = useState('')
  const [feedbackId, setFeedbackId] = useState('')

  const feedbackTypes = [
    { id: 'general', label: 'General Feedback', icon: ThumbsUp, color: 'text-blue-400' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-yellow-400' },
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-400' }
  ]

  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-gray-500' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { id: 'high', label: 'High', color: 'bg-orange-500' },
    { id: 'urgent', label: 'Urgent', color: 'bg-red-500' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const result = await api.submitFeedback({
        name: formData.name || undefined,
        email: formData.email || undefined,
        feedback_type: formData.feedbackType as 'general' | 'feature' | 'bug',
        title: formData.title,
        description: formData.description,
        priority: formData.priority as 'low' | 'medium' | 'high' | 'urgent'
      })
      
      if (result.success) {
        setIsSubmitted(true)
        setSubmissionMessage(result.message)
        if (result.feedback_id) {
          setFeedbackId(result.feedback_id)
          localStorage.setItem('lastFeedbackId', result.feedback_id)
        }
      } else {
        setError(result.message || 'Failed to submit feedback')
      }
    } catch (error) {
      console.error('Feedback form error:', error)
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setSubmissionMessage('')
    setFeedbackId('')
    setFormData({
      name: '',
      email: '',
      feedbackType: 'general',
      title: '',
      description: '',
      priority: 'medium'
    })
    setError('')
  }

  const selectedType = feedbackTypes.find(type => type.id === formData.feedbackType)
  const selectedPriority = priorities.find(p => p.id === formData.priority)

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

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl font-bold mb-6" style={{ color: 'rgb(240, 236, 230)' }}>
              Share Your Feedback
            </h1>
            <p style={{ color: 'rgb(121, 131, 140)' }} className="text-xl max-w-3xl mx-auto leading-relaxed">
              Help us improve WebUnpack by sharing your thoughts, reporting bugs, or suggesting new features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {feedbackTypes.map((type) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.feedbackType === type.id
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
                style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)' }}
                onClick={() => setFormData(prev => ({ ...prev, feedbackType: type.id }))}
              >
                <type.icon className={`w-10 h-10 ${type.color} mb-4`} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(240, 236, 230)' }}>
                  {type.label}
                </h3>
                <p style={{ color: 'rgb(121, 131, 140)' }} className="text-sm">
                  {type.id === 'general' && 'Share your overall experience and suggestions'}
                  {type.id === 'feature' && 'Request new features or improvements'}
                  {type.id === 'bug' && 'Report issues or unexpected behavior'}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 rounded-xl"
            style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', border: '1px solid rgb(55, 65, 81)' }}
          >
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
                className="text-center py-12"
              >
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'rgb(240, 236, 230)' }}>
                  Thank You for Your Feedback!
                </h2>
                <p style={{ color: 'rgb(121, 131, 140)' }} className="text-lg mb-4">
                  {submissionMessage || "We appreciate you taking the time to help us improve WebUnpack. Our team will review your feedback and get back to you if needed."}
                </p>
                {feedbackId && (
                  <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg mb-6">
                    <p className="text-blue-300 text-sm">
                      <strong>Feedback ID:</strong> {feedbackId}
                    </p>
                  </div>
                )}
                <Button onClick={resetForm} variant="secondary" size="lg">
                  Submit More Feedback
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center mb-6">
                  {selectedType && <selectedType.icon className={`w-6 h-6 ${selectedType.color} mr-3`} />}
                  <h2 className="text-2xl font-bold" style={{ color: 'rgb(240, 236, 230)' }}>
                    {selectedType?.label}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Name (Optional)"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                    />
                    <Input
                      label="Email (Optional)"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder={
                        formData.feedbackType === 'bug' ? 'Brief description of the issue' :
                        formData.feedbackType === 'feature' ? 'Feature request title' :
                        'Feedback summary'
                      }
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: 'rgb(240, 236, 230)' }}>
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border transition-colors"
                        style={{
                          backgroundColor: 'rgb(22, 24, 32)',
                          borderColor: 'rgb(55, 65, 81)',
                          color: 'rgb(240, 236, 230)',
                        }}
                      >
                        {priorities.map(priority => (
                          <option key={priority.id} value={priority.id}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: 'rgb(240, 236, 230)' }}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder={
                        formData.feedbackType === 'bug' ? 
                        'Please describe the issue in detail. Include steps to reproduce, expected behavior, and actual behavior...' :
                        formData.feedbackType === 'feature' ?
                        'Describe the feature you would like to see. How would it work? What problem would it solve?' :
                        'Share your thoughts, suggestions, or general feedback about WebUnpack...'
                      }
                      className="w-full px-4 py-3 rounded-lg border transition-colors resize-none"
                      style={{
                        backgroundColor: 'rgb(22, 24, 32)',
                        borderColor: 'rgb(55, 65, 81)',
                        color: 'rgb(240, 236, 230)',
                      }}
                    />
                  </div>

                  {formData.feedbackType === 'bug' && (
                    <div className="p-4 rounded-lg border" style={{ borderColor: 'rgb(239, 68, 68)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                      <h4 className="font-medium text-red-400 mb-2">Bug Report Tips:</h4>
                      <ul className="text-sm text-red-300 space-y-1">
                        <li>• Include steps to reproduce the issue</li>
                        <li>• Mention your browser and operating system</li>
                        <li>• Attach screenshots if helpful</li>
                        <li>• Describe what you expected vs what actually happened</li>
                      </ul>
                    </div>
                  )}

                  {formData.feedbackType === 'feature' && (
                    <div className="p-4 rounded-lg border" style={{ borderColor: 'rgb(245, 158, 11)', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                      <h4 className="font-medium text-yellow-400 mb-2">Feature Request Tips:</h4>
                      <ul className="text-sm text-yellow-300 space-y-1">
                        <li>• Explain the use case and problem it solves</li>
                        <li>• Describe how you envision it working</li>
                        <li>• Consider mentioning similar features elsewhere</li>
                        <li>• Think about edge cases and limitations</li>
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${selectedPriority?.color} mr-2`}></div>
                      <span className="text-sm" style={{ color: 'rgb(121, 131, 140)' }}>
                        Priority: {selectedPriority?.label}
                      </span>
                    </div>

                    <Button
                      type="submit"
                      loading={isSubmitting}
                      size="lg"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </div>
                </form>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12 p-6 rounded-xl"
            style={{ backgroundColor: 'rgba(22, 24, 32, 0.3)', border: '1px solid rgb(55, 65, 81)' }}
          >
            <p style={{ color: 'rgb(121, 131, 140)' }}>
              You can also join our <Link href="/api-access" className="text-blue-400 hover:text-blue-300">Discord community</Link> to 
              discuss features, get help, or connect with other developers.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
