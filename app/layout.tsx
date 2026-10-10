import type { Metadata } from 'next'
import './globals.css'
import ScrollToTop from '@/components/ScrollToTop'

export const metadata: Metadata = {
  title: 'AgroTrack — Suivi des récoltes et gestion agricole',
  description: 'PWA offline-first pour suivre ses récoltes, de la parcelle au paiement, dans la devise de son pays',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: '/android-chrome-192x192.png',
  },
  manifest: '/site.webmanifest',
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
