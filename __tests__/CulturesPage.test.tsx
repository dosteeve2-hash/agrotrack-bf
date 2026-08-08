/**
 * Suite de tests Vitest — Page Cultures (AgroTrack BF)
 * Couvre : rendu, titre, KPIs×4, noms cycles/cultures mock exacts,
 *          phases, recherche, filtre, modal détail cycle, bouton Nouveau cycle
 */
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import CulturesPage from '../app/(dashboard)/cultures/page'

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => null,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => null,
  PieChart: ({ children }: any) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ComposedChart: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('lucide-react', () => ({
  Leaf:        () => <svg data-testid="icon-leaf" />,
  TrendingUp:  () => <svg data-testid="icon-trending-up" />,
  CheckCircle: () => <svg data-testid="icon-check-circle" />,
  Clock:       () => <svg data-testid="icon-clock" />,
  Search:      () => <svg data-testid="icon-search" />,
  Plus:        () => <svg data-testid="icon-plus" />,
}))

// ─── Lifecycle ────────────────────────────────────────────────────────────────

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// ─── 1. Rendu de base ─────────────────────────────────────────────────────────

describe('CulturesPage — rendu de base', () => {
  it('1. rend la page sans erreur', () => {
    render(<CulturesPage />)
  })

  it('2. affiche le titre "Cycles culturaux"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Cycles culturaux')).toBeInTheDocument()
  })

  it('3. affiche le sous-titre avec 8 cycles', () => {
    render(<CulturesPage />)
    expect(screen.getByText(/8 cycles/)).toBeInTheDocument()
  })

  it('4. affiche "Saison 2026" dans le sous-titre', () => {
    render(<CulturesPage />)
    expect(screen.getByText(/Saison 2026/)).toBeInTheDocument()
  })
})

// ─── 2. KPIs ──────────────────────────────────────────────────────────────────

describe('CulturesPage — KPIs', () => {
  it('5. affiche le label "Cycles actifs"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Cycles actifs')).toBeInTheDocument()
  })

  it('6. affiche 7 cycles actifs', () => {
    render(<CulturesPage />)
    const els = screen.getAllByText('7')
    expect(els.length).toBeGreaterThan(0)
  })

  it('7. affiche le label "Superficie totale"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Superficie totale')).toBeInTheDocument()
  })

  it('8. affiche la superficie totale "19.0 ha"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('19.0 ha')).toBeInTheDocument()
  })

  it('9. affiche le label "Cultures distinctes"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Cultures distinctes')).toBeInTheDocument()
  })

  it('10. affiche 7 cultures distinctes', () => {
    render(<CulturesPage />)
    // "7" appears for both "Cycles actifs" and "Cultures distinctes"
    const els = screen.getAllByText('7')
    expect(els.length).toBeGreaterThanOrEqual(2)
  })

  it('11. affiche le label "Cycles terminés"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Cycles terminés')).toBeInTheDocument()
  })

  it('12. affiche 1 cycle terminé', () => {
    render(<CulturesPage />)
    const els = screen.getAllByText('1')
    expect(els.length).toBeGreaterThan(0)
  })
})

// ─── 3. Cycles et cultures mock ───────────────────────────────────────────────

describe('CulturesPage — données mock cycles/cultures', () => {
  it('13. affiche l\'ID "CC01"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('CC01')).toBeInTheDocument()
  })

  it('14. affiche "CC08" (cycle terminé — Sorgho Koubri H)', () => {
    render(<CulturesPage />)
    expect(screen.getByText('CC08')).toBeInTheDocument()
  })

  it('15. affiche la parcelle "Parcelle Koubri A"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Parcelle Koubri A')).toBeInTheDocument()
  })

  it('16. affiche la parcelle "Parcelle Saponé B"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Parcelle Saponé B')).toBeInTheDocument()
  })

  it('17. affiche la parcelle "Parcelle Kombissiri C"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Parcelle Kombissiri C')).toBeInTheDocument()
  })

  it('18. affiche la culture "Maïs" dans la table', () => {
    render(<CulturesPage />)
    const els = screen.getAllByText('Maïs')
    expect(els.length).toBeGreaterThan(0)
  })

  it('19. affiche la culture "Niébé" dans la table', () => {
    render(<CulturesPage />)
    const els = screen.getAllByText('Niébé')
    expect(els.length).toBeGreaterThan(0)
  })

  it('20. affiche la culture "Arachide" dans la table', () => {
    render(<CulturesPage />)
    const els = screen.getAllByText('Arachide')
    expect(els.length).toBeGreaterThan(0)
  })
})

// ─── 4. Phases ────────────────────────────────────────────────────────────────

describe('CulturesPage — phases', () => {
  it('21. affiche la phase "Floraison"', () => {
    render(<CulturesPage />)
    const els = screen.getAllByText('Floraison')
    expect(els.length).toBeGreaterThan(0)
  })

  it('22. affiche la phase "Croissance"', () => {
    render(<CulturesPage />)
    const els = screen.getAllByText('Croissance')
    expect(els.length).toBeGreaterThan(0)
  })

  it('23. affiche la phase "Semis"', () => {
    render(<CulturesPage />)
    const els = screen.getAllByText('Semis')
    expect(els.length).toBeGreaterThan(0)
  })

  it('24. affiche la phase "Maturation"', () => {
    render(<CulturesPage />)
    const els = screen.getAllByText('Maturation')
    expect(els.length).toBeGreaterThan(0)
  })

  it('25. affiche la phase "Récolte"', () => {
    render(<CulturesPage />)
    const els = screen.getAllByText('Récolte')
    expect(els.length).toBeGreaterThan(0)
  })

  it('26. affiche les 6 phases dans la timeline (via la table)', () => {
    render(<CulturesPage />)
    // All phase labels appear either in table badges or timeline
    const phases = ['Semis', 'Levée', 'Croissance', 'Floraison', 'Maturation', 'Récolte']
    for (const phase of phases) {
      expect(screen.getAllByText(phase).length).toBeGreaterThan(0)
    }
  })
})

