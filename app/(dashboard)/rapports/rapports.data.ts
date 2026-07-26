// app/(dashboard)/rapports/rapports.data.ts

export const fmt      = (n: number) => new Intl.NumberFormat('fr-FR').format(n)
export const fmtFCFA  = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

export interface ProductionPoint {
  mois: string; Mil: number; Sorgho: number; Maïs: number; Arachide: number; Sésame: number
}

export const PRODUCTION_6MOIS: ProductionPoint[] = [
  { mois: 'Fév',  Mil: 8.2,  Sorgho: 11.4, Maïs: 14.2, Arachide: 4.5,  Sésame: 1.8 },
  { mois: 'Mar',  Mil: 5.1,  Sorgho: 8.7,  Maïs: 9.8,  Arachide: 3.2,  Sésame: 1.2 },
  { mois: 'Avr',  Mil: 3.4,  Sorgho: 6.2,  Maïs: 12.1, Arachide: 6.8,  Sésame: 2.4 },
  { mois: 'Mai',  Mil: 10.8, Sorgho: 14.3, Maïs: 18.4, Arachide: 9.4,  Sésame: 3.6 },
  { mois: 'Juin', Mil: 12.1, Sorgho: 18.9, Maïs: 21.3, Arachide: 11.2, Sésame: 4.1 },
  { mois: 'Juil', Mil: 9.7,  Sorgho: 15.2, Maïs: 16.8, Arachide: 8.6,  Sésame: 3.3 },
]

export interface CultureRow {
  culture: string; parcelles: number; surface: number; production: number; prixMoyenKg: number; revenus: number
}

export const CULTURES_TABLE: CultureRow[] = [
  { culture: 'Sorgho',   parcelles: 3, surface: 11.6, production: 15200, prixMoyenKg: 120, revenus: 1824000 },
  { culture: 'Maïs',     parcelles: 2, surface: 6.9,  production: 16800, prixMoyenKg: 145, revenus: 2436000 },
  { culture: 'Arachide', parcelles: 4, surface: 9.8,  production: 11200, prixMoyenKg: 350, revenus: 3920000 },
  { culture: 'Mil',      parcelles: 2, surface: 5.3,  production: 9700,  prixMoyenKg: 110, revenus: 1067000 },
  { culture: 'Sésame',   parcelles: 2, surface: 4.1,  production: 3600,  prixMoyenKg: 650, revenus: 2340000 },
]

export interface Incident {
  id: string
  type: 'Météo' | 'Maladie' | 'Ravageur'
  description: string
  parcelles: number
  date: string
  gravite: 'Faible' | 'Modérée' | 'Élevée'
}

export const INCIDENTS_MOCK: Incident[] = [
  { id: 'I1', type: 'Météo',    description: 'Déficit pluviométrique — zone Nord Koudougou', parcelles: 3, date: '2026-07-05', gravite: 'Modérée' },
  { id: 'I2', type: 'Maladie',  description: 'Mildiou détecté sur parcelles maïs (PRC-005)', parcelles: 1, date: '2026-07-10', gravite: 'Élevée'  },
  { id: 'I3', type: 'Ravageur', description: 'Criquet pèlerin signalé — secteur Réo',        parcelles: 2, date: '2026-07-14', gravite: 'Élevée'  },
  { id: 'I4', type: 'Météo',    description: 'Vent violent — légers dégâts cultures arachide', parcelles: 2, date: '2026-07-16', gravite: 'Faible' },
]

export const KPI_DATA: Record<string, { membresActifs: number; recoltesTonnes: number; revenusTotal: number; incidents: number }> = {
  '2026-07': { membresActifs: 127, recoltesTonnes: 70.2, revenusTotal: 13164500, incidents: 4 },
  '2026-06': { membresActifs: 124, recoltesTonnes: 85.5, revenusTotal: 22680000, incidents: 2 },
  '2026-05': { membresActifs: 118, recoltesTonnes: 82.4, revenusTotal: 21660000, incidents: 1 },
  '2026-04': { membresActifs: 115, recoltesTonnes: 41.6, revenusTotal: 9820000,  incidents: 3 },
}

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

export const BAR_COLORS: Record<string, string> = {
  Mil: '#8b5cf6', Sorgho: '#ef4444', Maïs: '#f59e0b', Arachide: '#22d98a', Sésame: '#c07d10',
}

export const CULTURE_TABLE_COLORS: Record<string, string> = {
  Sorgho: '#ef4444', Maïs: '#f59e0b', Arachide: '#22d98a', Mil: '#8b5cf6', Sésame: '#c07d10',
}

export const MOIS_OPTIONS = [
  { value: '01', label: 'Janvier' },   { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },      { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },       { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' },   { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' }, { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },  { value: '12', label: 'Décembre' },
]
