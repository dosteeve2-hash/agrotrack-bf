/**
 * Suite de tests Vitest — Page Parcelles (AgroTrack BF)
 * Couvre : rendu, titre, KPIs×4, noms parcelles mock, cultures, statuts,
 *          barre de recherche, filtre statut, modal détail, bouton Nouvelle parcelle
 */
import React from 'react'
import { render, screen, fireEvent, cleanup, within, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { ParcellesVue } from '../app/(dashboard)/parcelles/ParcellesVue'
import type { ParcelleVue } from '../lib/data/parcelles.model'

// ─── Fixture ──────────────────────────────────────────────────────────────────
//
// Ces dix parcelles vivaient en dur dans la page, sous le nom `MOCK`. La page
// lit desormais la base ; elles deviennent la fixture du test. Memes valeurs,
// memes totaux, memes assertions — c'est le comportement de l'ecran qui est
// verifie, plus la constante qui l'alimentait.

const MEMBRES = [
  { id: 'm1', nom: 'Ouédraogo Adama', village: 'Koubri' },
  { id: 'm2', nom: 'Sawadogo Fatima', village: 'Saponé' },
]

const p = (
  id: string, nom: string, village: string, culture: ParcelleVue['culture'],
  superficie: number, statut: ParcelleVue['statut'], rendementEstime: number,
  irrigation: boolean, notes: string,
): ParcelleVue => ({
  id, nom, membreNom: 'Ouédraogo Adama', village, culture, superficie,
  typeSol: 'lateritique', statut, datePlantation: '2026-05-15',
  dateRecolteEstimee: '2026-09-10', rendementEstime, irrigation, notes,
})

const PARCELLES: ParcelleVue[] = [
  p('P01', 'Parcelle Koubri A',      'Koubri',      'mais',     2.5, 'active',         1800, true,  'Sol bien drainé, bonne humidité résiduelle.'),
  p('P02', 'Parcelle Saponé B',      'Saponé',      'sorgho',   1.8, 'active',         1200, false, 'Culture pluviale, bon peuplement.'),
  p('P03', 'Parcelle Kombissiri C',  'Kombissiri',  'coton',    3.2, 'active',          900, false, 'Traitement phytosanitaire semaine 28.'),
  p('P04', 'Parcelle Manga D',       'Manga',       'mil',      1.5, 'en_preparation',  800, false, 'Labour motorisé en cours.'),
  p('P05', 'Parcelle Pô E',          'Pô',          'sesame',   2.0, 'active',          700, false, 'Zone semi-aride, pluviométrie suivie.'),
  p('P06', 'Parcelle Tenkodogo F',   'Tenkodogo',   'niebe',    4.0, 'active',          600, true,  'Irrigation goutte-à-goutte fonctionnelle.'),
  p('P07', 'Parcelle Léo G',         'Léo',         'arachide', 2.8, 'active',         1100, false, 'Variété améliorée INERA, bon suivi.'),
  p('P08', 'Parcelle Koubri H',      'Koubri',      'sorgho',   1.2, 'recoltee',       1300, false, 'Saison sèche productive, stock constitué.'),
  p('P09', 'Parcelle Saponé I',      'Saponé',      'mais',     3.5, 'en_repos',       1600, true,  'Jachère courte, préparation prochaine saison.'),
  p('P10', 'Parcelle Manga J',       'Manga',       'mil',      2.2, 'en_preparation',  750, false, 'Épandage fumure organique planifié.'),
]

type Creation = (donnees: FormData) => Promise<{ ok: boolean; message?: string }>
const creerParcelle = vi.hoisted(() => vi.fn<Creation>(async () => ({ ok: true })))
vi.mock('../app/(dashboard)/parcelles/actions', () => ({ creerParcelle }))

function afficher() {
  return render(<ParcellesVue parcelles={PARCELLES} membres={MEMBRES} />)
}

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
    afficher()
  })

  it('2. affiche le titre "Parcelles agricoles"', () => {
    afficher()
    expect(screen.getByText('Parcelles agricoles')).toBeInTheDocument()
  })

  it('3. affiche le sous-titre avec 10 parcelles', () => {
    afficher()
    expect(screen.getByText(/10 parcelles/)).toBeInTheDocument()
  })

  it('4. affiche "Saison 2026" dans le sous-titre', () => {
    afficher()
    expect(screen.getByText(/Saison 2026/)).toBeInTheDocument()
  })
})

