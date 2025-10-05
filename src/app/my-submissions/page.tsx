'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useApiService } from '@/lib/api'

export default function MySubmissionsPage() {
  const { isSignedIn } = useAuth()
  const api = useApiService()
  const [submissions, setSubmissions] = useState({ contact_submissions: [], feedback_submissions: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSignedIn) {
      loadSubmissions()
    }
  }, [isSignedIn])

  const loadSubmissions = async () => {
    try {
      const result = await api.getUserSubmissions()
      if (result.success) {
        setSubmissions(result)
      }
    } catch (error) {
      console.error('Failed to load submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'rgb(15, 16, 18)' }}>
        <div className="text-center">
          <p style={{ color: 'rgb(121, 131, 140)' }}>Please sign in to view your submissions</p>
        </div>
      </div>
    )
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'rgb(240, 236, 230)' }}>
          My Submissions
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto"></div>
            <p style={{ color: 'rgb(121, 131, 140)' }} className="mt-4">Loading submissions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Submissions */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: 'rgb(240, 236, 230)' }}>
                <Mail className="w-5 h-5 mr-2" />
                Contact Messages ({submissions.contact_submissions.length})
              </h2>
              
              {submissions.contact_submissions.length === 0 ? (
                <p style={{ color: 'rgb(121, 131, 140)' }}>No contact messages yet</p>
              ) : (
                <div className="space-y-4">
                  {submissions.contact_submissions.map((submission: any) => (
                    <div key={submission.id} className="p-4 rounded-lg border" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', borderColor: 'rgb(55, 65, 81)' }}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium" style={{ color: 'rgb(240, 236, 230)' }}>
                          {submission.subject}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded ${
                          submission.status === 'new' ? 'bg-blue-500/20 text-blue-400' : 
                          submission.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                      <p style={{ color: 'rgb(121, 131, 140)' }} className="text-sm mb-2">
                        {submission.message.substring(0, 100)}...
                      </p>
                      <div className="flex justify-between text-xs" style={{ color: 'rgb(121, 131, 140)' }}>
                        <span>Ticket: {submission.ticket_id}</span>
                        <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback Submissions */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: 'rgb(240, 236, 230)' }}>
                <MessageSquare className="w-5 h-5 mr-2" />
                Feedback ({submissions.feedback_submissions.length})
              </h2>
              
              {submissions.feedback_submissions.length === 0 ? (
                <p style={{ color: 'rgb(121, 131, 140)' }}>No feedback submitted yet</p>
              ) : (
                <div className="space-y-4">
                  {submissions.feedback_submissions.map((submission: any) => (
                    <div key={submission.id} className="p-4 rounded-lg border" style={{ backgroundColor: 'rgba(22, 24, 32, 0.5)', borderColor: 'rgb(55, 65, 81)' }}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium" style={{ color: 'rgb(240, 236, 230)' }}>
                          {submission.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            submission.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                            submission.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            submission.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {submission.priority}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            submission.feedback_type === 'bug' ? 'bg-red-500/20 text-red-400' :
                            submission.feedback_type === 'feature' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {submission.feedback_type}
                          </span>
                        </div>
                      </div>
                      <p style={{ color: 'rgb(121, 131, 140)' }} className="text-sm mb-2">
                        {submission.description.substring(0, 100)}...
                      </p>
                      <div className="flex justify-between text-xs" style={{ color: 'rgb(121, 131, 140)' }}>
                        <span>ID: {submission.feedback_id}</span>
                        <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
