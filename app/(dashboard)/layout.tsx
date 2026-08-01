import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Leaf, LayoutDashboard, Users, Package2, CreditCard, BarChart2, ShoppingBasket, LogOut, BookOpen, Settings, MapPin, Calendar, TrendingUp, Cloud } from 'lucide-react'
import NavAlertBadge from '@/components/NavAlertBadge'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/membres', icon: Users, label: 'Membres' },
  { href: '/parcelles', icon: MapPin, label: 'Parcelles' },
  { href: '/collectes', icon: ShoppingBasket, label: 'Collectes' },
  { href: '/stocks', icon: Package2, label: 'Stocks' },
  { href: '/paiements', icon: CreditCard, label: 'Paiements' },
  { href: '/calendrier', icon: Calendar, label: 'Calendrier' },
  { href: '/meteo', icon: Cloud, label: 'Météo' },
  { href: '/finances', icon: TrendingUp, label: 'Finances' },
  { href: '/rapports', icon: BarChart2, label: 'Rapports' },
  { href: '/onboarding', icon: BookOpen, label: "Guide d'Acmo" },
  { href: '/parametres', icon: Settings, label: 'Paramètres' },
]

async function logoutAction() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f1f5f9' }}>
      <aside className="w-60 flex-shrink-0 flex flex-col" style={{ background: '#0A1628' }}>
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <Leaf className="w-6 h-6 flex-shrink-0" style={{ color: '#D4AF37' }} />
          <span className="text-white font-bold text-base">AgroTrack BF</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all">
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {href === '/dashboard' && <NavAlertBadge />}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <p className="text-xs text-white/30 px-3 mb-2 truncate">{user.email}</p>
          <form action={logoutAction}>
            <button type="submit"
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
