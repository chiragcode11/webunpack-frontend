export interface URLValidation {
  isValid: boolean
  error?: string
  warning?: string
}

const sitePatterns = {
  framer: [
    /\.framer\.website$/,
    /\.framer\.site$/,
    /framer\.site$/,
    /framer\.website$/,
    /\.framer\.app$/
  ],
  webflow: [
    /\.webflow\.io$/,
    /webflow\.io$/,
    /\.webflow\.com$/,
    /webflow\.com$/
  ],
  wordpress: [
    /wordpress\.com$/,
    /\.wordpress\.com$/,
    /wp-content/,
    /wp-admin/,
    /wp-includes/
  ],
  wix: [
    /wixsite\.com$/,
    /\.wixsite\.com$/,
    /wix\.com$/,
    /\.wix\.com$/
  ],
  shopify: [
    /\.myshopify\.com$/,
    /myshopify\.com$/,
    /shopifycdn\.com/
  ],
  bolt: [
    /bolt\.new$/,
    /bolt\.host$/,
    /\.bolt\.new$/,
    /\.bolt\.host$/,
  ],
  lovable: [
    /lovable\.dev$/,
    /lovable\.com$/,
    /\.lovable\.dev$/,
    /\.lovable\.com$/,
    /lovableproject\.com$/
  ],
  notion: [
    /notion\.so$/,
    /\.notion\.so$/,
    /notion\.site$/,
    /\.notion\.site$/
  ],
  squarespace: [
    /squarespace\.com$/,
    /\.squarespace\.com$/,
    /static1\.squarespace\.com/
  ],
  replit: [
    /replit\.com$/,
    /\.replit\.com$/,
    /repl\.it$/,
    /\.repl\.it$/
  ],
  gumroad: [
    /gumroad\.com$/,
    /\.gumroad\.com$/
  ],
  rocket: [
    /rocket\.new$/,
    /\.rocket\.new$/
  ],
  general: []
}

const testingSiteTypes = ['wordpress', 'wix', 'shopify', 'bolt', 'lovable', 'notion', 'squarespace', 'replit', 'gumroad', 'rocket']

export function validateURL(url: string, siteType: string): URLValidation {
  if (!url) {
    return { isValid: false, error: 'Please enter a URL' }
  }

  let normalizedUrl = url.trim()
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl
  }

  try {
    const urlObj = new URL(normalizedUrl)
    
    if (siteType === 'general') {
      return {
        isValid: true,
        warning: 'This will attempt to extract content from any website. Some sites do not allow this and it may not work as expected.'
      }
    }

    const hostname = urlObj.hostname.toLowerCase()
    const fullUrl = urlObj.href.toLowerCase()

    const patterns = sitePatterns[siteType as keyof typeof sitePatterns]
    if (!patterns) {
      return { isValid: true }
    }

    const isMatch = patterns.some(pattern => 
      pattern.test(hostname) || pattern.test(fullUrl)
    )

    let warning = undefined
    if (testingSiteTypes.includes(siteType)) {
      return {
        isValid: false,
        warning: 'This feature is in testing phase and might not work correctly',
      }
    }

    if (!isMatch) {
      return {
        isValid: false,
        error: `URL does not match ${siteType} platform format`,
        warning
      }
    }

    return {
      isValid: true,
      warning
    }

  } catch (error) {
    return { isValid: false, error: 'Please enter a valid URL' }
  }
}
