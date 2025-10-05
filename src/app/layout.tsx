import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SiteScraper - Professional Website Extraction',
  description: 'Extract complete websites from Framer, Webflow, WordPress, and more. Clean, organized files with perfect navigation.',
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
        </head>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
