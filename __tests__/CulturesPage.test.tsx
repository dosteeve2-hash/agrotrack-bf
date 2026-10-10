/**
 * Suite de tests Vitest — Page Cultures (AgroTrack)
 * Couvre : rendu, titre, KPIs×4, noms cycles/cultures mock exacts,
 *          phases, recherche, filtre, modal détail cycle, bouton Nouveau cycle
 */
import React from 'react'
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { CulturesVue, type CycleCulture } from '../app/(dashboard)/cultures/CulturesVue'
import CulturesPage from '../app/(dashboard)/cultures/page'

// ─── Fixture ──────────────────────────────────────────────────────────────────
//
// Ces huit cycles vivaient en dur dans la page, avec des noms de lieux réels. La page
// ne porte plus aucune donnée d'exemple (elle affiche un état vide) : la vue reçoit
// ses cycles en paramètre, et ce jeu neutre sert uniquement à tester son comportement.

const cy = (
  id: string, culture: string, parcelle: string, superficie: number,
  phaseActuelle: CycleCulture['phaseActuelle'], statut: CycleCulture['statut'] = 'En cours',
  extra: Partial<CycleCulture> = {},
): CycleCulture => ({
  id, culture, parcelle, superficie, dateSemis: '2026-05-15', dateRecolteEstimee: '2026-09-10',
  phaseActuelle, statut, notes: 'Note de test.', ...extra,
})

const CYCLES: CycleCulture[] = [
  cy('CC01', 'Maïs', 'Parcelle Nord A', 2.5, 'Floraison'),
  cy('CC02', 'Sorgho', 'Parcelle Est B', 1.8, 'Croissance'),
  cy('CC03', 'Coton', 'Parcelle Sud C', 3.2, 'Floraison'),
  cy('CC04', 'Mil', 'Parcelle Ouest D', 1.5, 'Semis'),
  cy('CC05', 'Sésame', 'Parcelle Centre E', 2.0, 'Maturation'),
  cy('CC06', 'Niébé', 'Parcelle Nord F', 4.0, 'Croissance'),
  cy('CC07', 'Arachide', 'Parcelle Est G', 2.8, 'Floraison'),
  cy('CC08', 'Sorgho', 'Parcelle Nord H', 1.2, 'Récolte', 'Terminée', { rendementFinal: 1350 }),
]

const CulturesPageFixture = () => <CulturesVue cycles={CYCLES} />

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  LineChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Line: () => null,
  PieChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ComposedChart: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
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

describe('CulturesPage — sans donnée', () => {
  it('0. la page affiche un état vide avec la première action, sans cycle inventé', () => {
    const { container } = render(<CulturesPage />)
    expect(screen.getByText('Cycles culturaux')).toBeInTheDocument()
    expect(screen.getByText(/Aucun cycle cultural/)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(container.textContent).not.toMatch(/CC0\d|Koubri|Burkina|Saison 2026/)
  })
})

describe('CulturesPage — rendu de base', () => {
  it('1. rend la page sans erreur', () => {
    render(<CulturesPageFixture />)
  })

  it('2. affiche le titre "Cycles culturaux"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Cycles culturaux')).toBeInTheDocument()
  })

  it('3. affiche le sous-titre avec 8 cycles', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText(/8 cycles/)).toBeInTheDocument()
  })

  it('4. n’impose aucune saison ni aucun lieu dans le sous-titre', () => {
    const { container } = render(<CulturesPageFixture />)
    expect(container.textContent).not.toMatch(/Saison 2026|Burkina|Koubri/)
  })
})

// ─── 2. KPIs ──────────────────────────────────────────────────────────────────

describe('CulturesPage — KPIs', () => {
  it('5. affiche le label "Cycles actifs"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Cycles actifs')).toBeInTheDocument()
  })

  it('6. affiche 7 cycles actifs', () => {
    render(<CulturesPageFixture />)
    const els = screen.getAllByText('7')
    expect(els.length).toBeGreaterThan(0)
  })

  it('7. affiche le label "Superficie totale"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Superficie totale')).toBeInTheDocument()
  })

  it('8. affiche la superficie totale "19.0 ha"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('19.0 ha')).toBeInTheDocument()
  })

  it('9. affiche le label "Cultures distinctes"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Cultures distinctes')).toBeInTheDocument()
  })

  it('10. affiche 7 cultures distinctes', () => {
    render(<CulturesPageFixture />)
    // "7" appears for both "Cycles actifs" and "Cultures distinctes"
    const els = screen.getAllByText('7')
    expect(els.length).toBeGreaterThanOrEqual(2)
  })

  it('11. affiche le label "Cycles terminés"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Cycles terminés')).toBeInTheDocument()
  })

  it('12. affiche 1 cycle terminé', () => {
    render(<CulturesPageFixture />)
    const els = screen.getAllByText('1')
    expect(els.length).toBeGreaterThan(0)
  })
})