// ─── 2. KPIs ──────────────────────────────────────────────────────────────────

describe('ParcellesPage — KPIs', () => {
  it('5. affiche le label "Surface totale"', () => {
    afficher()
    expect(screen.getByText('Surface totale')).toBeInTheDocument()
  })

  it('6. affiche la surface totale "24.7 ha"', () => {
    afficher()
    expect(screen.getByText('24.7 ha')).toBeInTheDocument()
  })

  it('7. affiche le label "Parcelles actives"', () => {
    afficher()
    expect(screen.getByText('Parcelles actives')).toBeInTheDocument()
  })

  it('8. affiche 6 parcelles actives', () => {
    afficher()
    // The value "6" appears as text in the KPI card
    const elements = screen.getAllByText('6')
    expect(elements.length).toBeGreaterThan(0)
  })

  it('9. affiche le label "Rendement moyen"', () => {
    afficher()
    expect(screen.getByText('Rendement moyen')).toBeInTheDocument()
  })

  it('10. affiche le rendement moyen "1 075 kg/ha"', () => {
    afficher()
    expect(screen.getByText(/1.075 kg\/ha|1 075 kg\/ha/)).toBeInTheDocument()
  })

  it('11. affiche le label "Récoltes prévues"', () => {
    afficher()
    expect(screen.getByText('Récoltes prévues')).toBeInTheDocument()
  })

  it('12. affiche 8 récoltes prévues', () => {
    afficher()
    const elements = screen.getAllByText('8')
    expect(elements.length).toBeGreaterThan(0)
  })
})

// ─── 3. Noms des parcelles mock ───────────────────────────────────────────────

describe('ParcellesPage — noms parcelles mock', () => {
  it('13. affiche "Parcelle Koubri A"', () => {
    afficher()
    expect(screen.getAllByText('Parcelle Koubri A').length).toBeGreaterThan(0)
  })

  it('14. affiche "Parcelle Saponé B"', () => {
    afficher()
    expect(screen.getByText('Parcelle Saponé B')).toBeInTheDocument()
  })

  it('15. affiche "Parcelle Kombissiri C"', () => {
    afficher()
    expect(screen.getByText('Parcelle Kombissiri C')).toBeInTheDocument()
  })

  it('16. affiche "Parcelle Manga D"', () => {
    afficher()
    expect(screen.getByText('Parcelle Manga D')).toBeInTheDocument()
  })

  it('17. affiche "Parcelle Tenkodogo F"', () => {
    afficher()
    expect(screen.getByText('Parcelle Tenkodogo F')).toBeInTheDocument()
  })

  it('18. affiche "Parcelle Léo G"', () => {
    afficher()
    expect(screen.getByText('Parcelle Léo G')).toBeInTheDocument()
  })
})

// ─── 4. Cultures et statuts ───────────────────────────────────────────────────

describe('ParcellesPage — cultures et statuts', () => {
  it('19. affiche au moins une culture "Maïs"', () => {
    afficher()
    const els = screen.getAllByText('Maïs')
    expect(els.length).toBeGreaterThan(0)
  })

  it('20. affiche au moins une culture "Sorgho"', () => {
    afficher()
    const els = screen.getAllByText('Sorgho')
    expect(els.length).toBeGreaterThan(0)
  })

  it('21. affiche le statut "Active" dans les cartes', () => {
    afficher()
    const actives = screen.getAllByText('Active')
    expect(actives.length).toBeGreaterThan(0)
  })

  it('22. affiche le statut "Récoltée"', () => {
    afficher()
    const els = screen.getAllByText('Récoltée')
    expect(els.length).toBeGreaterThan(0)
  })
})

// ─── 5. Recherche et filtres ──────────────────────────────────────────────────