// ─── 5. Recherche et filtres ──────────────────────────────────────────────────

describe('CulturesPage — recherche et filtres', () => {
  it('27. affiche la barre de recherche', () => {
    render(<CulturesPage />)
    expect(screen.getByPlaceholderText(/Rechercher cycle, parcelle/)).toBeInTheDocument()
  })

  it('28. filtrer par "Koubri" affiche les cycles de Koubri', () => {
    render(<CulturesPage />)
    const input = screen.getByPlaceholderText(/Rechercher cycle, parcelle/)
    fireEvent.change(input, { target: { value: 'Koubri' } })
    expect(screen.getByText('Parcelle Koubri A')).toBeInTheDocument()
    expect(screen.queryByText('Parcelle Saponé B')).not.toBeInTheDocument()
  })

  it('29. filtrer par "Sorgho" affiche uniquement les cycles Sorgho', () => {
    render(<CulturesPage />)
    const input = screen.getByPlaceholderText(/Rechercher cycle, parcelle/)
    fireEvent.change(input, { target: { value: 'Sorgho' } })
    const els = screen.getAllByText('Sorgho')
    expect(els.length).toBeGreaterThan(0)
    expect(screen.queryByText('Maïs')).not.toBeInTheDocument()
  })

  it('30. les boutons de filtre statut "En cours", "Terminée", "Abandonnée" sont présents', () => {
    render(<CulturesPage />)
    expect(screen.getByRole('button', { name: 'En cours' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Terminée' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abandonnée' })).toBeInTheDocument()
  })

  it('31. filtrer sur "Terminée" affiche uniquement CC08', () => {
    render(<CulturesPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Terminée' }))
    expect(screen.getByText('CC08')).toBeInTheDocument()
    expect(screen.queryByText('CC01')).not.toBeInTheDocument()
  })

  it('32. filtrer sur "Abandonnée" affiche une table vide', () => {
    render(<CulturesPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Abandonnée' }))
    expect(screen.queryByText('CC01')).not.toBeInTheDocument()
    expect(screen.queryByText('CC08')).not.toBeInTheDocument()
  })

  it('33. revenir à "Tous" après filtre réaffiche tous les cycles', () => {
    render(<CulturesPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Terminée' }))
    fireEvent.click(screen.getByRole('button', { name: 'Tous' }))
    expect(screen.getByText('CC01')).toBeInTheDocument()
    expect(screen.getByText('CC08')).toBeInTheDocument()
  })

  it('34. le select "Toutes cultures" est présent', () => {
    render(<CulturesPage />)
    expect(screen.getByDisplayValue('Toutes')).toBeInTheDocument()
  })
})

// ─── 6. Modal détail cycle ────────────────────────────────────────────────────

describe('CulturesPage — modal détail cycle', () => {
  it('35. cliquer sur la ligne CC01 ouvre la modal', () => {
    render(<CulturesPage />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    // Modal h2 contains "Maïs · Parcelle Koubri A"
    expect(screen.getByText(/Maïs · Parcelle Koubri A/)).toBeInTheDocument()
  })

  it('36. la modal affiche la phase actuelle "Floraison" pour CC01', () => {
    render(<CulturesPage />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    // "Phase: Floraison" badge appears in modal
    expect(screen.getByText(/Phase: Floraison/)).toBeInTheDocument()
  })

  it('37. la modal affiche "Superficie"', () => {
    render(<CulturesPage />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    expect(screen.getByText('Superficie')).toBeInTheDocument()
  })

  it('38. la modal affiche "Date de semis"', () => {
    render(<CulturesPage />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    expect(screen.getByText('Date de semis')).toBeInTheDocument()
  })

  it('39. la modal affiche "Progression du cycle"', () => {
    render(<CulturesPage />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    expect(screen.getByText('Progression du cycle')).toBeInTheDocument()
  })

  it('40. fermer la modal via ✕ la cache', () => {
    render(<CulturesPage />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    fireEvent.click(screen.getByRole('button', { name: '✕' }))
    expect(screen.queryByText(/Maïs · Parcelle Koubri A/)).not.toBeInTheDocument()
  })

  it('41. cliquer sur CC08 (Terminée) ouvre la modal avec le statut "Terminée"', () => {
    render(<CulturesPage />)
    const row = screen.getByText('CC08').closest('tr')!
    fireEvent.click(row)
    // Badge "Terminée" appears in modal
    const els = screen.getAllByText('Terminée')
    expect(els.length).toBeGreaterThan(1)
  })

  it('42. la modal CC08 affiche le rendement final "1350 kg/ha"', () => {
    render(<CulturesPage />)
    const row = screen.getByText('CC08').closest('tr')!
    fireEvent.click(row)
    expect(screen.getByText('1350 kg/ha')).toBeInTheDocument()
  })
})

// ─── 7. En-têtes de table ─────────────────────────────────────────────────────

describe('CulturesPage — en-têtes de table', () => {
  it('43. affiche l\'en-tête "ID"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('ID')).toBeInTheDocument()
  })

  it('44. affiche l\'en-tête "Culture"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Culture')).toBeInTheDocument()
  })

  it('45. affiche l\'en-tête "Parcelle"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Parcelle')).toBeInTheDocument()
  })

  it('46. affiche l\'en-tête "Phase"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Phase')).toBeInTheDocument()
  })

  it('47. affiche l\'en-tête "Statut"', () => {
    render(<CulturesPage />)
    expect(screen.getByText('Statut')).toBeInTheDocument()
  })
})
