'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { formatMontant, LOCALE_PAR_DEFAUT } from '@/lib/format'
import { abonner, analyserParametres, lireBrut, type ParametresCompte } from './parametres'

/**
 * Paramètres du compte, ou null tant qu'ils ne sont pas définis (et au rendu
 * serveur). On lit le texte brut, stable entre deux rendus, puis on l'analyse :
 * `useSyncExternalStore` exige un instantané qui ne change pas de référence.
 */
export function useParametresCompte(): ParametresCompte | null {
  const brut = useSyncExternalStore(abonner, lireBrut, () => null)
  return useMemo(() => analyserParametres(brut), [brut])
}

/** Le formateur de montants du compte : l'unique façon d'afficher de l'argent. */
export function useFormatMontant(): (montant: number) => string {
  const devise = useParametresCompte()?.deviseCode ?? null
  return useCallback((montant: number) => formatMontant(montant, devise, LOCALE_PAR_DEFAUT), [devise])
}
