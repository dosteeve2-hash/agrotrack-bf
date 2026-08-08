/**
 * Suite de tests Vitest — Page Parcelles (AgroTrack BF)
 * Couvre : rendu, titre, KPIs×4, noms parcelles mock, cultures, statuts,
 *          barre de recherche, filtre statut, modal détail, bouton Nouvelle parcelle
 */
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ParcellesPage from '../app/(dashboard)/parcelles/page'

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
  Map:        () => <svg data-testid="icon-map" />,
  Sprout:     () => <svg data-testid="icon-sprout" />,
  TrendingUp: () => <svg data-testid="icon-trending-up" />,
  Droplets:   () => <svg data-testid="icon-droplets" />,
  Plus:       () => <svg data-testid="icon-plus" />,
  Search:     () => <svg data-testid="icon-search" />,
}))

// ─── Lifecycle ────────────────────────────────────────────────────────────────

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// ─── 1. Rendu de base ─────────────────────────────────────────────────────────

describe('ParcellesPage — rendu de base', () => {
  it('1. rend la page sans erreur', () => {
    render(<ParcellesPage />)
  })

  it('2. affiche le titre "Parcelles agricoles"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText('Parcelles agricoles')).toBeInTheDocument()
  })

  it('3. affiche le sous-titre avec 10 parcelles', () => {
    render(<ParcellesPage />)
    expect(screen.getByText(/10 parcelles/)).toBeInTheDocument()
  })

  it('4. affiche "Saison 2026" dans le sous-titre', () => {
    render(<ParcellesPage />)
    expect(screen.getByText(/Saison 2026/)).toBeInTheDocument()
  })
})

// ─── 2. KPIs ──────────────────────────────────────────────────────────────────

describe('ParcellesPage — KPIs', () => {
  it('5. affiche le label "Surface totale"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText('Surface totale')).toBeInTheDocument()
  })

  it('6. affiche la surface totale "24.7 ha"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText('24.7 ha')).toBeInTheDocument()
  })

  it('7. affiche le label "Parcelles actives"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText('Parcelles actives')).toBeInTheDocument()
  })

  it('8. affiche 6 parcelles actives', () => {
    render(<ParcellesPage />)
    // The value "6" appears as text in the KPI card
    const elements = screen.getAllByText('6')
    expect(elements.length).toBeGreaterThan(0)
  })

  it('9. affiche le label "Rendement moyen"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText('Rendement moyen')).toBeInTheDocument()
  })

  it('10. affiche le rendement moyen "1 075 kg/ha"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText(/1.075 kg\/ha|1 075 kg\/ha/)).toBeInTheDocument()
  })

  it('11. affiche le label "Récoltes prévues"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText('Récoltes prévues')).toBeInTheDocument()
  })

  it('12. affiche 8 récoltes prévues', () => {
    render(<ParcellesPage />)
    const elements = screen.getAllByText('8')
    expect(elements.length).toBeGreaterThan(0)
  })
})

// ─── 3. Noms des parcelles mock ───────────────────────────────────────────────

describe('ParcellesPage — noms parcelles mock', () => {
  it('13. affiche "Parcelle Koubri A"', () => {
    render(<ParcellesPage />)
    expect(screen.getAllByText('Parcelle Koubri A').length).toBeGreaterThan(0)
  })

  it('14. affiche "Parcelle Saponé B"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText('Parcelle Saponé B')).toBeInTheDocument()
  })

  it('15. affiche "Parcelle Kombissiri C"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText('Parcelle Kombissiri C')).toBeInTheDocument()
  })

  it('16. affiche "Parcelle Manga D"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText('Parcelle Manga D')).toBeInTheDocument()
  })

  it('17. affiche "Parcelle Tenkodogo F"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText('Parcelle Tenkodogo F')).toBeInTheDocument()
  })

  it('18. affiche "Parcelle Léo G"', () => {
    render(<ParcellesPage />)
    expect(screen.getByText('Parcelle Léo G')).toBeInTheDocument()
  })
})

// ─── 4. Cultures et statuts ───────────────────────────────────────────────────

describe('ParcellesPage — cultures et statuts', () => {
  it('19. affiche au moins une culture "Maïs"', () => {
    render(<ParcellesPage />)
    const els = screen.getAllByText('Maïs')
    expect(els.length).toBeGreaterThan(0)
  })

  it('20. affiche au moins une culture "Sorgho"', () => {
    render(<ParcellesPage />)
    const els = screen.getAllByText('Sorgho')
    expect(els.length).toBeGreaterThan(0)
  })

  it('21. affiche le statut "Active" dans les cartes', () => {
    render(<ParcellesPage />)
    const actives = screen.getAllByText('Active')
    expect(actives.length).toBeGreaterThan(0)
  })

  it('22. affiche le statut "Récoltée"', () => {
    render(<ParcellesPage />)
    const els = screen.getAllByText('Récoltée')
    expect(els.length).toBeGreaterThan(0)
  })
})

// ─── 5. Recherche et filtres ──────────────────────────────────────────────────

