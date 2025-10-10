import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://webunpack.com'),
  title: {
    default: 'WebUnpack - Export No-Code Websites to React Components | HTML Extraction Tool',
    template: '%s | WebUnpack'
  },
  description: 'Convert Framer, Webflow, Wix, WordPress, Shopify, and other no-code websites into clean HTML and React components. Export HTML, CSS, and assets with WebUnpack\'s powerful extraction tool. Trusted by 1000+ developers.',
  keywords: [

  'no-code export',
  'no-code website export',
  'export no-code website',
  'download no-code website',
  'no-code to code converter',
  'no-code to React',
  'HTML to React converter',

  'Framer export',
  'Framer website export',
  'Framer to React',
  'Framer to HTML',
  'download Framer website',
  'Webflow export',
  'Webflow to React',
  'Webflow HTML export',
  'download Webflow site',
  'Wix export',
  'Wix website download',
  'Wix to HTML',
  'WordPress scraper',
  'WordPress site export',
  'Shopify export',
  'Shopify theme export',
  'Squarespace export',
  'Notion website export',

  'website scraper tool',
  'website extraction tool',
  'website cloner',
  'download website HTML CSS',
  'extract website code',
  'website to React components',
  'React components generator',
  'website code extractor',
  'HTML CSS assets download',

  'remove Framer watermark',
  'remove Webflow badge',
  'export website without watermark',
  'migrate from no-code platform',
  'leave Framer',
  'leave Webflow',
  'no-code platform migration',

  'convert website to React',
  'website to component converter',
  'automated React conversion',
  'web scraping tool developers',
  'developer website export',
  'code extraction API',

  'no-code export alternative',
  'nocodexport alternative',
  'best no-code export tool',
  'Framer export tool',
  'website export service',

  'client website export',
  'freelance website export',
  'agency website tool',
  'batch website export',
  'multi-page website export',

  'no-code website scraper 2025',
  'React component extraction',
  'website HTML downloader',
  'complete website download tool',
  'website backup tool',
  'static site generator from live site'
],

  authors: [{ name: 'WebUnpack' }],
  creator: 'WebUnpack',
  publisher: 'WebUnpack Inc',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://webunpack.com',
    siteName: 'WebUnpack',
    title: 'WebUnpack - Export No-Code Websites to React Components',
    description: 'Convert Framer, Webflow, Wix, and other no-code websites into clean React components. Export HTML, CSS, and assets instantly. Trusted by 1000+ developers.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WebUnpack - No-Code to React Conversion Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebUnpack - Export No-Code Websites to React Components',
    description: 'Convert Framer, Webflow, Wix, and other no-code websites into clean React components instantly.',
    images: ['/twitter-image.jpg'],
    creator: '@webunpack',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://webunpack.com',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: 'rgb(252, 138, 125)',
          colorBackground: 'rgb(15, 16, 18)',
          colorInputBackground: 'rgb(22, 24, 32)',
          colorInputText: 'rgb(240, 236, 230)',
          colorText: 'rgb(240, 236, 230)',
          colorTextSecondary: 'rgb(121, 131, 140)',
        },
        elements: {
          card: {
            backgroundColor: 'rgb(15, 16, 18)',
            border: '1px solid rgb(55, 65, 81)',
          },
          headerTitle: {
            fontFamily: '"Funnel Display", sans-serif',
          },
          socialButtonsBlockButton: {
            backgroundColor: 'rgb(22, 24, 32)',
            border: '1px solid rgb(55, 65, 81)',
            color: 'rgb(240, 236, 230)',
          },
          formFieldInput: {
            backgroundColor: 'rgb(22, 24, 32)',
            border: '1px solid rgb(55, 65, 81)',
            color: 'rgb(240, 236, 230)',
          },
          footerActionLink: {
            color: 'rgb(252, 138, 125)',
          },
        }
      }}
    >
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link 
            href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap" 
            rel="stylesheet" 
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'SoftwareApplication',
                name: 'WebUnpack',
                applicationCategory: 'DeveloperApplication',
                operatingSystem: 'Web Browser',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.8',
                  ratingCount: '1000',
                },
                description: 'Convert Framer, Webflow, Wix, and other no-code websites into clean React components. Export HTML, CSS, and assets instantly.',
                url: 'https://webunpack.com',
                creator: {
                  '@type': 'Organization',
                  name: 'WebUnpack Inc',
                  url: 'https://webunpack.com',
                },
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'WebUnpack',
                url: 'https://webunpack.com',
                logo: 'https://webunpack.com/logo.png',
                sameAs: [
                  'https://twitter.com/webunpack',
                  'https://github.com/webunpack',
                ],
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'Customer Support',
                  url: 'https://webunpack.com/contact',
                },
              }),
            }}
          />
        </head>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
