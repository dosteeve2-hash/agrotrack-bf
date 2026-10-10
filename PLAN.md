# PLAN — AgroTrack indépendant du pays

Date : 2026-10-10 · Statut : **étapes pays-neutres implémentées (voir « Avancement » en fin de document) ; météo et sol reportés (priorité 2)** · Règle #15 du fondateur (six documents en un seul fichier)
Inventaire détaillé des liens au pays : [`docs/inventaire-pays.md`](docs/inventaire-pays.md)

Marquage : `[texte]` dit par le fondateur · `[déduit]` inféré du code ou de la doctrine · `[inconnu]` à confirmer · `[vérifié]` / `[non vérifié]` pour les sources externes.

Demande du fondateur, mot pour mot : « faire en sorte qu'AgroTrack soit un outil de traquage des récoltes, et ne pas mettre de pays spécifique : actuellement je ne sais pas à qui je vais vendre ça, mieux vaut que l'outil s'adapte à tout le monde. La personne choisit son pays, et l'outil s'adapte aux conditions météorologiques et aux conditions du sol de son pays, personnalisé. »

---

## 1. PRD court

### Problème
AgroTrack est aujourd'hui câblé sur le Burkina Faso : 225 occurrences de cultures en dur, 93 de FCFA, 80 de lieux, 55 du nom « BF », météo fixée sur Ouagadougou dans trois composants. `[déduit]` (inventaire). Le fondateur ne sait pas à qui il vendra `[texte]`. Un produit lié à un pays se vend à un pays ; un produit qui s'adapte se vend au premier client qui répond, où qu'il soit.

### Utilisateur
`[inconnu]` Le rôle exact (gérant de coopérative, exploitant individuel, agronome de projet) n'est pas fixé. Hypothèse de travail `[déduit]` : le **gérant d'une coopérative ou d'une exploitation** qui suit des récoltes, des parcelles et des paiements, le plus souvent sur un téléphone Android d'entrée de gamme, en réseau intermittent.

### Fonctionnalités de la V1
1. **Choix du pays** à l'inscription (liste ISO 3166-1), qui fixe par défaut la devise, la langue et le fuseau.
2. **Localisation de l'exploitation** : région choisie par recherche de lieu ou point GPS ; le point est stocké au niveau de la coopérative et, facultativement, de chaque parcelle.
3. **Catalogue de cultures** : liste de départ commune + ajout libre par le compte. Fin de l'énumération fermée à 8 cultures.
4. **Devise et unités** par compte (affichage via `Intl`), sans 2 décimales forcées pour les devises qui n'en ont pas.
5. **Météo du lieu** (actuelle, prévision, cumul de pluie passé), tirée des coordonnées du compte, avec mise en cache locale et date de fraîcheur affichée.
6. **Sol du lieu** : propriétés fournies par une source mondiale (pH, argile, carbone organique…), affichées avec leur profondeur, leur source et leur date de relevé, et **modifiables par l'utilisateur** (une analyse de terrain prime sur un modèle satellite).
7. **Suivi de récolte** inchangé dans son principe : parcelles → collectes → stocks → paiements, mais sans mot « Burkina » ni « FCFA » en dur.
8. Données de démonstration **marquées « DÉMO »** et chargées sur demande, pas par défaut pour un vrai compte.

