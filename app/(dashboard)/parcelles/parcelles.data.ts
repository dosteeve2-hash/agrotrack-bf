// app/(dashboard)/parcelles/parcelles.data.ts

export type Culture = 'Mil' | 'Sorgho' | 'Maïs' | 'Coton'
export type Statut  = 'En culture' | 'Jachère' | 'Disponible'

export interface Parcelle {
  id: string
  numero: string
  membre: string
  surface: number
  culture: Culture
  village: string
  statut: Statut
  derniereRecolte: string
  gps: string
}

export interface FormState {
  membre: string
  surface: string
  culture: Culture
  region: string
  gps: string
}

export const PARCELLES_INIT: Parcelle[] = [
  { id: 'P001', numero: 'PRC-001', membre: 'Ouédraogo Adama',    surface: 3.2, culture: 'Coton',  village: 'Koudougou',       statut: 'En culture',  derniereRecolte: '2025-11-20', gps: '12.3647° N, 2.3634° O' },
  { id: 'P002', numero: 'PRC-002', membre: 'Sawadogo Fatima',    surface: 1.8, culture: 'Sorgho', village: 'Réo',             statut: 'En culture',  derniereRecolte: '2025-10-15', gps: '12.3200° N, 2.4600° O' },
  { id: 'P003', numero: 'PRC-003', membre: 'Kaboré Ibrahim',     surface: 4.5, culture: 'Coton',  village: 'Didyr',           statut: 'En culture',  derniereRecolte: '2025-11-30', gps: '12.0100° N, 2.5800° O' },
  { id: 'P004', numero: 'PRC-004', membre: 'Zongo Marie',        surface: 2.1, culture: 'Mil',    village: 'Koudougou',       statut: 'Jachère',     derniereRecolte: '2024-11-05', gps: '12.3700° N, 2.3600° O' },
  { id: 'P005', numero: 'PRC-005', membre: 'Traoré Seydou',      surface: 6.0, culture: 'Maïs',  village: 'Bobo-Dioulasso',  statut: 'En culture',  derniereRecolte: '2025-12-10', gps: '11.1770° N, 4.2970° O' },
  { id: 'P006', numero: 'PRC-006', membre: 'Diallo Aminata',     surface: 2.8, culture: 'Coton',  village: 'Banfora',         statut: 'En culture',  derniereRecolte: '2025-11-25', gps: '10.6300° N, 4.7680° O' },
  { id: 'P007', numero: 'PRC-007', membre: 'Compaoré Jean',      surface: 5.3, culture: 'Sorgho', village: 'Dédougou',        statut: 'Disponible',  derniereRecolte: '2025-10-28', gps: '12.4610° N, 3.4600° O' },
  { id: 'P008', numero: 'PRC-008', membre: 'Yago Sylvie',        surface: 1.5, culture: 'Mil',    village: 'Bobo-Dioulasso',  statut: 'Jachère',     derniereRecolte: '2024-10-20', gps: '11.1900° N, 4.3000° O' },
  { id: 'P009', numero: 'PRC-009', membre: 'Sawadogo Moussa',    surface: 3.8, culture: 'Mil',    village: 'Ouahigouya',      statut: 'En culture',  derniereRecolte: '2025-11-15', gps: '13.5800° N, 2.4200° O' },
  { id: 'P010', numero: 'PRC-010', membre: 'Tapsoba Alimata',    surface: 2.4, culture: 'Coton',  village: 'Dédougou',        statut: 'Disponible',  derniereRecolte: '2025-10-05', gps: '12.4700° N, 3.4700° O' },
  { id: 'P011', numero: 'PRC-011', membre: 'Ouédraogo Rasmané',  surface: 4.1, culture: 'Sorgho', village: 'Koudougou',       statut: 'En culture',  derniereRecolte: '2025-11-18', gps: '12.3600° N, 2.3700° O' },
  { id: 'P012', numero: 'PRC-012', membre: 'Koné Mariam',        surface: 0.9, culture: 'Maïs',  village: 'Banfora',         statut: 'En culture',  derniereRecolte: '2025-12-01', gps: '10.6250° N, 4.7700° O' },
]

export const VILLAGES = ['Tous', 'Koudougou', 'Réo', 'Didyr', 'Bobo-Dioulasso', 'Banfora', 'Dédougou', 'Ouahigouya'] as const
export const CULTURES: (Culture | 'Toutes')[] = ['Toutes', 'Mil', 'Sorgho', 'Maïs', 'Coton']
export const STATUTS:  (Statut  | 'Tous')[]   = ['Tous', 'En culture', 'Jachère', 'Disponible']

export const REGIONS_BF = [
  'Boucle du Mouhoun (Dédougou)',
  'Cascades (Banfora)',
  'Centre (Ouagadougou)',
  'Centre-Est (Tenkodogo)',
  'Centre-Nord (Kaya)',
  'Centre-Ouest (Koudougou)',
  'Centre-Sud (Manga)',
  "Est (Fada N'Gourma)",
  'Hauts-Bassins (Bobo-Dioulasso)',
  'Nord (Ouahigouya)',
  'Plateau-Central (Ziniaré)',
  'Sahel (Dori)',
  'Sud-Ouest (Gaoua)',
]

export const MEMBRES_LIST = [
  'Ouédraogo Adama', 'Sawadogo Fatima', 'Kaboré Ibrahim', 'Zongo Marie',
  'Traoré Seydou', 'Diallo Aminata', 'Compaoré Jean', 'Yago Sylvie',
  'Sawadogo Moussa', 'Tapsoba Alimata', 'Ouédraogo Rasmané', 'Koné Mariam',
]

export const STATUT_STYLES: Record<Statut, { bg: string; color: string }> = {
  'En culture': { bg: '#dcfce7', color: '#15803d' },
  'Jachère':    { bg: '#fef3c7', color: '#92400e' },
  'Disponible': { bg: '#f1f5f9', color: '#475569' },
}

export const CULTURE_COLORS: Record<Culture, string> = {
  Coton:  '#00BCD4',
  Sorgho: '#ef4444',
  Maïs:   '#f59e0b',
  Mil:    '#8b5cf6',
}

export const DEFAULT_FORM: FormState = {
  membre:  MEMBRES_LIST[0],
  surface: '',
  culture: 'Coton',
  region:  REGIONS_BF[0],
  gps:     '',
}
