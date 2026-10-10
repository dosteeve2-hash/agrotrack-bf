/**
 * Paramètres du compte : pays, devise, coordonnées facultatives.
 *
 * Stockage local (localStorage), comme tous les modules de l'application qui ne
 * sont pas encore branchés à la base. Le schéma SQL correspondant existe déjà
 * (`supabase/migrations/20261010120000_pays_devise_cultures.sql`, colonnes de
 * `cooperatives`) mais n'est appliqué à aucune base : voir `supabase/README.md`.
 *
 * Une seule devise par compte, sans conversion.
 */

export interface ParametresCompte {
  paysCode: string
  deviseCode: string
  latitude: number | null
  longitude: number | null
}

export const CLE_STOCKAGE = 'agrotrack.compte.v1'
const EVENEMENT = 'agrotrack:compte'

export function coordonneesValides(lat: number | null, lon: number | null): boolean {
  if (lat === null && lon === null) return true
  if (lat === null || lon === null) return false
  return Number.isFinite(lat) && Number.isFinite(lon)
    && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
}

/** Lit un texte stocké ; renvoie null s'il est absent, illisible ou incohérent. */
export function analyserParametres(brut: string | null): ParametresCompte | null {
  if (!brut) return null
  try {
    const o: unknown = JSON.parse(brut)
    if (typeof o !== 'object' || o === null) return null
    const { paysCode, deviseCode, latitude, longitude } = o as Record<string, unknown>
    if (typeof paysCode !== 'string' || !/^[A-Z]{2}$/.test(paysCode)) return null
    if (typeof deviseCode !== 'string' || !/^[A-Z]{3}$/.test(deviseCode)) return null
    const lat = typeof latitude === 'number' ? latitude : null
    const lon = typeof longitude === 'number' ? longitude : null
    if (!coordonneesValides(lat, lon)) return null
    return { paysCode, deviseCode, latitude: lat, longitude: lon }
  } catch {
    return null
  }
}

export function lireBrut(): string | null {
  try {
    return window.localStorage.getItem(CLE_STOCKAGE)
  } catch {
    return null
  }
}

/** Renvoie false si le navigateur refuse l'écriture (mode privé, stockage plein). */
export function enregistrerParametres(p: ParametresCompte): boolean {
  if (!/^[A-Z]{2}$/.test(p.paysCode) || !/^[A-Z]{3}$/.test(p.deviseCode)) return false
  if (!coordonneesValides(p.latitude, p.longitude)) return false
  try {
    window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(p))
    window.dispatchEvent(new Event(EVENEMENT))
    return true
  } catch {
    return false
  }
}

export function abonner(rappel: () => void): () => void {
  window.addEventListener(EVENEMENT, rappel)
  window.addEventListener('storage', rappel)
  return () => {
    window.removeEventListener(EVENEMENT, rappel)
    window.removeEventListener('storage', rappel)
  }
}
