/**
 * Suite de tests Vitest — Navigation du tableau de bord (AgroTrack)
 * Couvre : les 16 liens, le lien actif, la bascule du tiroir mobile,
 *          la fermeture (croix, voile, Échap, clic sur un lien),
 *          le verrou de défilement et le formulaire de déconnexion.
 */
import React from 'react'
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import DashboardNav from '../components/DashboardNav'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPathname = vi.hoisted(() => ({ value: '/dashboard' }))

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname.value,
}))

// jsdom ne sait pas naviguer : on neutralise le clic, sans perdre le onClick
// que le composant attache pour refermer le tiroir.
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, ...props }: React.ComponentProps<'a'>) => (
    <a href={href} onClick={(e) => { e.preventDefault(); onClick?.(e) }} {...props}>{children}</a>
  ),
}))

// NavAlertBadge appelle une API météo distante : hors sujet ici.
vi.mock('@/components/NavAlertBadge', () => ({ default: () => null }))

vi.mock('lucide-react', () => {
  const icon = (nom: string) => {
    const C = () => <svg data-testid={`icon-${nom}`} />
    C.displayName = `Icon${nom}`
    return C
  }
  return {
    Leaf: icon('leaf'), LayoutDashboard: icon('dashboard'), Users: icon('users'),
    Package2: icon('package'), CreditCard: icon('credit-card'), BarChart2: icon('bar-chart'),
    ShoppingBasket: icon('basket'), LogOut: icon('logout'), BookOpen: icon('book'),
    Settings: icon('settings'), MapPin: icon('map-pin'), Calendar: icon('calendar'),
    TrendingUp: icon('trending-up'), Cloud: icon('cloud'), Sprout: icon('sprout'),
    Wrench: icon('wrench'), PieChart: icon('pie-chart'), Menu: icon('menu'), X: icon('x'),
  }
})

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const logout = vi.fn()

function afficher(pathname = '/dashboard') {
  mockPathname.value = pathname
  return render(<DashboardNav userEmail="gerant@exemple.org" logoutAction={logout} />)
}

const tiroir = () => document.getElementById('menu-lateral') as HTMLElement
const boutonOuvrir = () => screen.getByLabelText('Ouvrir le menu')

afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
  vi.clearAllMocks()
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('DashboardNav — contenu', () => {
  it('affiche les 16 entrées de navigation', () => {
    afficher()
    expect(within(tiroir()).getAllByRole('link')).toHaveLength(16)
  })

  it('affiche l’adresse de l’utilisateur connecté', () => {
    afficher()
    expect(screen.getByText('gerant@exemple.org')).toBeInTheDocument()
  })

  it('propose la déconnexion dans un formulaire', () => {
    afficher()
    const bouton = screen.getByRole('button', { name: /Déconnexion/ })
    expect(bouton).toHaveAttribute('type', 'submit')
    expect(bouton.closest('form')).not.toBeNull()
  })
})

describe('DashboardNav — lien actif', () => {
  it('marque la page courante avec aria-current', () => {
    afficher('/membres')
    const actifs = within(tiroir()).getAllByRole('link').filter(l => l.getAttribute('aria-current') === 'page')
    expect(actifs).toHaveLength(1)
    expect(actifs[0]).toHaveTextContent('Membres')
  })

  it('ne marque aucun lien sur une route inconnue', () => {
    afficher('/route-inexistante')
    const actifs = within(tiroir()).getAllByRole('link').filter(l => l.getAttribute('aria-current') === 'page')
    expect(actifs).toHaveLength(0)
  })
})

describe('DashboardNav — tiroir mobile', () => {
  it('est fermé au premier rendu', () => {
    afficher()
    expect(tiroir().className).toContain('max-md:-translate-x-full')
    expect(boutonOuvrir()).toHaveAttribute('aria-expanded', 'false')
  })

  it('s’ouvre au clic sur le bouton menu', () => {
    afficher()
    fireEvent.click(boutonOuvrir())
    expect(tiroir().className).toContain('max-md:translate-x-0')
    expect(boutonOuvrir()).toHaveAttribute('aria-expanded', 'true')
  })

  it('se ferme au clic sur la croix', () => {
    afficher()
    fireEvent.click(boutonOuvrir())
    fireEvent.click(screen.getByLabelText('Fermer le menu'))
    expect(tiroir().className).toContain('max-md:-translate-x-full')
  })

  it('se ferme au clic sur le voile', () => {
    const { container } = afficher()
    fireEvent.click(boutonOuvrir())
    const voile = container.querySelector('[aria-hidden="true"]')
    expect(voile).not.toBeNull()
    fireEvent.click(voile!)
    expect(tiroir().className).toContain('max-md:-translate-x-full')
  })

  it('se ferme avec la touche Échap', () => {
    afficher()
    fireEvent.click(boutonOuvrir())
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(tiroir().className).toContain('max-md:-translate-x-full')
  })

  it('se ferme quand on choisit une destination', () => {
    afficher()
    fireEvent.click(boutonOuvrir())
    fireEvent.click(within(tiroir()).getByText('Collectes'))
    expect(tiroir().className).toContain('max-md:-translate-x-full')
  })

  it('bloque le défilement du corps tant qu’il est ouvert, et le rend ensuite', () => {
    afficher()
    expect(document.body.style.overflow).toBe('')
    fireEvent.click(boutonOuvrir())
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.body.style.overflow).toBe('')
  })

  it('n’affiche le voile que lorsqu’il est ouvert', () => {
    const { container } = afficher()
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
    fireEvent.click(boutonOuvrir())
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
  })
})
