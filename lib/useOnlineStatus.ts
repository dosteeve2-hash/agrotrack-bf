"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/**
 * État de connexion du navigateur.
 *
 * `navigator.onLine` est un état extérieur à React : le lire avec un
 * `useState` initialisé à `true` puis corrigé dans un effet provoquait un
 * rendu en cascade, et affichait brièvement « en ligne » à un utilisateur
 * hors connexion — ce qui compte pour une application offline-first.
 * L'instantané serveur vaut `true` : le rendu SSR suppose la connexion.
 */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );
}
