import type { Metadata, Viewport } from 'next'
import './globals.css'
import ScrollToTop from '@/components/ScrollToTop'

export const metadata: Metadata = {
  title: 'AgroTrack BF — Gestion coopératives agricoles',
  description: 'PWA offline-first pour coopératives agricoles du Burkina Faso',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: '/android-chrome-192x192.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#0A1628',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">
        {children}
        <ScrollToTop />
      </body>
    </html>
  )
}
