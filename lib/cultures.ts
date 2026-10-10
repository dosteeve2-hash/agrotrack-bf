/**
 * Cultures : plus d'énumération fermée. La base stocke un texte libre ; ce
 * fichier ne fournit que des SUGGESTIONS (noms courants, sans aucun chiffre
 * agronomique) et l'affichage des anciennes valeurs en minuscules.
 */

export const CULTURES_SUGGEREES: readonly string[] = [
  'Arachide', 'Banane', 'Blé', 'Cacao', 'Café', 'Canne à sucre', 'Coton', 'Haricot',
  'Igname', 'Karité', 'Manioc', 'Maïs', 'Mil', 'Niébé', 'Oignon', 'Orge',
  'Palmier à huile', 'Patate douce', 'Pomme de terre', 'Riz', 'Sésame', 'Soja',
  'Sorgho', 'Thé', 'Tomate', 'Tournesol',
].sort((a, b) => a.localeCompare(b, 'fr'))

export const AUTRE = '__autre__'

// Valeurs historiques stockées en minuscules sans accents avant la migration.
const ANCIENNES_VALEURS: Record<string, string> = {
  mil: 'Mil', sorgho: 'Sorgho', mais: 'Maïs', coton: 'Coton', sesame: 'Sésame',
  karite: 'Karité', arachide: 'Arachide', niebe: 'Niébé',
}

export function libelleCulture(valeur: string): string {
  return ANCIENNES_VALEURS[valeur] ?? valeur
}

/** Nettoie une saisie libre : espaces, longueur bornée comme la base (60). */
export function nettoyerCulture(saisie: string): string {
  return saisie.trim().replace(/\s+/g, ' ').slice(0, 60)
}

// Types de sol : liste neutre + saisie libre. Les anciennes valeurs restent lisibles.
export const SOLS_SUGGERES: readonly string[] = [
  'Argileux', 'Limoneux', 'Sableux', 'Argilo-sableux', 'Limono-sableux', 'Humifère', 'Calcaire',
]

const ANCIENS_SOLS: Record<string, string> = {
  lateritique: 'Latéritique', argilo_sableux: 'Argilo-sableux',
  sablonneux: 'Sablonneux', limoneux: 'Limoneux',
}

export function libelleSol(valeur: string): string {
  return ANCIENS_SOLS[valeur] ?? valeur
}

// Moyens de paiement : quatre catégories, sans aucun opérateur nommé.
export const MOYENS_PAIEMENT: readonly { valeur: string; libelle: string }[] = [
  { valeur: 'especes', libelle: 'Espèces' },
  { valeur: 'virement', libelle: 'Virement' },
  { valeur: 'mobile_money', libelle: 'Mobile money' },
  { valeur: 'autre', libelle: 'Autre' },
]

export function libelleMoyen(valeur: string): string {
  if (valeur === 'orange_money' || valeur === 'wave') return 'Mobile money'
  return MOYENS_PAIEMENT.find(m => m.valeur === valeur)?.libelle ?? valeur
}

// Couleurs des graphiques
const PALETTE_CULTURES = ['#8b5cf6', '#ef4444', '#f59e0b', '#22d98a', '#c07d10', '#00BCD4', '#ec4899', '#64748b']

/** Une couleur stable par nom de culture, sans liste de cultures figée. */
export function couleurCulture(nom: string): string {
  let h = 0
  for (const c of nom) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return PALETTE_CULTURES[h % PALETTE_CULTURES.length]
}