describe('ParcellesPage — recherche et filtres', () => {
  it('23. affiche la barre de recherche avec le bon placeholder', () => {
    afficher()
    expect(screen.getByPlaceholderText(/Rechercher parcelle, village, culture/)).toBeInTheDocument()
  })

  it('24. filtre par terme de recherche "Koubri"', () => {
    afficher()
    const input = screen.getByPlaceholderText(/Rechercher parcelle, village, culture/)
    fireEvent.change(input, { target: { value: 'Koubri' } })
    // After filter: Parcelle Koubri A (P01) and Parcelle Koubri H (P08) match village Koubri
    expect(screen.getByText('Parcelle Koubri A')).toBeInTheDocument()
    expect(screen.queryByText('Parcelle Kombissiri C')).not.toBeInTheDocument()
  })

  it('25. filtre par terme "Saponé" affiche les parcelles correspondantes', () => {
    afficher()
    const input = screen.getByPlaceholderText(/Rechercher parcelle, village, culture/)
    fireEvent.change(input, { target: { value: 'Saponé' } })
    expect(screen.getByText('Parcelle Saponé B')).toBeInTheDocument()
  })

  it('26. les boutons de filtre statut sont présents ("Tous", "Active", "En repos", "En préparation", "Récoltée")', () => {
    afficher()
    expect(screen.getByRole('button', { name: 'Tous' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'En repos' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'En préparation' })).toBeInTheDocument()
  })

  it('27. cliquer sur "En repos" filtre les parcelles — seule Parcelle Saponé I visible', () => {
    afficher()
    fireEvent.click(screen.getByRole('button', { name: 'En repos' }))
    expect(screen.getByText('Parcelle Saponé I')).toBeInTheDocument()
    expect(screen.queryByText('Parcelle Koubri A')).not.toBeInTheDocument()
  })

  it('28. cliquer sur "Récoltée" affiche uniquement Parcelle Koubri H', () => {
    afficher()
    fireEvent.click(screen.getByRole('button', { name: 'Récoltée' }))
    expect(screen.getByText('Parcelle Koubri H')).toBeInTheDocument()
    expect(screen.queryByText('Parcelle Koubri A')).not.toBeInTheDocument()
  })

  it('29. cliquer sur "Tous" après un filtre réaffiche toutes les parcelles', () => {
    afficher()
    fireEvent.click(screen.getByRole('button', { name: 'En repos' }))
    fireEvent.click(screen.getByRole('button', { name: 'Tous' }))
    expect(screen.getByText('Parcelle Koubri A')).toBeInTheDocument()
    expect(screen.getByText('Parcelle Saponé I')).toBeInTheDocument()
  })
})

// ─── 6. Modal détail ──────────────────────────────────────────────────────────

