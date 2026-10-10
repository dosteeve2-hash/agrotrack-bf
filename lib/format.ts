/**
 * Le seul endroit où l'application formate de l'argent.
 *
 * Une seule devise par compte, sans conversion : la devise vient des
 * paramètres du compte (`lib/compte`), jamais d'un libellé écrit en dur dans
 * un écran. `Intl.NumberFormat` connaît le nombre de décimales de chaque devise
 * (0 pour le XOF, 2 pour l'EUR) : on ne force donc jamais « 2 décimales ».
 */

export const LOCALE_PAR_DEFAUT = 'fr-FR'

function nombreSimple(montant: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(montant)
}

/**
 * `devise` est un code ISO 4217 (XOF, GHS, EUR, TRY…). Sans devise, ou avec un
 * code que l'environnement ne connaît pas, le montant s'affiche seul plutôt que
 * de lever une exception en plein rendu.
 */
export function formatMontant(
  montant: number,
  devise?: string | null,
  locale: string = LOCALE_PAR_DEFAUT,
): string {
  if (!Number.isFinite(montant)) return '—'
  if (!devise) return nombreSimple(montant, locale)
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: devise }).format(montant)
  } catch {
    return `${nombreSimple(montant, locale)} ${devise}`
  }
}