### Ce qu'on ne fait PAS
- Pas de conseil agronomique « certifié » (calendrier cultural, dose, variété) présenté comme vérité : voir « Honnêteté des conseils ».
- Pas de calendrier cultural par pays dans la V1 (aucune source ouverte exploitable par API n'est vérifiée, voir §2).
- Pas de traduction dans d'autres langues que le français en V1 ; l'architecture reste prête pour l'anglais.
- Pas de multi-devises dans un même compte, pas de conversion de change.
- Pas d'intégration d'un opérateur de paiement mobile par pays. Les moyens de paiement deviennent une liste libre du compte.
- Pas de renommage exécuté dans cette PR ; pas de migration de production.
- Pas de polling (`setInterval`) : la météo se rafraîchit à l'ouverture et au retour du réseau (événement `online`).

---

## 2. TRD — choix techniques et sources de données

### Principes
- Next.js 15 App Router, TypeScript strict (0 `any`), Supabase SSR avec `getUser()` côté serveur, jamais `getSession()` (CLAUDE.md du dépôt).
- **Aucun appel direct du navigateur aux fournisseurs.** Les appels passent par un Route Handler Next.js qui valide l'entrée (Zod), applique un plafond par utilisateur, écrit dans le cache en base, puis répond. Raison : clé API éventuelle côté serveur, quota partagé entre tous les utilisateurs d'une même zone, et fraîcheur uniforme.
- **Offline-first** : l'interface lit d'abord le cache local (IndexedDB ou `localStorage` selon le volume), affiche « données du JJ/MM, hors ligne », puis rafraîchit si le réseau revient.
- Une seule constante par concept : `lib/pays/` (liste des pays, devise par défaut, fuseau), `lib/format.ts` (montants, dates) remplacent les trois copies de coordonnées et les formateurs FCFA dispersés.

### Sources de données — vérification

**Limite méthodologique** : les sites officiels (open-meteo.com, docs.isric.org, power.larc.nasa.gov) n'étaient pas joignables en accès direct depuis l'environnement d'exécution (proxy). Les faits ci-dessous viennent d'extraits de recherche web qui citent les pages officielles ; ce qui n'est pas confirmé est marqué « non vérifié ». **Relire les pages officielles avant tout engagement commercial.**

| Source | Ce qu'on obtient | Limites et licence relevées | Statut | Conséquence offline-first |
|---|---|---|---|---|
| **Open-Meteo** prévision, `https://api.open-meteo.com/v1/forecast` | Météo actuelle et prévisions pour tout couple lat/lon ; `past_days` pour les jours passés | Accès gratuit **non commercial**, sans clé ; plafonds relevés : moins de 10 000 appels/jour, 5 000/heure, 600/minute ; données sous CC BY 4.0 (attribution) ; blocage possible en cas d'abus. Un plan payant avec clé API existe pour la production commerciale (prix : non vérifié). Source : <https://open-meteo.com/en/pricing>, <https://open-meteo.com/en/terms> | vérifié par extrait de recherche, pas par lecture directe | **Un produit vendu à des coopératives est commercial** `[déduit]` : prévoir la clé payante avant la première vente. Cache serveur par maille arrondie (ex. 0,1°) pour réduire les appels ; cache client avec horodatage |
| **Open-Meteo** historique, `https://archive-api.open-meteo.com/v1/archive` | Archive horaire/quotidienne depuis 1940 (ERA5), 1950 (ERA5-Land) | Maille ERA5 d'environ 25 km : ne représente pas les effets locaux (orages, microclimats). Toutes les variables ERA5 ne sont pas exposées. Source : <https://open-meteo.com/en/docs/historical-weather-api> | vérifié par extrait | Utile pour « pluie cumulée sur la saison » ; données figées, donc cachables longtemps. Mention de la maille dans l'interface |
| **Open-Meteo** géocodage (recherche de lieu → lat/lon) | Existence confirmée par un tiers ; point d'accès, limites et licence **non vérifiés** | Source à confirmer : <https://open-meteo.com/en/docs/geocoding-api> | **non vérifié** | Alternative sans API : saisie du point GPS depuis le téléphone (permission `geolocation`), ou carte. Ne pas figer le choix avant lecture de la page |
| **ISRIC SoilGrids**, API REST `rest.isric.org/soilgrids/v2.0` | Propriétés de sol interpolées (la page ISRIC cite des services en beta) | La page ISRIC indique que l'API REST est **temporairement suspendue, sans calendrier de reprise**, et oriente vers d'autres accès. Politique d'usage « fair use » : 5 appels/minute selon la documentation d'un plugin tiers (pas l'ISRIC). Beta, sans garantie de disponibilité. Source : <https://www.isric.org/explore/soilgrids> (propriétés pH, argile, carbone : **non vérifié**) | vérifié partiellement | **Ne pas bâtir la V1 sur cette API.** Le sol doit fonctionner sans elle : saisie manuelle du type de sol par l'utilisateur (le champ `type_sol` existe déjà) ; import de rasters ISRIC en différé = étape optionnelle, licence **non vérifiée** |
| **NASA POWER**, `https://power.larc.nasa.gov/api/temporal/daily/point` | Séries journalières agroclimatiques à un point, communauté « AG » ; jusqu'à 20 paramètres par requête | Exemples de clients sans clé ; **politique d'usage, licence, limites de débit non vérifiées**. Source : documentation <https://power.larc.nasa.gov/docs/services/api/> (non lue directement) | **non vérifié** pour limites et licence | Candidat de repli pour l'historique si Open-Meteo ne convient pas ; à vérifier avant tout usage |
| **FAO Crop Calendar** | Calendriers de semis/récolte par culture et zone agro-écologique ; base régionale africaine citée avec 43 pays, plus de 130 cultures, 283 zones ; une version « globale » de plus de 100 cultures est décrite comme ayant un export pour usage hors ligne. Sources : <https://www.fao.org/agriculture/crops/information-resources/ar>, <https://agritechobservatory.review.fao.org/fr/crop-calendar> | Les deux descriptions diffèrent en portée. **Licence, API, format du fichier d'export : non vérifiés** | **non vérifié** | Ne pas promettre de calendrier cultural par pays tant que le format et la licence ne sont pas lus. Piste : export ponctuel intégré comme table de référence versionnée |
| **FAOSTAT** (fichiers en masse) | Statistiques de production par pays et culture, fichiers « normalized » en format long (décrit par la documentation d'un paquet R tiers) | URL de téléchargement, licence : **non vérifiées** | **non vérifié** | Source possible pour un catalogue de noms de cultures et des rendements nationaux de référence, jamais pour une recommandation individuelle |
| **FAO GAEZ** | Aptitude agro-écologique des terres | Accès par API ou fichier ouvert : **non vérifié** | **non vérifié** | Hors V1 |
| **`Intl.NumberFormat` / `Intl.DisplayNames`** (ECMAScript) | Format des montants selon devise ISO 4217 et locale ; noms de pays et de devises traduits | Aucune API, aucun réseau. Testé sous Node 22 : `fr-FR` + `XOF` donne « 1 234 567 F CFA » ; `GHS` donne « 1 234,50 GHS » ; `EUR` donne « 1 234,50 € » ; `Intl.supportedValuesOf('currency')` renvoie 162 devises ; `DisplayNames` donne « Burkina Faso », « franc CFA (BCEAO) ». Le rendu dépend de la version d'ICU du navigateur | vérifié par exécution locale | Fonctionne hors ligne. La règle du dépôt (« N FCFA ») est conservée par un petit formateur qui garde le suffixe « FCFA » quand la devise est XOF ou XAF, et utilise `Intl` pour le reste |

### Décisions techniques
- **Cultures** : table de référence + liste libre du compte, plutôt qu'un `enum` Postgres (impossible à étendre par pays sans migration). Source des noms : à choisir parmi FAO/FAOSTAT après vérification de la licence ; en attendant, une courte liste de départ **écrite à la main par le fondateur**, sans chiffre agronomique.
- **Type de sol** : l'`enum type_sol` actuel (4 valeurs) devient du texte avec liste de suggestions ; les valeurs mesurées par satellite (pH…) sont stockées à part, avec leur source.
- **Montants** : le schéma stocke `prix_unitaire_fcfa integer` et `montant_fcfa integer`. Pour accepter des devises à décimales, stocker en **unité mineure entière** (`*_minor`) avec la devise du compte. Voir §5 et question 3.
- **Fuseau** : IANA, déduit des coordonnées ou choisi ; remplace `Africa/Abidjan` en dur.
- **Rafraîchissement sans polling** : à l'ouverture de l'écran, au retour de l'événement `online`, et à l'appui d'un bouton. Pas de minuterie.

---

## 3. Flux

### Onboarding (nouveau compte)
1. **Pays** : liste recherchable (nom traduit via `Intl.DisplayNames`). Choix → devise, fuseau et langue pré-remplis, modifiables.
2. **Localisation** : « Utiliser ma position » (GPS du téléphone, demandé seulement ici) ou recherche d'un lieu, ou saisie manuelle de la région sans coordonnées. Sans coordonnées, la météo et le sol sont masqués avec un message clair, le reste fonctionne.
3. **Cultures** : cases à cocher dans la liste de départ + « Ajouter une culture ». Au moins une.
4. **Devise et unités** : devise confirmée, unité de masse (kg par défaut, tonne, sac avec poids du sac saisi), unité de surface (ha par défaut).
5. Récapitulatif → création de la coopérative → tableau de bord vide, avec un lien « Charger des données de démonstration ».

Chaque étape fonctionne hors ligne : les choix sont écrits localement puis synchronisés ; seule la recherche de lieu exige le réseau (la saisie manuelle reste possible).

### Parcours quotidien
- Ouverture : tableau de bord lit le cache local (météo datée, sol, collectes en attente).
- Saisie d'une collecte (culture du compte, poids, prix, membre) : écrite localement, marquée « en attente de synchronisation ».
- Retour du réseau : synchronisation des écritures, rafraîchissement météo, mise à jour de l'horodatage.
- Sur une parcelle : voir météo et sol du point de la parcelle (sinon de la coopérative), avec la fraîcheur de chaque donnée.
- Paramètres : changer de pays ou de devise est possible, avec un avertissement si des montants existent (la devise n'est pas convertie, voir question 3).

---

## 4. Brief UI

Contraintes : mobile 375 px sans débordement horizontal, WCAG 2.1 AA, dark mode lisible, charte du dépôt (Navy `#0A1628`, Gold `#D4AF37`, Cyan `#00BCD4`), français d'abord.

| Écran | Modification |
|---|---|
| Inscription / onboarding (`/onboarding`) | Passe de 1 écran à 4 étapes courtes (pays, lieu, cultures, devise), barre de progression, un seul champ principal par écran, boutons de 44 px minimum |
| Accueil (`/`) | Retirer « Burkina » et « FCFA ». Phrase de vente pays-neutre centrée sur le résultat (suivre ses récoltes de la parcelle au paiement, même sans internet). Libellé exact à valider avec le fondateur |
| Tableau de bord, Météo, widget, alertes | Libellé du lieu dynamique ; badge « données du JJ/MM HH:MM » ; état « hors ligne, dernières données » ; attribution Open-Meteo (CC BY 4.0) en pied |
| Parcelles | Culture issue du catalogue du compte ; bouton « Placer sur la carte / ma position » ; bloc Sol avec valeurs sourcées et bouton « Corriger avec mon analyse » |
| Paramètres | Section « Pays, devise, unités, localisation » en tête ; l'actuelle liste de 8 régions burkinabè disparaît au profit d'un champ région libre |
| Montants (partout) | Un composant `Montant` unique ; plus de « FCFA » écrit à la main |
| Démo | Bandeau « Données de démonstration » sur chaque écran concerné |

Principes visuels : animations Framer Motion avec `type: 'spring' as const`, `prefers-reduced-motion` respecté, Recharts avec le motif `mounted`.

---

## 5. Schéma (à ajouter, jamais à renommer d'un coup)

Migration idempotente, versionnée dans `supabase/migrations/`, RLS activée sur tout. Le schéma actuel utilise `cooperative_id` + `public.cooperative_courante()` pour l'isolement.

### Colonnes ajoutées à `cooperatives`
| Colonne | Type | Notes |
|---|---|---|
| `pays_code` | `text` check `^[A-Z]{2}$` | ISO 3166-1 alpha-2 ; `null` toléré pour les comptes existants |
| `devise_code` | `text` check `^[A-Z]{3}$` | ISO 4217 ; défaut rempli à `XOF` pour les lignes existantes (donnée actuelle, pas une supposition produit) |
| `fuseau` | `text` | IANA |
| `latitude`, `longitude` | `numeric(9,6)` | même contrainte « jamais à moitié » que `parcelles` |
| `langue` | `text` | défaut `fr` |
| `unite_masse`, `unite_surface` | `text` | défauts `kg` et `ha` |

### Nouvelles tables
- **`cultures_catalogue`** : `code text pk`, `nom_fr text`, `source text`, `source_url text`. Lecture seule pour tout utilisateur authentifié ; écriture réservée au rôle service. Remplace l'`enum culture`.
- **`cultures_cooperative`** : `id uuid pk`, `cooperative_id`, `code_catalogue text null` (référence), `nom text not null` (nom libre), `creee_le`. RLS : `cooperative_id = public.cooperative_courante()` en lecture et en écriture.
- **`meteo_cache`** : `maille text` (coordonnées arrondies, ex. `12.4:-1.5`), `type text` (`actuelle`, `prevision`, `historique`), `payload jsonb`, `source text`, `recuperee_le timestamptz`, `valide_jusqu_a timestamptz`, `pk (maille, type)`. Cache **partagé** (aucune donnée personnelle, maille de plusieurs km) : lecture pour les authentifiés, écriture réservée au service. Limite de taille du `payload` imposée en application.
- **`sol_releve`** : `id`, `cooperative_id`, `parcelle_id null`, `propriete text` (`ph`, `argile`, `carbone_organique`…), `valeur numeric`, `unite text`, `profondeur text`, `origine text` check (`modele`, `utilisateur`), `source text`, `source_url text`, `releve_le timestamptz`. RLS par `cooperative_id`. Une ligne `utilisateur` ne remplace pas une ligne `modele` : les deux sont gardées et l'interface affiche la plus récente d'origine `utilisateur` en priorité.

### Colonnes à migrer en deux temps (étape 6)
- `collectes.prix_unitaire_fcfa`, `paiements.montant_fcfa` : ajouter `*_minor bigint` + recopie, basculer le code, retirer les anciennes colonnes dans une migration ultérieure. `moyen_paiement` : enum `(especes, orange_money, wave, virement)` → texte libre du compte.
- `parcelles.culture` (enum) → `culture_id` référant `cultures_cooperative`, avec recopie des 8 valeurs existantes. `type_sol` enum → texte.
- `database.types.ts` régénéré après chaque migration.

---

## 6. Plan d'implémentation — étapes livrables

Une PR par étape, `npm run build` à 0 erreur et `npm run lint` avant chaque push.

| # | Étape | Critère de vérification |
|---|---|---|
| 0 | Valider ce plan et répondre aux questions ouvertes | Réponses écrites du fondateur dans la PR |
| 1 | **Formateur central** (`lib/format.ts`, composant `Montant`) et fin des « FCFA » écrits à la main, sans changer le comportement pour XOF | Tests unitaires : XOF garde « FCFA », EUR et GHS passent par `Intl` ; les tests existants passent ; `grep -ri fcfa` ne renvoie plus que le formateur, la base et la doc |
| 2 | **Schéma de base** : colonnes pays/devise/lieu, `cultures_catalogue`, `cultures_cooperative`, caches ; RLS | Migration appliquée sur une branche Neon ou Supabase de test ; test RLS : un utilisateur d'une coopérative A ne lit rien de B ; migration rejouable sans erreur |
| 3 | **Onboarding pays → lieu → cultures → devise** | Parcours complet à 375 px, hors ligne sauf recherche de lieu ; 0 violation axe WCAG 2.1 AA ; compte créé avec les bons champs |
| 4 | **Météo par coordonnées** : Route Handler + cache + affichage daté ; suppression des 3 copies de coordonnées | Coupure réseau simulée : l'écran affiche la dernière donnée avec sa date ; aucun `setInterval` (grep) ; attribution visible |
| 5 | **Sol** : saisie du type de sol, relevés sourcés, correction par l'utilisateur ; sans dépendre de SoilGrids | Une valeur saisie par l'utilisateur est affichée avec l'étiquette « saisie par vous » et prime sur le modèle |
| 6 | **Cultures libres + montants en unité mineure**, migration en deux temps | Données existantes intactes (comparaison avant/après sur la base de démo) ; création d'une culture « Café » puis d'une collecte en EUR |
| 7 | **Textes pays-neutres** : accueil, métadonnées, PDF, rapports ; lien « charger la démo » | `grep -ri burkina` ne renvoie plus que l'historique et les données de démo marquées |
| 8 | **Renommage** « AgroTrack BF » → « AgroTrack » (voir ci-dessous), après accord | Build vert ; ancien domaine redirige ; manifest et titres à jour |
| 9 | **Vérification navigateur réelle** (Règle #1 du fondateur) : inscription, connexion, parcours, mobile 375 px, console sans erreur | Rapport joint à la PR ; sinon on ne dit pas « terminé » |

Sans la clé payante Open-Meteo (question 2), les étapes 1 à 3 et 5 à 7 restent livrables ; seule l'étape 4 passe en mode non commercial, donc **non vendable**.

### Renommage recommandé : « AgroTrack BF » → « AgroTrack » (non exécuté)
Il touche : le nom du dépôt GitHub (`agrotrack-bf`, GitHub redirige l'ancienne URL), le nom du projet Vercel et son alias `agrotrack-bf.vercel.app` (prévoir une redirection), `package.json` (`name`), `public/site.webmanifest` (déjà « AgroTrack »), les métadonnées de `app/layout.tsx`, 55 occurrences dans 28 fichiers (pages d'accueil, connexion, inscription, navigation, PDF), le compte de démonstration `demo@agrotrack-bf.com`, les en-têtes SQL, la documentation (`README.md`, `PRD.md`, `MARKETING.md`, `CLAUDE.md`), et la fiche du projet dans `AMBITION.md` / `ETAT.md` du fondateur. Le suffixe « BF » reste un argument commercial seulement si le fondateur choisit finalement de vendre au Burkina d'abord : à trancher avec la question 1.

---

## Honnêteté des conseils

**L'outil peut afficher** (information datée, sourcée, non prescriptive) :
- La météo observée ou prévue pour le point choisi, avec la source (Open-Meteo), la date de relevé et la maille du modèle.
- Le cumul de pluie passé sur une période choisie, issu de l'archive, avec la mention « modèle, maille d'environ 25 km ».
- Des propriétés de sol issues d'un modèle mondial, avec profondeur, source, date, **et** la valeur saisie par l'utilisateur à côté.
- Les données propres du compte : rendements réels, collectes, stocks.

**L'outil ne doit pas présenter comme conseil agronomique certifié** :
- Une date de semis, une variété, une dose d'engrais, une pratique, ou une prévision de rendement « recommandée ».
- Une aptitude d'un sol à une culture déduite d'un modèle mondial à maille de plusieurs centaines de mètres.
- Un seuil d'alerte (chaleur, humidité) : les seuils actuels de `buildMeteoAlertes` sont **codés pour le Sahel** `[déduit]` et n'ont pas de source dans le dépôt. Les remplacer par des seuils réglables par le compte, étiquetés « seuil défini par vous », ou les retirer en V1.
- Tout chiffre agronomique sans source citée. Règle de véracité : **aucune donnée inventée**, y compris dans la démo (marquée « DÉMO »).

Formule d'interface proposée : « Information indicative issue de [source], relevée le [date]. Elle ne remplace pas l'avis d'un conseiller agricole local. »

---

## Questions ouvertes pour Steeve (5 maximum)

1. **Positionnement** : l'outil est-il vendu comme « AgroTrack » tout court, sans suffixe de pays, dès la première page publique ? (oui / non, ou garder « BF » tant qu'il n'a pas de client ailleurs)
2. **Licence météo** : acceptes-tu de souscrire le plan payant d'Open-Meteo avant la première vente (le gratuit est réservé au non commercial), ou préfères-tu une autre source ? (oui, plan payant / autre source / on reste non commercial pour l'instant)
3. **Devises** : une seule devise par compte, sans conversion, avec montants stockés en unité mineure entière : d'accord ? (oui / non, je veux le multi-devises)
4. **Données de démonstration** : le jeu actuel (Koudougou, noms burkinabè) est conservé comme **une** démo marquée « DÉMO » parmi d'autres, ou supprimé ? (conserver / supprimer / remplacer par une démo neutre)
5. **Premier test réel** : qui est la première personne, hors Burkina ou au Burkina, avec un prénom, qui essaiera la version pays-neutre ? (nom, ou « personne pour l'instant », auquel cas le plan s'arrête à l'étape 3)

---

## Décisions du fondateur (10/10/2026) — réponses aux cinq questions

1. **Nom** : le produit s'appelle **« AgroTrack »**, sans « BF » (nom d'usage). Le dépôt GitHub, le projet Vercel et les URLs ne sont **pas** renommés : étape manuelle plus tard.
2. **Météo et sol : REPORTÉS (priorité 2).** Aucune API météo ou sol n'est intégrée. Les trois composants météo existants lisent désormais les coordonnées des paramètres du compte, et affichent « Météo locale : bientôt disponible (à venir) » à défaut.
   **À RAPPELER AU FONDATEUR AVANT LA PREMIÈRE VENTE** : Open-Meteo gratuit = **usage non commercial** ; il faut son plan payant (ou une autre source) avant tout usage commercial. Les composants appellent déjà `api.open-meteo.com` quand des coordonnées existent : tant que le plan payant n'est pas souscrit, ne pas vendre l'affichage météo. Licence et plafonds à relire sur les pages officielles (non lues directement, voir §2).
3. **Devises** : une seule devise par compte, **sans conversion**. Formateur unique `formatMontant(montant, devise, locale)` (Intl, fr-FR par défaut) ; la devise vient des paramètres du compte, proposée selon le pays, modifiable.
4. **Démonstration** : les données de démo (Koudougou, noms, villages, SOFITEX…) sont **remplacées par du neutre et zéro** : aucun lieu, aucune personne, aucun chiffre inventé ; états vides clairs avec l'action pour commencer.
5. **Premier testeur** : le fondateur, Steeve — le plan va donc au-delà de l'étape 3.

## Avancement (PR #21)

Légende : [x] fait · [ ] reste à faire · [~] partiel.

| # | Étape du plan | État |
|---|---|---|
| 0 | Valider le plan, questions ouvertes | [x] réponses ci-dessus |
| 1 | Formateur central et fin des « FCFA » écrits à la main | [x] `lib/format.ts` + `useFormatMontant` ; tests XOF, GHS, EUR, TRY, 0. Le composant `Montant` du brief UI n'a pas été créé : le hook suffit |
| 2 | Schéma de base : pays/devise/lieu sur `cooperatives`, RLS | [~] migration **écrite, non appliquée** (`supabase/migrations/20261010120000_pays_devise_cultures.sql`) : colonnes, politique de mise à jour du gérant, enums -> texte. **Pas** de tables `cultures_catalogue`, `cultures_cooperative`, `meteo_cache`, `sol_releve` (cultures libres en texte ; météo et sol reportés). Test RLS impossible sans base |
| 3 | Onboarding pays -> lieu -> cultures -> devise | [~] pays (liste complète, recherche), devise proposée, coordonnées facultatives saisies à la main, dans `/onboarding` puis `/parametres`. Reste : recherche de lieu et bouton « utiliser ma position » (nécessitent une API de géocodage, non vérifiée) ; unités de masse et de surface ; cultures suivies saisies dans `/parametres` mais pas dans l'onboarding |
| 4 | Météo par coordonnées, route serveur, cache | [ ] **reporté (priorité 2)**. Fait seulement : coordonnées du compte à la place de Ouagadougou, « bientôt disponible » sinon |
| 5 | Sol | [ ] **reporté (priorité 2)**. Fait : type de sol en texte libre + suggestions |
| 6 | Cultures libres + montants en unité mineure | [~] cultures, sols et moyens de paiement libres (code + migration). Montants : colonnes `*_fcfa` **non renommées** ; procédure `montant` + devise documentée dans la migration. Pas de stockage en unité mineure : Intl gère les décimales à l'affichage |
| 7 | Textes pays-neutres, lien « charger la démo » | [x] textes neutres ; plus de démo à charger (zéro donnée) |
| 8 | Renommage « AgroTrack BF » -> « AgroTrack » | [~] texte visible fait ; dépôt, Vercel, URLs, `package.json`, `.env.production.example` non touchés |
| 9 | Vérification navigateur réelle (Règle #1) | [x] Playwright, build réel, 375 et 1280 px : voir la PR |

### Ce qui reste (priorité décroissante)

- **Appliquer la migration** sur une base (Neon ou Supabase) : action du fondateur ; il n'existe aucun projet Supabase pour ce dépôt. Tant qu'elle n'est pas appliquée, le pays et la devise ne vivent que sur l'appareil (localStorage).
- **Brancher à la base** les modules qui ne le sont pas : collectes, paiements, stocks, intrants, équipements, finances, statistiques, rapports, cycles de cultures. Seuls membres et parcelles lisent la base ; les autres écrans affichent un état vide qui le dit. Leurs boutons d'ajout ne sont pas fonctionnels (préexistant) et sont masqués tant que l'écran est vide.
- Page `/parametres` : le bouton « Sauvegarder » des onglets Profil, Coopérative et Alertes n'enregistre rien (préexistant) ; seul l'onglet « Pays et devise » enregistre.
- Onboarding : recherche de lieu / position GPS, unités de masse et de surface, cultures.
- **Météo et sol (priorité 2)** : étapes 4 et 5 du plan, après la décision sur la licence Open-Meteo. Les seuils de `buildMeteoAlertes` restent codés pour un climat sahélien sans source : à rendre réglables ou à retirer avant d'afficher des alertes à un autre pays.
- Renommage manuel : dépôt GitHub, projet Vercel, alias `agrotrack-bf.vercel.app`, `package.json`, compte de démonstration `demo@agrotrack-bf.com`, `.env.production.example`.
- `PRD.md`, `MARKETING.md`, `LOVABLE_PROTOCOL.md` : renommés mais décrivent encore le marché de lancement burkinabè ; à réécrire par le fondateur.
- Dette préexistante signalée : libellé « Guide d'Acmo » dans le menu ; le compte de démonstration `demo@agrotrack-bf.com` / mot de passe codé en dur dans `app/auth/login/page.tsx` ; tests de `ParcellesPage` encore sur une fixture à noms de lieux réels (non visibles).
