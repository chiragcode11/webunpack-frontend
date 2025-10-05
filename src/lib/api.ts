import { useAuth } from '@clerk/nextjs'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ScrapeRequest {
  url: string
  site_type: string
  scrape_mode: 'single_page' | 'multi_page'
  selected_pages?: string[]
}

export interface PageInfo {
  url: string
  title: string
  path: string
  preview_image?: string
  complexity_score?: number
  conversion_time_estimate?: string
}

export interface ScrapeJob {
  id: string
  job_id: string
  url: string
  site_type: string
  scrape_mode: string
  status: string
  created_at: string
  download_url?: string
  pages_scraped?: number
  error_message?: string
  completed_at?: string
  file_path?: string
}

export interface ReactifyJob {
  id: string
  job_id: string
  page_url: string
  status: string
  file_size_mb?: number
  components_generated?: number
  created_at: string
  error_message?: string
  download_url?: string
}

export interface ConversionOptions {
  framework: string
  styling: string
  typescript: boolean
  optimization_level: string
  include_tests: boolean
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface FeedbackFormData {
  name?: string
  email?: string
  feedback_type: 'general' | 'feature' | 'bug'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface SubmissionResponse {
  success: boolean
  message: string
  ticket_id?: string
  feedback_id?: string
}

export interface ContactSubmission {
  id: string
  subject: string
  message: string
  status: 'new' | 'in_progress' | 'resolved'
  ticket_id: string
  created_at: string
}

export interface FeedbackSubmission {
  id: string
  title: string
  description: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  feedback_type: 'bug' | 'feature' | 'improvement' | 'general'
  feedback_id: string
  created_at: string
}

export interface UserSubmissions {
  success: boolean
  contact_submissions: ContactSubmission[]
  feedback_submissions: FeedbackSubmission[]
}

export interface DiscoverPagesResponse {
  success: boolean
  message: string
  pages: PageInfo[]
}

export interface ScrapeResponse {
  success: boolean
  message: string
  job_id?: string
  download_url?: string
  file_path?: string
}

export interface ReactifyResponse {
  success: boolean
  message: string
  job_id?: string
  estimated_time?: string
}

export interface UserUsage {
  single_page_used: number
  multi_page_used: number
  reactify_used: number
  single_page_limit: number
  multi_page_limit: number
  reactify_limit: number
  can_scrape_single: boolean
  can_scrape_multi: boolean
  can_reactify: boolean
}

export interface UserProfile {
  id: string
  clerk_id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
  usage: UserUsage
}

export interface WaitlistResponse {
  success: boolean
  message: string
}

class ApiService {
  private getAuthHeaders(token?: string | null) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  private async fetchWithAuth(endpoint: string, token?: string | null, options: RequestInit = {}) {
    const headers = this.getAuthHeaders(token)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMessage: string
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return response.json()
      }
      
      return response.text()
    } catch (error: unknown) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please try again')
        }
        throw error
      }
      
      throw new Error('Network error occurred')
    }
  }

  async discoverPages(url: string, siteType: string, token?: string | null): Promise<PageInfo[]> {
    const response = await this.fetchWithAuth('/discover-pages', token, {
      method: 'POST',
      body: JSON.stringify({
        url,
        site_type: siteType,
      }),
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to discover pages')
    }

    return response.pages || []
  }

  async scrapeSite(request: ScrapeRequest, token?: string | null): Promise<ScrapeResponse> {
    const response = await this.fetchWithAuth('/scrape', token, {
      method: 'POST',
      body: JSON.stringify(request),
    })

    if (!response.success) {
      throw new Error(response.message || 'Scraping failed')
    }

    return response
  }

  async discoverPagesForReactify(url: string, token?: string | null): Promise<PageInfo[]> {
    const response = await this.fetchWithAuth('/reactify/discover', token, {
      method: 'POST',
      body: JSON.stringify({ url }),
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to discover pages')
    }

    return response.pages || []
  }

  async convertPageToReact(pageUrl: string, options: ConversionOptions, token?: string | null): Promise<ReactifyResponse> {
    const response = await this.fetchWithAuth('/reactify/convert', token, {
      method: 'POST',
      body: JSON.stringify({
        page_url: pageUrl,
        conversion_options: options
      }),
    })

    return response
  }

  async getReactifyStatus(jobId: string, token?: string | null): Promise<ReactifyJob> {
    return await this.fetchWithAuth(`/reactify/status/${jobId}`, token)
  }

  async downloadReactProject(jobId: string, token: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/reactify/download/${jobId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    
    if (!response.ok) throw new Error('Download failed')
    return response.blob()
  }

  async submitContactForm(data: ContactFormData, token?: string | null): Promise<SubmissionResponse> {
    return await this.fetchWithAuth('/contact', token, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async submitFeedback(data: FeedbackFormData, token?: string | null): Promise<SubmissionResponse> {
    return await this.fetchWithAuth('/feedback', token, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserSubmissions(token?: string | null): Promise<UserSubmissions> {
    return await this.fetchWithAuth('/my-submissions', token)
  }

  async getUserJobs(token?: string | null): Promise<ScrapeJob[]> {
    const response = await this.fetchWithAuth('/my-jobs', token)
    return response.jobs || []
  }

  async getUserProfile(token?: string | null): Promise<UserProfile> {
    return await this.fetchWithAuth('/me', token)
  }

  async getJobStatus(jobId: string, token?: string | null): Promise<ScrapeJob> {
    return await this.fetchWithAuth(`/job-status/${jobId}`, token)
  }

  async joinWaitlist(email: string): Promise<WaitlistResponse> {
    return await this.fetchWithAuth('/waitlist', null, {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async downloadFile(jobId: string, token: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/download/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Download failed')
    }

    return response.blob()
  }

  async healthCheck(): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      return response.ok
    } catch (error: unknown) {
      console.error('API health check failed:', error)
      return false
    }
  }
}

export const apiService = new ApiService()

export function useApiService() {
  const { getToken } = useAuth()
  
  return {
    async discoverPages(url: string, siteType: string): Promise<PageInfo[]> {
      const token = await getToken()
      return apiService.discoverPages(url, siteType, token)
    },
    
    async scrapeSite(request: ScrapeRequest): Promise<ScrapeResponse> {
      const token = await getToken()
      return apiService.scrapeSite(request, token)
    },

    async discoverPagesForReactify(url: string): Promise<PageInfo[]> {
      const token = await getToken()
      return apiService.discoverPagesForReactify(url, token)
    },

    async convertPageToReact(pageUrl: string, options: ConversionOptions): Promise<ReactifyResponse> {
      const token = await getToken()
      return apiService.convertPageToReact(pageUrl, options, token)
    },

    async getReactifyStatus(jobId: string): Promise<ReactifyJob> {
      const token = await getToken()
      return apiService.getReactifyStatus(jobId, token)
    },

    async downloadReactProject(jobId: string): Promise<Blob> {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return apiService.downloadReactProject(jobId, token)
    },

    async submitContactForm(data: ContactFormData): Promise<SubmissionResponse> {
      const token = await getToken()
      return apiService.submitContactForm(data, token)
    },

    async submitFeedback(data: FeedbackFormData): Promise<SubmissionResponse> {
      const token = await getToken()
      return apiService.submitFeedback(data, token)
    },

    async getUserSubmissions(): Promise<UserSubmissions> {
      const token = await getToken()
      return apiService.getUserSubmissions(token)
    },
    
    async getUserJobs(): Promise<ScrapeJob[]> {
      const token = await getToken()
      return apiService.getUserJobs(token)
    },
    
    async getUserProfile(): Promise<UserProfile> {
      const token = await getToken()
      return apiService.getUserProfile(token)
    },

    async getJobStatus(jobId: string): Promise<ScrapeJob> {
      const token = await getToken()
      return apiService.getJobStatus(jobId, token)
    },

    async downloadFile(jobId: string): Promise<Blob> {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      return apiService.downloadFile(jobId, token)
    },

    async joinWaitlist(email: string): Promise<WaitlistResponse> {
      return apiService.joinWaitlist(email)
    },
    
    healthCheck: apiService.healthCheck.bind(apiService),
  }
}