describe('ParcellesPage — modal détail', () => {
  it('30. cliquer sur une carte ouvre la modal avec le nom de la parcelle', () => {
    afficher()
    fireEvent.click(screen.getAllByText('Parcelle Koubri A')[0])
    // Modal shows the parcelle name as h2
    const h2s = screen.getAllByText('Parcelle Koubri A')
    expect(h2s.length).toBeGreaterThan(1)
  })

  it('31. la modal affiche "Village"', () => {
    afficher()
    fireEvent.click(screen.getAllByText('Parcelle Koubri A')[0])
    expect(screen.getByText('Village')).toBeInTheDocument()
  })

  it('31b. la modal nomme le producteur à qui la parcelle appartient', () => {
    afficher()
    fireEvent.click(screen.getAllByText('Parcelle Koubri A')[0])
    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText('Producteur')).toBeInTheDocument()
    expect(within(modal).getAllByText('Ouédraogo Adama').length).toBeGreaterThan(0)
  })

  it('32. la modal affiche "Superficie"', () => {
    afficher()
    fireEvent.click(screen.getAllByText('Parcelle Koubri A')[0])
    expect(within(screen.getByRole('dialog')).getByText('Superficie')).toBeInTheDocument()
  })

  it('33. la modal affiche "Rendement estimé" et "1800 kg/ha"', () => {
    afficher()
    fireEvent.click(screen.getAllByText('Parcelle Koubri A')[0])
    expect(within(screen.getByRole('dialog')).getByText('Rendement estimé')).toBeInTheDocument()
    expect(screen.getByText('1800 kg/ha')).toBeInTheDocument()
  })

  it('34. fermer la modal via le bouton ✕ la cache', () => {
    afficher()
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
    afficher()
    expect(screen.getByRole('button', { name: /Nouvelle parcelle/ })).toBeInTheDocument()
  })

  it('36. cliquer sur "Nouvelle parcelle" ouvre le formulaire', () => {
    afficher()
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    expect(screen.getByPlaceholderText('Parcelle Nord A')).toBeInTheDocument()
  })

  it('37. le formulaire contient les champs "Nom", "Superficie", "Producteur"', () => {
    afficher()
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    expect(screen.getByText('Nom *')).toBeInTheDocument()
    expect(screen.getByText('Superficie (ha) *')).toBeInTheDocument()
    expect(screen.getByText('Producteur *')).toBeInTheDocument()
  })

  it('38. le bouton "Créer la parcelle" est dans le formulaire', () => {
    afficher()
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    expect(screen.getByRole('button', { name: 'Créer la parcelle' })).toBeInTheDocument()
  })

  it('39. fermer le formulaire via "Annuler" le cache', () => {
    afficher()
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))
    expect(screen.queryByPlaceholderText('Parcelle Nord A')).not.toBeInTheDocument()
  })

  // La creation ne remplit plus un tableau en memoire : elle ecrit en base via
  // une Server Action. Ce qui se verifie ici, c'est donc ce qui part — et non
  // l'apparition immediate d'une ligne, qui n'a plus lieu d'etre.
  it('40. créer une parcelle envoie les valeurs saisies au serveur', async () => {
    afficher()
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    fireEvent.change(screen.getByPlaceholderText('Parcelle Nord A'), { target: { value: 'Parcelle Test Z' } })
    fireEvent.change(screen.getByPlaceholderText('2.5'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Créer la parcelle' }))

    await waitFor(() => expect(creerParcelle).toHaveBeenCalledTimes(1))
    const envoye = creerParcelle.mock.calls[0][0]
    expect(envoye.get('nom')).toBe('Parcelle Test Z')
    expect(envoye.get('superficie')).toBe('3')
    expect(envoye.get('membre_id')).toBe('m1')
  })

  it('41. le formulaire se ferme une fois la parcelle enregistrée', async () => {
    afficher()
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    fireEvent.change(screen.getByPlaceholderText('Parcelle Nord A'), { target: { value: 'Parcelle Test Z' } })
    fireEvent.change(screen.getByPlaceholderText('2.5'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Créer la parcelle' }))

    await waitFor(() =>
      expect(screen.queryByPlaceholderText('Parcelle Nord A')).not.toBeInTheDocument())
  })

  it('42. un refus du serveur laisse le formulaire ouvert et affiche la raison', async () => {
    creerParcelle.mockResolvedValueOnce({ ok: false, message: 'Superficie invalide.' })
    afficher()
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    fireEvent.change(screen.getByPlaceholderText('Parcelle Nord A'), { target: { value: 'Parcelle Test Z' } })
    fireEvent.change(screen.getByPlaceholderText('2.5'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Créer la parcelle' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Superficie invalide.')
    expect(screen.getByPlaceholderText('Parcelle Nord A')).toBeInTheDocument()
  })

  it('43. sans nom ni superficie, rien n’est envoyé', () => {
    afficher()
    fireEvent.click(screen.getByRole('button', { name: /Nouvelle parcelle/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Créer la parcelle' }))
    expect(creerParcelle).not.toHaveBeenCalled()
  })
})

// ─── 8. Cas limites ───────────────────────────────────────────────────────────

describe('ParcellesVue — coopérative sans parcelle', () => {
  it('44. n’affiche pas « NaN kg/ha » quand il n’y a aucune parcelle', () => {
    render(<ParcellesVue parcelles={[]} membres={MEMBRES} />)
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument()
    expect(screen.getByText('0 kg/ha')).toBeInTheDocument()
  })

  it('45. annonce zéro parcelle plutôt qu’une liste muette', () => {
    render(<ParcellesVue parcelles={[]} membres={MEMBRES} />)
    expect(screen.getByText(/0 parcelles/)).toBeInTheDocument()
  })
})