// ─── 3. Cycles et cultures mock ───────────────────────────────────────────────

describe('CulturesPage — données mock cycles/cultures', () => {
  it('13. affiche l\'ID "CC01"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('CC01')).toBeInTheDocument()
  })

  it('14. affiche "CC08" (cycle terminé — Sorgho Nord H)', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('CC08')).toBeInTheDocument()
  })

  it('15. affiche la parcelle "Parcelle Nord A"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Parcelle Nord A')).toBeInTheDocument()
  })

  it('16. affiche la parcelle "Parcelle Est B"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Parcelle Est B')).toBeInTheDocument()
  })

  it('17. affiche la parcelle "Parcelle Sud C"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Parcelle Sud C')).toBeInTheDocument()
  })

  it('18. affiche la culture "Maïs" dans la table', () => {
    render(<CulturesPageFixture />)
    const els = screen.getAllByText('Maïs')
    expect(els.length).toBeGreaterThan(0)
  })

  it('19. affiche la culture "Niébé" dans la table', () => {
    render(<CulturesPageFixture />)
    const els = screen.getAllByText('Niébé')
    expect(els.length).toBeGreaterThan(0)
  })

  it('20. affiche la culture "Arachide" dans la table', () => {
    render(<CulturesPageFixture />)
    const els = screen.getAllByText('Arachide')
    expect(els.length).toBeGreaterThan(0)
  })
})

// ─── 4. Phases ────────────────────────────────────────────────────────────────

describe('CulturesPage — phases', () => {
  it('21. affiche la phase "Floraison"', () => {
    render(<CulturesPageFixture />)
    const els = screen.getAllByText('Floraison')
    expect(els.length).toBeGreaterThan(0)
  })

  it('22. affiche la phase "Croissance"', () => {
    render(<CulturesPageFixture />)
    const els = screen.getAllByText('Croissance')
    expect(els.length).toBeGreaterThan(0)
  })

  it('23. affiche la phase "Semis"', () => {
    render(<CulturesPageFixture />)
    const els = screen.getAllByText('Semis')
    expect(els.length).toBeGreaterThan(0)
  })

  it('24. affiche la phase "Maturation"', () => {
    render(<CulturesPageFixture />)
    const els = screen.getAllByText('Maturation')
    expect(els.length).toBeGreaterThan(0)
  })

  it('25. affiche la phase "Récolte"', () => {
    render(<CulturesPageFixture />)
    const els = screen.getAllByText('Récolte')
    expect(els.length).toBeGreaterThan(0)
  })

  it('26. affiche les 6 phases dans la timeline du modal', () => {
    render(<CulturesPageFixture />)
    fireEvent.click(screen.getByText('CC01').closest('tr')!)
    const modal = within(screen.getByRole('dialog'))
    const phases = ['Semis', 'Levée', 'Croissance', 'Floraison', 'Maturation', 'Récolte']
    for (const phase of phases) {
      expect(modal.getAllByText(phase).length).toBeGreaterThan(0)
    }
  })
})

// ─── 5. Recherche et filtres ──────────────────────────────────────────────────

