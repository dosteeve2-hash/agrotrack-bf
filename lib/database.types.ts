/**
 * Types de la base AgroTrack.
 *
 * Ecrits a la main, en miroir de `supabase/migrations/20260907120000_noyau.sql`.
 * `supabase gen types` les remplacera des qu'un projet Supabase existera ;
 * jusque-la, ce fichier est la seule source de verite cote TypeScript et doit
 * etre modifie en meme temps que la migration.
 */

export type Culture =
  | 'mil' | 'sorgho' | 'mais' | 'coton' | 'sesame' | 'karite' | 'arachide' | 'niebe'

export type StatutMembre = 'actif' | 'inactif'
export type TypeSol = 'lateritique' | 'argilo_sableux' | 'sablonneux' | 'limoneux'
export type StatutParcelle = 'active' | 'en_repos' | 'en_preparation' | 'recoltee'
export type StatutCollecte = 'en_attente' | 'validee' | 'rejetee'
export type MoyenPaiement = 'especes' | 'orange_money' | 'wave' | 'virement'
export type RoleUtilisateur = 'gerant' | 'agent'

export interface CooperativeRow {
  id: string
  nom: string
  sigle: string | null
  region: string | null
  province: string | null
  commune: string | null
  telephone: string | null
  /** ISO 3166-1 alpha-2 ; nul tant que le compte n'a pas choisi son pays. */
  pays_code: string | null
  /** ISO 4217 : une seule devise par compte, sans conversion. */
  devise_code: string | null
  latitude: string | null
  longitude: string | null
}

export interface ProfilRow {
  id: string
  cooperative_id: string | null
  nom_complet: string | null
  role: RoleUtilisateur
}

export interface MembreRow {
  id: string
  cooperative_id: string
  client_id: string
  nom: string
  telephone: string | null
  village: string
  statut: StatutMembre
  date_adhesion: string
}

export interface ParcelleRow {
  id: string
  cooperative_id: string
  membre_id: string
  client_id: string
  nom: string | null
  culture: Culture
  /** numeric(6,2) — Supabase renvoie les `numeric` en chaine pour ne rien perdre. */
  surface_ha: string
  type_sol: TypeSol | null
  statut: StatutParcelle
  date_plantation: string | null
  date_recolte_estimee: string | null
  /** Entier : une estimation de rendement au gramme pres n'existe pas. */
  rendement_estime_kg_ha: number | null
  irrigation: boolean
  notes: string | null
  latitude: string | null
  longitude: string | null
}

export interface CollecteRow {
  id: string
  cooperative_id: string
  membre_id: string
  parcelle_id: string | null
  client_id: string
  culture: Culture
  quantite_kg: string
  /** Entier. Colonne historique `_fcfa` ; la devise est celle de la coopérative. */
  prix_unitaire_fcfa: number
  date_collecte: string
  statut: StatutCollecte
  lot_ref: string | null
  note: string | null
  saisie_hors_ligne: boolean
}

export interface PaiementRow {
  id: string
  cooperative_id: string
  membre_id: string
  collecte_id: string | null
  client_id: string
  /** Entier, toujours. */
  montant_fcfa: number
  moyen: MoyenPaiement
  reference: string | null
  date_paiement: string
}

/** Libelles affiches. La base stocke des identifiants stables, pas du francais. */
export const LIBELLE_CULTURE: Record<Culture, string> = {
  mil: 'Mil',
  sorgho: 'Sorgho',
  mais: 'Maïs',
  coton: 'Coton',
  sesame: 'Sésame',
  karite: 'Karité',
  arachide: 'Arachide',
  niebe: 'Niébé',
}

export const LIBELLE_STATUT_MEMBRE: Record<StatutMembre, string> = {
  actif: 'Actif',
  inactif: 'Inactif',
}

export const LIBELLE_TYPE_SOL: Record<TypeSol, string> = {
  lateritique: 'Latéritique',
  argilo_sableux: 'Argilo-sableux',
  sablonneux: 'Sablonneux',
  limoneux: 'Limoneux',
}

export const LIBELLE_STATUT_PARCELLE: Record<StatutParcelle, string> = {
  active: 'Active',
  en_repos: 'En repos',
  en_preparation: 'En préparation',
  recoltee: 'Récoltée',
}
