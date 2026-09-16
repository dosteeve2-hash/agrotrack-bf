/**
 * Une seule source de vérité pour « Supabase est-il configuré sur ce déploiement ? ».
 *
 * Pourquoi ce fichier existe : le 16 septembre 2026, `/dashboard` en production
 * répondait 500 — et le faisait déjà le 22 août, vingt-cinq jours plus tôt.
 * Reproduit en lançant l'application sans les deux variables :
 *
 *     Error: Your project's URL and Key are required to create a Supabase client!
 *
 * `client.ts` et `server.ts` écrivaient `process.env.X!`. L'assertion ne ment qu'au
 * vérificateur de types : à l'exécution la variable vaut `undefined`, et c'est
 * `@supabase/ssr` qui lève. Elle lève DANS `createClient()`, donc AVANT que le layout
 * ait pu appeler `getUser()` et rediriger vers la connexion. Résultat : au lieu d'une
 * page de connexion, les seize pages du tableau de bord renvoient une erreur serveur.
 *
 * Une variable oubliée ne doit pas tuer le produit entier. Ici on détecte au lieu
 * d'asserter, le tableau de bord reste fermé, et la page de connexion dit ce qui manque.
 */

export const URL_ABSENTE = 'https://supabase-non-configure.invalid'
export const CLE_ABSENTE = 'cle-absente'

// `||` et non `??` : une variable définie mais VIDE est la façon la plus courante de
// désactiver une variable chez un hébergeur, et `??` la laisserait passer telle quelle.
export function urlSupabase(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || URL_ABSENTE
}

export function cleSupabase(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || CLE_ABSENTE
}

export function supabaseConfigure(): boolean {
  return urlSupabase() !== URL_ABSENTE && cleSupabase() !== CLE_ABSENTE
}