describe('CulturesPage — recherche et filtres', () => {
  it('27. affiche la barre de recherche', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByPlaceholderText(/Rechercher cycle, parcelle/)).toBeInTheDocument()
  })

  it('28. filtrer par "Nord" affiche les cycles du Nord', () => {
    render(<CulturesPageFixture />)
    const input = screen.getByPlaceholderText(/Rechercher cycle, parcelle/)
    fireEvent.change(input, { target: { value: 'Nord' } })
    expect(screen.getByText('Parcelle Nord A')).toBeInTheDocument()
    expect(screen.queryByText('Parcelle Est B')).not.toBeInTheDocument()
  })

  it('29. filtrer par "Sorgho" affiche uniquement les cycles Sorgho', () => {
    render(<CulturesPageFixture />)
    const input = screen.getByPlaceholderText(/Rechercher cycle, parcelle/)
    fireEvent.change(input, { target: { value: 'Sorgho' } })
    const table = within(screen.getByRole('table'))
    expect(table.getAllByText('Sorgho').length).toBeGreaterThan(0)
    // « Maïs » subsiste comme option du select : le filtre ne vide que le tableau.
    expect(table.queryByText('Maïs')).not.toBeInTheDocument()
  })

  it('30. les boutons de filtre statut "En cours", "Terminée", "Abandonnée" sont présents', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByRole('button', { name: 'En cours' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Terminée' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abandonnée' })).toBeInTheDocument()
  })

  it('31. filtrer sur "Terminée" affiche uniquement CC08', () => {
    render(<CulturesPageFixture />)
    fireEvent.click(screen.getByRole('button', { name: 'Terminée' }))
    expect(screen.getByText('CC08')).toBeInTheDocument()
    expect(screen.queryByText('CC01')).not.toBeInTheDocument()
  })

  it('32. filtrer sur "Abandonnée" affiche une table vide', () => {
    render(<CulturesPageFixture />)
    fireEvent.click(screen.getByRole('button', { name: 'Abandonnée' }))
    expect(screen.queryByText('CC01')).not.toBeInTheDocument()
    expect(screen.queryByText('CC08')).not.toBeInTheDocument()
  })

  it('33. revenir à "Tous" après filtre réaffiche tous les cycles', () => {
    render(<CulturesPageFixture />)
    fireEvent.click(screen.getByRole('button', { name: 'Terminée' }))
    fireEvent.click(screen.getByRole('button', { name: 'Tous' }))
    expect(screen.getByText('CC01')).toBeInTheDocument()
    expect(screen.getByText('CC08')).toBeInTheDocument()
  })

  it('34. le select "Toutes cultures" est présent', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByDisplayValue('Toutes cultures')).toBeInTheDocument()
  })
})

// ─── 6. Modal détail cycle ────────────────────────────────────────────────────

describe('CulturesPage — modal détail cycle', () => {
  it('35. cliquer sur la ligne CC01 ouvre la modal', () => {
    render(<CulturesPageFixture />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    // Modal h2 contains "Maïs · Parcelle Nord A"
    expect(screen.getByText(/Maïs · Parcelle Nord A/)).toBeInTheDocument()
  })

  it('36. la modal affiche la phase actuelle "Floraison" pour CC01', () => {
    render(<CulturesPageFixture />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    // "Phase: Floraison" badge appears in modal
    expect(screen.getByText(/Phase: Floraison/)).toBeInTheDocument()
  })

  it('37. la modal affiche "Superficie"', () => {
    render(<CulturesPageFixture />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    expect(within(screen.getByRole('dialog')).getByText('Superficie')).toBeInTheDocument()
  })

  it('38. la modal affiche "Date de semis"', () => {
    render(<CulturesPageFixture />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    expect(screen.getByText('Date de semis')).toBeInTheDocument()
  })

  it('39. la modal affiche "Progression du cycle"', () => {
    render(<CulturesPageFixture />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    expect(screen.getByText('Progression du cycle')).toBeInTheDocument()
  })

  it('40. fermer la modal via ✕ la cache', () => {
    render(<CulturesPageFixture />)
    const row = screen.getByText('CC01').closest('tr')!
    fireEvent.click(row)
    fireEvent.click(screen.getByRole('button', { name: '✕' }))
    expect(screen.queryByText(/Maïs · Parcelle Nord A/)).not.toBeInTheDocument()
  })

  it('41. cliquer sur CC08 (Terminée) ouvre la modal avec le statut "Terminée"', () => {
    render(<CulturesPageFixture />)
    const row = screen.getByText('CC08').closest('tr')!
    fireEvent.click(row)
    // Badge "Terminée" appears in modal
    const els = screen.getAllByText('Terminée')
    expect(els.length).toBeGreaterThan(1)
  })

  it('42. la modal CC08 affiche le rendement final "1350 kg/ha"', () => {
    render(<CulturesPageFixture />)
    const row = screen.getByText('CC08').closest('tr')!
    fireEvent.click(row)
    expect(screen.getByText('1350 kg/ha')).toBeInTheDocument()
  })
})

// ─── 7. En-têtes de table ─────────────────────────────────────────────────────

describe('CulturesPage — en-têtes de table', () => {
  it('43. affiche l\'en-tête "ID"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('ID')).toBeInTheDocument()
  })

  it('44. affiche l\'en-tête "Culture"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Culture')).toBeInTheDocument()
  })

  it('45. affiche l\'en-tête "Parcelle"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Parcelle')).toBeInTheDocument()
  })

  it('46. affiche l\'en-tête "Phase"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Phase')).toBeInTheDocument()
  })

  it('47. affiche l\'en-tête "Statut"', () => {
    render(<CulturesPageFixture />)
    expect(screen.getByText('Statut')).toBeInTheDocument()
  })
})
