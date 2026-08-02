/**
 * Suite de tests Vitest — Page Météo Agricole (AgroTrack BF)
 * Couvre : rendu, KPI météo, onglets, prévisions 7j, conseils cultures, alertes, interactions
 */
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import MeteoPage from '../app/(dashboard)/meteo/page'
import { toast } from 'sonner'

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Mock recharts : évite les erreurs ResizeObserver / canvas en jsdom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Line: () => null,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  Toaster: () => null,
}))

// ─── Lifecycle ────────────────────────────────────────────────────────────────

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Sélecteur sûr pour l'onglet "Alertes" — /^Alertes/ exclut "Configurer alertes"
const getAlerteTabBtn = () =>
  screen.getByRole('button', { name: /^Alertes/ })

// ─── 1. Rendu de base ─────────────────────────────────────────────────────────

describe('MeteoPage — rendu de base', () => {
  it('1. rend la page sans erreur', () => {
    render(<MeteoPage />)
  })

  it('2. affiche le titre principal "Météo Agricole"', () => {
    render(<MeteoPage />)
    expect(screen.getByText('Météo Agricole')).toBeInTheDocument()
  })

  it('3. affiche le sous-titre descriptif', () => {
    render(<MeteoPage />)
    expect(
      screen.getByText('Prévisions et alertes pour vos parcelles')
    ).toBeInTheDocument()
  })

  it('4. affiche la localisation "Région Hauts-Bassins"', () => {
    render(<MeteoPage />)
    expect(screen.getByText(/Région Hauts-Bassins/)).toBeInTheDocument()
  })

  it('5. affiche le bouton "Configurer alertes"', () => {
    render(<MeteoPage />)
    expect(
      screen.getByRole('button', { name: /Configurer alertes/i })
    ).toBeInTheDocument()
  })
})

// ─── 2. KPI météo du jour ─────────────────────────────────────────────────────

describe('MeteoPage — KPI météo du jour (Lun 28, Ensoleillé)', () => {
  beforeEach(() => render(<MeteoPage />))

  it('6. affiche la température maximale du jour (34°C)', () => {
    expect(screen.getByText('34°C')).toBeInTheDocument()
  })

  it('7. affiche la température minimale et la condition (Min 22°C)', () => {
    expect(screen.getByText(/Min 22°C/)).toBeInTheDocument()
  })

  it('8. affiche la condition météo "Ensoleillé" dans la page', () => {
    // "Ensoleillé" est un nœud texte dans "Min 22°C · Ensoleillé" (nœuds multiples).
    // On vérifie via textContent du container pour contourner la limitation RTL.
    const { container } = render(<MeteoPage />)
    expect(container.textContent).toContain('Ensoleillé')
  })

  it('9. affiche le label "Humidité"', () => {
    expect(screen.getByText('Humidité')).toBeInTheDocument()
  })

  it('10. affiche la valeur humidité 58%', () => {
    expect(screen.getByText('58%')).toBeInTheDocument()
  })

  it('11. affiche le label "Vent" et la valeur 12 km/h', () => {
    expect(screen.getByText('Vent')).toBeInTheDocument()
    expect(screen.getByText('12 km/h')).toBeInTheDocument()
  })

  it('12. affiche le label "Pluie" et la valeur 0 mm', () => {
    expect(screen.getByText('Pluie')).toBeInTheDocument()
    expect(screen.getByText('0 mm')).toBeInTheDocument()
  })
})

// ─── 3. Navigation par onglets ────────────────────────────────────────────────

