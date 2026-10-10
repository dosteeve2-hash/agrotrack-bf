# Inventaire des liens au pays (Burkina Faso) dans AgroTrack BF

Relevé du 2026-10-10 sur `master` (a8f7615), hors `node_modules`, `.next`, `.git`, `package-lock.json`.
Les comptes sont des occurrences de lignes (grep insensible à la casse) ; une ligne peut compter dans deux catégories.

## Comptes par catégorie

| Catégorie | Occurrences | Fichiers | Effort global |
|---|---|---|---|
| Catalogue de cultures en dur (mil, sorgho, maïs, coton, sésame, karité, arachide, niébé) | 225 | 38 | lourd |
| Devise FCFA / XOF / « F CFA » | 93 | 25 | lourd |
| Géographie (villes, régions, provinces, Sahel) | 80 | 21 | moyen |
| Nom du produit « AgroTrack BF » / `agrotrack-bf` | 55 | 28 | moyen |
| Locale `fr-FR` / `lang="fr"` | 47 | 22 | trivial à moyen |
| Téléphone / moyens de paiement (+226, Orange Money, Wave, Moov) | 41 | 12 | moyen |
| Pays « Burkina » | 16 | 11 | trivial |
| Noms de coopératives / fournisseurs (SOFITEX…) | 10 | 7 | trivial |

## Tableau fichier:ligne

| Fichier:ligne | Catégorie | Contenu | Effort |
|---|---|---|---|
| `app/layout.tsx:6-7` | métadonnées | titre « AgroTrack BF », description « … du Burkina Faso » | trivial |
| `app/layout.tsx:21` | i18n | `<html lang="fr">` figé | moyen (devient dynamique) |
| `public/site.webmanifest` | nom du produit | nom « AgroTrack » (déjà sans « BF »), description « Gestion Agricole Intelligente », pas de `lang` | trivial |
| `app/page.tsx:12,47,50-51,84` | texte / devise | « Mobile Money … en FCFA », « agricole au Burkina », « coopératives du Burkina Faso … tout en FCFA », pied de page « Burkina Faso » | trivial |
| `app/page.tsx:21` ; `app/auth/login/page.tsx:60` ; `app/auth/register/page.tsx:62` | nom du produit | « AgroTrack BF » | trivial |
| `app/auth/login/page.tsx:35,89` | démo | compte `demo@agrotrack-bf.com` | trivial |
| `components/WeatherWidget.tsx:30,53` | géographie | coordonnées Ouagadougou (12.37 ; -1.53), fuseau `Africa/Abidjan`, libellé « Météo — Ouagadougou » | moyen |
| `components/AlertesAgro.tsx:48` | géographie | mêmes coordonnées et fuseau en dur ; seuils d'alerte dans `buildMeteoAlertes` | moyen |
| `components/NavAlertBadge.tsx:10` | géographie | mêmes coordonnées et fuseau en dur | moyen |
| `app/(dashboard)/meteo/page.tsx:104` | géographie / démo | « Région Hauts-Bassins », prévisions factices | lourd (page à rebrancher) |
| `components/PDFExportButton.tsx:19-20,46,66,125` | devise / géographie | `fmtFCFA`, « Koudougou, Burkina Faso », en-têtes « FCFA/kg » | moyen |
| `app/(dashboard)/rapports/page.tsx:31` | géographie | « Koudougou, Burkina Faso » | trivial |
| `app/(dashboard)/rapports/rapports.data.ts:41` | démo | incident « zone Nord Koudougou » | trivial |
| `app/(dashboard)/parcelles/parcelles.data.ts:27-58` | démo / géographie | 12 parcelles d'exemple, `VILLAGES`, 13 régions burkinabè | lourd |
| `app/(dashboard)/parcelles/ParcellesVue.tsx:22` ; `parcelles/actions.ts:13` | catalogue de cultures | listes de 8 cultures en dur | lourd |
| `app/(dashboard)/parcelles/ParcelleModal.tsx:61` | catalogue de cultures | `['Mil','Sorgho','Maïs','Coton']` | moyen |
| `app/(dashboard)/parametres/page.tsx:16,37-43` | géographie / démo | `REGIONS` (8 régions BF), téléphone +226, coopérative du Centre-Ouest | lourd (devient l'écran pays) |
| `app/(dashboard)/membres/MembreModal.tsx:54,61` | téléphone / géographie | placeholders « +226 70 00 00 00 », « Koudougou » | trivial |
| `app/(dashboard)/intrants/page.tsx:30-31,314` | démo / catalogue | engrais pour « Maïs », fournisseur « SOFITEX », prix en FCFA | moyen |
| `app/(dashboard)/collectes/page.tsx` (21 lignes), `paiements/page.tsx` (18), `stocks/page.tsx` (11), `finances/page.tsx` (9), `statistiques/page.tsx` (5), `equipements/page.tsx` (5), `collectes/CollectesClient.tsx` (5) | devise / démo / cultures | montants « FCFA », prix par culture, données factices | lourd (formateur central + données réelles) |
| `app/(dashboard)/dashboard/page.tsx`, `DashboardClient.tsx`, `onboarding/page.tsx`, `cultures/page.tsx`, `error.tsx` | devise / texte | libellés FCFA, cultures | moyen |
| `lib/database.types.ts:65,77` | schéma | commentaire « le FCFA n'a pas de sous-unité » ; colonnes `*_fcfa` | lourd (renommage de colonnes) |
| `supabase/migrations/20260907120000_noyau.sql` | schéma | `prix_unitaire_fcfa integer`, `montant_fcfa integer`, enum `culture` (8 valeurs), enum `type_sol` (4 valeurs), enum `moyen_paiement` (`orange_money`, `wave`), `cooperatives.region/province/commune`, en-tête « AgroTrack BF » | lourd |
| `supabase/seed.sql` | démo | coopérative de Koudougou, 12 membres avec +226, parcelles, collectes | lourd (à réécrire ou à marquer démo) |
| `supabase/README.md`, `README.md`, `PRD.md`, `docs/PRD.md`, `MARKETING.md`, `LOVABLE_PROTOCOL.md`, `specs/*`, `build_pr.bat`, `.env*.example`, `CLAUDE.md` | documentation | mentions du Burkina, FCFA, nom du produit | trivial à moyen |
| `__tests__/MeteoPage.test.tsx`, `DashboardNav.test.tsx`, `agregerParcelles.test.ts`, `ParcellesPage.test.tsx`, `CulturesPage.test.tsx` | tests | attendent les textes actuels | moyen |
| `package.json:2` | nom du produit | `"name": "agrotrack-bf"` | trivial |
| `components/DashboardNav.tsx` | nom du produit | libellé « AgroTrack BF » | trivial |

## Constats utiles au plan

- Les coordonnées de Ouagadougou sont copiées dans **trois** composants : une source unique résout les trois.
- Aucun polling (`setInterval`) dans `app`, `components`, `lib` ; les trois composants météo font un `fetch` à l'ouverture, sans cache hors ligne.
- La table `parcelles` a déjà `latitude` / `longitude` (facultatives, jamais à moitié) ; `cooperatives` n'a ni pays, ni devise, ni coordonnées.
- Le manifest affiche déjà « AgroTrack » sans « BF ».
- La majorité des pages du tableau de bord affichent des données factices en dur ; seules deux fonctions sont branchées à Supabase d'après `ETAT.md` du fondateur (non revérifié ici).
