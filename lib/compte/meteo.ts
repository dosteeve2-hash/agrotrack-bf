import type { ParametresCompte } from './parametres'

export const MESSAGE_METEO_A_VENIR = 'Météo locale : bientôt disponible (à venir)'

export interface Coordonnees {
  latitude: number
  longitude: number
}

/** Les coordonnées du compte, ou null tant qu'elles ne sont pas renseignées. */
export function coordonneesDuCompte(compte: ParametresCompte | null): Coordonnees | null {
  if (!compte || compte.latitude === null || compte.longitude === null) return null
  return { latitude: compte.latitude, longitude: compte.longitude }
}

/** Météo actuelle au point du compte. Le fuseau est déduit des coordonnées. */
export function urlMeteoActuelle({ latitude, longitude }: Coordonnees, variables: string): string {
  return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${variables}&timezone=auto`
}
