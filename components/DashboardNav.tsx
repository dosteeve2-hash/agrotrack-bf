'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Leaf, LayoutDashboard, Users, Package2, CreditCard, BarChart2, ShoppingBasket, LogOut, BookOpen, Settings, MapPin, Calendar, TrendingUp, Cloud, Sprout, Wrench, PieChart, Menu, X } from 'lucide-react'
import NavAlertBadge from '@/components/NavAlertBadge'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/membres', icon: Users, label: 'Membres' },
  { href: '/parcelles', icon: MapPin, label: 'Parcelles' },
  { href: '/cultures', icon: Leaf, label: 'Cultures' },
  { href: '/collectes', icon: ShoppingBasket, label: 'Collectes' },
  { href: '/intrants', icon: Sprout, label: 'Intrants' },
  { href: '/stocks', icon: Package2, label: 'Stocks' },
  { href: '/equipements', icon: Wrench, label: 'Equipements' },
  { href: '/paiements', icon: CreditCard, label: 'Paiements' },
  { href: '/calendrier', icon: Calendar, label: 'Calendrier' },
  { href: '/meteo', icon: Cloud, label: 'Météo' },
  { href: '/finances', icon: TrendingUp, label: 'Finances' },
  { href: '/statistiques', icon: PieChart, label: 'Statistiques' },
  { href: '/rapports', icon: BarChart2, label: 'Rapports' },
  { href: '/onboarding', icon: BookOpen, label: "Guide d'Acmo" },
  { href: '/parametres', icon: Settings, label: 'Paramètres' },
]

/**
 * Contenu de la barre latérale, identique sur mobile et sur ordinateur.
 * `onNavigate` ferme le tiroir après un clic — sur mobile le tiroir recouvre
 * la page, le laisser ouvert masquerait la page qu'on vient d'ouvrir.
 */
function NavContent({ userEmail, logoutAction, onNavigate }: {
  userEmail: string
  logoutAction: () => void | Promise<void>
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const actif = pathname === href
          return (
            <Link key={href} href={href} onClick={onNavigate}
              aria-current={actif ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                actif ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/8'
              }`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {href === '/dashboard' && <NavAlertBadge />}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <p className="text-xs text-white/30 px-3 mb-2 truncate">{userEmail}</p>
        <form action={logoutAction}>
          <button type="submit"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-white/50 hover:text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </form>
      </div>
    </>
  )
}

/**
 * Navigation du tableau de bord.
 *
 * Sur ordinateur (≥ 768 px) la barre latérale est fixe, comme avant.
 * En dessous, elle deviendrait une colonne de 240 px sur un écran de 360 px :
 * les deux tiers de la largeur pour le menu, un tiers pour l'application.
 * Elle passe donc en tiroir, ouvert par un bouton de la barre supérieure.
 * L'utilisateur cible n'a pas d'ordinateur (VISION.md §4, doctrine « mobile
 * d'abord ») — le tiroir est le cas normal, pas l'adaptation.
 */
export default function DashboardNav({ userEmail, logoutAction }: {
  userEmail: string
  logoutAction: () => void | Promise<void>
}) {
  const [ouvert, setOuvert] = useState(false)

  // Échap ferme le tiroir, et le corps ne défile pas derrière lui.
  useEffect(() => {
    if (!ouvert) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOuvert(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const overflowInitial = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflowInitial
    }
  }, [ouvert])

  return (
    <>
      {/* Barre supérieure — mobile seulement */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center gap-3 px-4 border-b border-white/10"
        style={{ background: '#0A1628' }}>
        <button type="button" onClick={() => setOuvert(true)}
          aria-label="Ouvrir le menu" aria-expanded={ouvert} aria-controls="menu-lateral"
          className="p-2 -ml-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
          <Menu className="w-5 h-5" />
        </button>
        <Leaf className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
        <span className="text-white font-bold text-base">AgroTrack BF</span>
      </header>

      {/* Voile — ferme le tiroir au toucher */}
      {ouvert && (
        <div onClick={() => setOuvert(false)} aria-hidden="true"
          className="md:hidden fixed inset-0 z-40 bg-black/50" />
      )}

      {/* Barre latérale : fixe sur ordinateur, tiroir sur mobile */}
      <aside id="menu-lateral"
        className={`w-60 flex-shrink-0 flex flex-col z-50 max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:transition-transform max-md:duration-200 ${
          ouvert ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
        }`}
        style={{ background: '#0A1628' }}>
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <Leaf className="w-6 h-6 flex-shrink-0" style={{ color: '#D4AF37' }} />
          <span className="text-white font-bold text-base">AgroTrack BF</span>
          <button type="button" onClick={() => setOuvert(false)} aria-label="Fermer le menu"
            className="md:hidden ml-auto p-2 -mr-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <NavContent userEmail={userEmail} logoutAction={logoutAction} onNavigate={() => setOuvert(false)} />
      </aside>
    </>
  )
}
