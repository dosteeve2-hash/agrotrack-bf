'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Package,
  Warehouse,
  CreditCard,
  BarChart3,
  Leaf,
} from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/membres', label: 'Membres', icon: Users },
  { href: '/collectes', label: 'Collectes', icon: Package },
  { href: '/stocks', label: 'Stocks', icon: Warehouse },
  { href: '/paiements', label: 'Paiements', icon: CreditCard },
  { href: '/rapports', label: 'Rapports', icon: BarChart3 },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0A1628' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-white/10 shrink-0" style={{ backgroundColor: '#060e1a' }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(212,175,55,0.2)' }}>
            <Leaf size={20} style={{ color: '#D4AF37' }} />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight" style={{ color: '#D4AF37' }}>AgroTrack BF</div>
            <div className="text-xs text-white/40">Coopératives agricoles</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: active ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color: active ? '#D4AF37' : 'rgba(255,255,255,0.6)',
                }}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-white/30">FORGE Afrika Ecosystem</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