describe('ParcellesPage — recherche et filtres', () => {
  it('23. affiche la barre de recherche avec le bon placeholder', () => {
    render(<ParcellesPage />)
    expect(screen.getByPlaceholderText(/Rechercher parcelle, village, culture/)).toBeInTheDocument()
  })

  it('24. filtre par terme de recherche "Koubri"', () => {
    render(<ParcellesPage />)
    const input = screen.getByPlaceholderText(/Rechercher parcelle, village, culture/)
    fireEvent.change(input, { target: { value: 'Koubri' } })
    // After filter: Parcelle Koubri A (P01) and Parcelle Koubri H (P08) match village Koubri
    expect(screen.getByText('Parcelle Koubri A')).toBeInTheDocument()
    expect(screen.queryByText('Parcelle Kombissiri C')).not.toBeInTheDocument()
  })

  it('25. filtre par terme "Saponé" affiche les parcelles correspondantes', () => {
    render(<ParcellesPage />)
    const input = screen.getByPlaceholderText(/Rechercher parcelle, village, culture/)
    fireEvent.change(input, { target: { value: 'Saponé' } })
    expect(screen.getByText('Parcelle Saponé B')).toBeInTheDocument()
  })

  it('26. les boutons de filtre statut sont présents ("Tous", "Active", "En repos", "En préparation", "Récoltée")', () => {
    render(<ParcellesPage />)
    expect(screen.getByRole('button', { name: 'Tous' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'En repos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'En préparation' })).toBeInTheDocument()
  })

  it('27. cliquer sur "En repos" filtre les parcelles — seule Parcelle Saponé I visible', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getByRole('button', { name: 'En repos' }))
    expect(screen.getByText('Parcelle Saponé I')).toBeInTheDocument()
    expect(screen.queryByText('Parcelle Koubri A')).not.toBeInTheDocument()
  })

  it('28. cliquer sur "Récoltée" affiche uniquement Parcelle Koubri H', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getByRole('button', { name: 'Récoltée' }))
    expect(screen.getByText('Parcelle Koubri H')).toBeInTheDocument()
    expect(screen.queryByText('Parcelle Koubri A')).not.toBeInTheDocument()
  })

  it('29. cliquer sur "Tous" après un filtre réaffiche toutes les parcelles', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getByRole('button', { name: 'En repos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Tous' }))
    expect(screen.getByText('Parcelle Koubri A')).toBeInTheDocument()
    expect(screen.getByText('Parcelle Saponé I')).toBeInTheDocument()
  })
})

// ─── 6. Modal détail ──────────────────────────────────────────────────────────

describe('ParcellesPage — modal détail', () => {
  it('30. cliquer sur une carte ouvre la modal avec le nom de la parcelle', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getAllByText('Parcelle Koubri A')[0])
    // Modal shows the parcelle name as h2
    const h2s = screen.getAllByText('Parcelle Koubri A')
    expect(h2s.length).toBeGreaterThan(1)
  })

  it('31. la modal affiche "Village"', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getAllByText('Parcelle Koubri A')[0])
    expect(screen.getByText('Village')).toBeInTheDocument()
  })

  it('32. la modal affiche "Superficie"', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getAllByText('Parcelle Koubri A')[0])
    expect(screen.getByText('Superficie')).toBeInTheDocument()
  })

  it('33. la modal affiche "Rendement estimé" et "1800 kg/ha"', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getAllByText('Parcelle Koubri A')[0])
    expect(screen.getByText('Rendement estimé')).toBeInTheDocument()
    expect(screen.getByText('1800 kg/ha')).toBeInTheDocument()
  })

  it('34. fermer la modal via le bouton ✕ la cache', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getAllByText('Parcelle Koubri A')[0])
    const closeBtn = screen.getByRole('button', { name: '✕' })
    fireEvent.click(closeBtn)
    // Modal title h2 should disappear — only card text remains
    const remaining = screen.getAllByText('Parcelle Koubri A')
    // After close, modal is gone so count should be same as initial (card only)
    expect(remaining.length).toBe(1)
  })
})

// ─── 7. Bouton Nouvelle parcelle ──────────────────────────────────────────────

describe('ParcellesPage — bouton Nouvelle parcelle', () => {
  it('35. le bouton "Nouvelle parcelle" est présent', () => {
    render(<ParcellesPage />)
    expect(screen.getByRole('button', { name: /Nouvelle parcelle/ })).toBeInTheDocument()
  })

  it('36. cliquer sur "Nouvelle parcelle" ouvre le formulaire', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    expect(screen.getByPlaceholderText('Parcelle Nord A')).toBeInTheDocument()
  })

  it('37. le formulaire contient les champs "Nom", "Superficie", "Village"', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    expect(screen.getByText('Nom *')).toBeInTheDocument()
    expect(screen.getByText('Superficie (ha) *')).toBeInTheDocument()
    expect(screen.getByText('Village')).toBeInTheDocument()
  })

  it('38. le bouton "Créer la parcelle" est dans le formulaire', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    expect(screen.getByRole('button', { name: 'Créer la parcelle' })).toBeInTheDocument()
  })

  it('39. fermer le formulaire via "Annuler" le cache', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))
    expect(screen.queryByPlaceholderText('Parcelle Nord A')).not.toBeInTheDocument()
  })

  it('40. créer une parcelle valide l\'ajoute à la liste', () => {
    render(<ParcellesPage />)
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    fireEvent.change(screen.getByPlaceholderText('Parcelle Nord A'), { target: { value: 'Parcelle Test Z' } })
    fireEvent.change(screen.getByPlaceholderText('2.5'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Créer la parcelle' }))
    expect(screen.getByText('Parcelle Test Z')).toBeInTheDocument()
  })
})
