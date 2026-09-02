"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Vrai une fois le composant hydraté côté client, faux au rendu serveur.
 *
 * Sert à retarder le rendu des graphiques Recharts, qui ont besoin du DOM et
 * produiraient sinon un décalage d'hydratation. L'implémentation précédente
 * (`useState(false)` + `useEffect(() => setMounted(true), [])`) provoquait un
 * rendu en cascade à chaque montage — `useSyncExternalStore` est la primitive
 * prévue pour lire un état extérieur à React, et déclare explicitement
 * l'instantané serveur.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
