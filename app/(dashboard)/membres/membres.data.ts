// app/(dashboard)/membres/membres.data.ts

export type Culture = 'Mil' | 'Sorgho' | 'Maïs' | 'Coton' | 'Sésame' | 'Karité'
export type Statut  = 'Actif' | 'Inactif'

export interface Membre {
  id: string
  nom: string
  telephone: string
  village: string
  culture: Culture
  surface: number
  statut: Statut
  dateAdhesion: string
}

export interface FormState {
  nom: string
  telephone: string
  village: string
  culture: Culture
  surface: string
}

export const MEMBRES_INIT: Membre[] = [
  { id: 'M001', nom: 'Ouédraogo Adama',   telephone: '+226 70 11 22 33', village: 'Koudougou',      culture: 'Coton',  surface: 3.2, statut: 'Actif',   dateAdhesion: '2023-03-15' },
  { id: 'M002', nom: 'Sawadogo Fatima',   telephone: '+226 76 44 55 66', village: 'Réo',            culture: 'Sésame', surface: 1.8, statut: 'Actif',   dateAdhesion: '2023-05-20' },
  { id: 'M003', nom: 'Kaboré Ibrahim',    telephone: '+226 65 77 88 99', village: 'Didyr',          culture: 'Coton',  surface: 4.5, statut: 'Actif',   dateAdhesion: '2022-11-08' },
  { id: 'M004', nom: 'Zongo Marie',       telephone: '+226 71 22 33 44', village: 'Koudougou',      culture: 'Karité', surface: 2.1, statut: 'Inactif', dateAdhesion: '2022-09-01' },
  { id: 'M005', nom: 'Traoré Seydou',     telephone: '+226 78 99 00 11', village: 'Bobo-Dioulasso', culture: 'Maïs',   surface: 6.0, statut: 'Actif',   dateAdhesion: '2021-06-14' },
  { id: 'M006', nom: 'Diallo Aminata',    telephone: '+226 72 33 44 55', village: 'Banfora',        culture: 'Coton',  surface: 2.8, statut: 'Actif',   dateAdhesion: '2023-01-10' },
  { id: 'M007', nom: 'Compaoré Jean',     telephone: '+226 66 55 44 33', village: 'Dédougou',       culture: 'Sorgho', surface: 5.3, statut: 'Actif',   dateAdhesion: '2022-07-22' },
  { id: 'M008', nom: 'Yago Sylvie',       telephone: '+226 75 88 99 00', village: 'Bobo-Dioulasso', culture: 'Mil',    surface: 1.5, statut: 'Actif',   dateAdhesion: '2024-02-05' },
  { id: 'M009', nom: 'Sawadogo Moussa',   telephone: '+226 70 77 66 55', village: 'Ouahigouya',     culture: 'Mil',    surface: 3.8, statut: 'Actif',   dateAdhesion: '2022-04-18' },
  { id: 'M010', nom: 'Tapsoba Alimata',   telephone: '+226 71 44 33 22', village: 'Dédougou',       culture: 'Coton',  surface: 2.4, statut: 'Inactif', dateAdhesion: '2021-12-01' },
  { id: 'M011', nom: 'Ouédraogo Rasmané', telephone: '+226 78 11 22 33', village: 'Koudougou',      culture: 'Sorgho', surface: 4.1, statut: 'Actif',   dateAdhesion: '2023-08-30' },
  { id: 'M012', nom: 'Koné Mariam',       telephone: '+226 76 55 66 77', village: 'Banfora',        culture: 'Sésame', surface: 0.9, statut: 'Actif',   dateAdhesion: '2024-01-15' },
]

export const VILLAGES = ['Tous', 'Koudougou', 'Réo', 'Didyr', 'Bobo-Dioulasso', 'Banfora', 'Dédougou', 'Ouahigouya'] as const
export const CULTURES: (Culture | 'Toutes')[] = ['Toutes', 'Mil', 'Sorgho', 'Maïs', 'Coton', 'Sésame', 'Karité']
export const STATUTS:  (Statut | 'Tous')[]    = ['Tous', 'Actif', 'Inactif']

export const CULTURE_COLORS: Record<Culture, string> = {
  Coton:  '#00BCD4',
  Sésame: '#D4AF37',
  Karité: '#10b981',
  Maïs:   '#f59e0b',
  Mil:    '#8b5cf6',
  Sorgho: '#ef4444',
}

export const AVATAR_COLORS = ['#00BCD4', '#D4AF37', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#0A1628']

export const DEFAULT_FORM: FormState = {
  nom: '', telephone: '', village: 'Koudougou', culture: 'Coton', surface: '',
}

export function initiales(nom: string): string {
  return nom.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}
