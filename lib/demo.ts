/**
 * Le compte de démonstration, et pourquoi son mot de passe ne s'affiche plus.
 *
 * Le 16 septembre 2026, après la mise en service du garde de `config.ts`,
 * `https://agrotrack-bf.vercel.app/dashboard` a cessé de répondre 500 et rend enfin
 * la page de connexion. Cette page imprimait :
 *
 *     Email : <l'adresse du compte de demonstration>
 *     Mot de passe : <en clair>
 *
 * (Le couple exact est volontairement absent de ce commentaire : l'inscrire ici le
 * remettrait dans le code source, ce qui est precisement ce qu'on supprime. Il est
 * dans l'historique git, et doit etre considere comme BRULE — la valeur posee dans
 * DEMO_PASSWORD doit etre nouvelle, pas celle-la.)
 *
 * Tant que Supabase n'est pas configuré, ce couple ne vaut rien : le compte n'existe
 * pas. Mais la page est publique, et **le jour où les deux variables Supabase seront
 * posées** — c'est la question ouverte Q21 — ce mot de passe deviendra un identifiant
 * valide, affiché à qui charge l'adresse. Le correctif doit donc précéder la réponse,
 * pas la suivre.
 *
 * Le bouton « Accéder à la démo » reste : c'est lui qui a de la valeur, un accès en un
 * clic. Ce qui disparaît, c'est la publication du mot de passe, qui n'apportait rien
 * que le bouton n'apporte déjà.
 *
 * Les identifiants viennent de l'environnement, et DÉLIBÉRÉMENT sans préfixe
 * `NEXT_PUBLIC_` : ce préfixe inscrit la valeur dans le paquet servi au navigateur,
 * ce qui reproduirait exactement le défaut qu'on corrige. Ils ne sont lus que dans
 * des Server Actions et des Server Components.
 */

// `||` et non `??`, pour la même raison que dans `config.ts` : une variable définie
// mais VIDE est la façon la plus courante de désactiver une variable chez un hébergeur.
export function emailDemo(): string {
  return process.env.DEMO_EMAIL || ''
}

export function motDePasseDemo(): string {
  return process.env.DEMO_PASSWORD || ''
}

/** La démonstration n'est proposée que si les DEUX valeurs existent. */
export function demoConfiguree(): boolean {
  return emailDemo() !== '' && motDePasseDemo() !== ''
}

/**
 * L'utilisateur connecté est-il le compte de démonstration ?
 *
 * Retourne `false` quand la démo n'est pas configurée, sinon une session sans email
 * et une démo absente se compareraient toutes deux à la chaîne vide et n'importe qui
 * verrait la bannière « Mode Démo ».
 */
export function estCompteDemo(email: string | null | undefined): boolean {
  if (!demoConfiguree()) return false
  return !!email && email === emailDemo()
}