describe('MeteoPage — navigation par onglets', () => {
  it('13. affiche les 3 onglets de navigation', () => {
    render(<MeteoPage />)
    expect(
      screen.getByRole('button', { name: /^Prévisions 7j/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^Historique 30j/i })
    ).toBeInTheDocument()
    expect(getAlerteTabBtn()).toBeInTheDocument()
  })

  it('14. le badge de l\'onglet Alertes affiche le nombre d\'alertes critiques (1)', () => {
    render(<MeteoPage />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('15. cliquer sur "Historique 30j" affiche les graphiques historiques', () => {
    render(<MeteoPage />)
    fireEvent.click(screen.getByRole('button', { name: /^Historique 30j/i }))
    expect(screen.getByText('Précipitations 30 jours (mm)')).toBeInTheDocument()
    expect(screen.getByText('Températures max 30 jours (°C)')).toBeInTheDocument()
  })

  it('16. l\'onglet Historique monte les conteneurs recharts', () => {
    render(<MeteoPage />)
    fireEvent.click(screen.getByRole('button', { name: /^Historique 30j/i }))
    expect(screen.getAllByTestId('responsive-container').length).toBeGreaterThanOrEqual(2)
  })

  it('17. cliquer sur l\'onglet "Alertes" affiche les alertes météo', () => {
    render(<MeteoPage />)
    fireEvent.click(getAlerteTabBtn())
    expect(screen.getByText('Inondation')).toBeInTheDocument()
    expect(screen.getByText('Chaleur')).toBeInTheDocument()
    // "Vent" apparaît aussi dans le label KPI → utiliser getAllByText
    expect(screen.getAllByText('Vent').length).toBeGreaterThan(0)
  })

  it('18. les alertes affichent les niveaux de sévérité corrects', () => {
    render(<MeteoPage />)
    fireEvent.click(getAlerteTabBtn())
    expect(screen.getByText('Critique')).toBeInTheDocument()
    expect(screen.getAllByText('Élevée').length).toBeGreaterThan(0)
    expect(screen.getByText('Modérée')).toBeInTheDocument()
  })
})

// ─── 4. Prévisions 7j (onglet par défaut) ────────────────────────────────────

describe('MeteoPage — prévisions 7 jours (onglet par défaut)', () => {
  beforeEach(() => render(<MeteoPage />))

  it('19. affiche les 7 jours de prévisions (Lun 28 à Dim 03)', () => {
    expect(screen.getByText('Lun 28')).toBeInTheDocument()
    expect(screen.getByText('Mar 29')).toBeInTheDocument()
    expect(screen.getByText('Mer 30')).toBeInTheDocument()
    expect(screen.getByText('Jeu 31')).toBeInTheDocument()
    expect(screen.getByText('Ven 01')).toBeInTheDocument()
    expect(screen.getByText('Sam 02')).toBeInTheDocument()
    expect(screen.getByText('Dim 03')).toBeInTheDocument()
  })

  it('20. affiche les températures max dans les cartes de prévision', () => {
    // Les conditions météo sont rendues en icône SVG, pas en texte.
    // On vérifie les tMax distinctifs des cartes de prévision.
    expect(screen.getByText('37°')).toBeInTheDocument()  // Mer 30
    expect(screen.getByText('32°')).toBeInTheDocument()  // Jeu 31
    expect(screen.getByText('30°')).toBeInTheDocument()  // Ven 01
  })

  it('21. affiche les valeurs de pluie pour les jours pluvieux', () => {
    expect(screen.getByText('18.5mm')).toBeInTheDocument()
    expect(screen.getByText('28.1mm')).toBeInTheDocument()
    expect(screen.getByText('4.2mm')).toBeInTheDocument()
    expect(screen.getByText('6.3mm')).toBeInTheDocument()
  })

  it('22. affiche la section "Conseils par culture"', () => {
    expect(screen.getByText('Conseils par culture')).toBeInTheDocument()
  })

  it('23. affiche toutes les cultures dans les conseils', () => {
    expect(screen.getAllByText('Maïs').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Coton').length).toBeGreaterThan(0)
    expect(screen.getByText('Sorgho')).toBeInTheDocument()
    expect(screen.getByText('Sésame')).toBeInTheDocument()
    expect(screen.getByText('Mil')).toBeInTheDocument()
  })

  it('24. affiche les niveaux d\'urgence (Haute, Normale, Basse)', () => {
    expect(screen.getAllByText('Haute').length).toBeGreaterThanOrEqual(2)
    expect(screen.getAllByText('Normale').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Basse')).toBeInTheDocument()
  })

  it('25. affiche les actions recommandées par culture', () => {
    expect(screen.getByText('Creuser canaux')).toBeInTheDocument()
    expect(screen.getByText('Irriguer matin')).toBeInTheDocument()
    expect(screen.getByText('Attendre pluies')).toBeInTheDocument()
  })
})

// ─── 5. Onglet Alertes (contenu détaillé) ────────────────────────────────────

describe('MeteoPage — onglet Alertes (contenu détaillé)', () => {
  beforeEach(() => {
    render(<MeteoPage />)
    fireEvent.click(getAlerteTabBtn())
  })

  it('26. l\'alerte Inondation affiche les cultures Riz et Maïs', () => {
    expect(screen.getByText('Riz')).toBeInTheDocument()
    expect(screen.getByText('Maïs')).toBeInTheDocument()
  })

  it('27. les alertes affichent la date "31 juil 2026" (deux alertes partagent cette date)', () => {
    // A001 (Inondation) et A003 (Vent) ont tous deux la date '31 juil 2026'
    expect(screen.getAllByText('31 juil 2026').length).toBe(2)
  })

  it('28. l\'alerte critique affiche le bon message de risque', () => {
    expect(
      screen.getByText(/Risque de crue dans les bas-fonds/)
    ).toBeInTheDocument()
  })

  it('29. l\'alerte Chaleur affiche les cultures Coton et Sésame', () => {
    expect(screen.getByText('Coton')).toBeInTheDocument()
    expect(screen.getByText('Sésame')).toBeInTheDocument()
  })

  it('30. l\'alerte Vent affiche les cultures Mil et Sorgho', () => {
    expect(screen.getByText('Mil')).toBeInTheDocument()
    expect(screen.getByText('Sorgho')).toBeInTheDocument()
  })
})

// ─── 6. Interactions ──────────────────────────────────────────────────────────

describe('MeteoPage — interactions', () => {
  it('31. cliquer sur "Configurer alertes" déclenche toast.success', () => {
    render(<MeteoPage />)
    fireEvent.click(
      screen.getByRole('button', { name: /Configurer alertes/i })
    )
    expect(toast.success).toHaveBeenCalledWith('Alerte météo configurée')
    expect(toast.success).toHaveBeenCalledTimes(1)
  })

  it('32. revenir sur "Prévisions 7j" après Historique réaffiche les prévisions', () => {
    render(<MeteoPage />)
    fireEvent.click(screen.getByRole('button', { name: /^Historique 30j/i }))
    expect(screen.queryByText('Lun 28')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^Prévisions 7j/i }))
    expect(screen.getByText('Lun 28')).toBeInTheDocument()
  })

  it('33. passer de Alertes à Prévisions masque les alertes et montre les prévisions', () => {
    render(<MeteoPage />)
    fireEvent.click(getAlerteTabBtn())
    expect(screen.getByText('Inondation')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^Prévisions 7j/i }))
    expect(screen.queryByText('Inondation')).not.toBeInTheDocument()
    expect(screen.getByText('Lun 28')).toBeInTheDocument()
  })
})
