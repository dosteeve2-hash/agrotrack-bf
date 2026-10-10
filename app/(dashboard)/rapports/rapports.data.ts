// app/(dashboard)/rapports/rapports.data.ts
//
// Aucune donnée d'exemple : les rapports seront calculés à partir des collectes, des
// parcelles et des paiements quand ces modules seront raccordés à la base. Les montants
// se formatent avec `useFormatMontant` (devise du compte), jamais ici.

export const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

/** Une ligne par mois ; chaque autre clé est une culture (nom libre) -> tonnes. */
export type ProductionPoint = { mois: string } & Record<string, string | number>

export const PRODUCTION_6MOIS: ProductionPoint[] = []

export interface CultureRow {
  culture: string; parcelles: number; surface: number; production: number; prixMoyenKg: number; revenus: number
}

export const CULTURES_TABLE: CultureRow[] = []

export interface Incident {
  id: string
  type: 'Météo' | 'Maladie' | 'Ravageur'
  description: string
  parcelles: number
  date: string
  gravite: 'Faible' | 'Modérée' | 'Élevée'
}

export const INCIDENTS: Incident[] = []

export interface KpiMois {
  membresActifs: number; recoltesTonnes: number; revenusTotal: number; incidents: number
}

/** Clé « AAAA-MM ». Vide tant que les rapports ne sont pas raccordés aux données. */
export const KPI_DATA: Record<string, KpiMois> = {}

export const GRAVITE_STYLES: Record<Incident['gravite'], { bg: string; color: string }> = {
  Faible:  { bg: '#dcfce7', color: '#15803d' },
  Modérée: { bg: '#fef3c7', color: '#92400e' },
  Élevée:  { bg: '#fee2e2', color: '#991b1b' },
}

export const TYPE_COLORS: Record<Incident['type'], string> = {
  Météo:    '#00BCD4',
  Maladie:  '#ef4444',
  Ravageur: '#f59e0b',
}

export const MOIS_OPTIONS = [
  { value: '01', label: 'Janvier' },   { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },      { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },       { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },   { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' }, { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },  { value: '12', label: 'Décembre' },
]
