import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgroTrack BF — Gestion coopératives agricoles',
  description: 'PWA offline-first pour coopératives agricoles du Burkina Faso',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
