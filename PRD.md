# PRD — AgroTrack

## Résumé exécutif
AgroTrack est une PWA (Progressive Web App) offline-first conçue pour les coopératives agricoles du Burkina Faso. Elle permet aux agents de terrain d'enregistrer les membres, les parcelles, les collectes et les paiements — même sans connexion internet. La synchronisation se fait automatiquement dès que le réseau revient. AgroTrack fait partie de l'écosystème FORGE Afrika et alimente ValueChain Connect (la marketplace B2B) avec les données de production des coopératives.

## Motivation originale
> "PWA offline-first pour coopératives agricoles BF. Priorité : fonctionner sans internet."
> — Contexte produit issu de CLAUDE.md

Le Burkina Faso compte plus de 2 000 coopératives agricoles (coton, sésame, karité) qui gèrent encore leurs membres, stocks et transactions sur papier. Les zones rurales ont une couverture internet intermittente. Aucun outil SaaS existant ne fonctionne sur le terrain dans ces conditions.

## Vision et ambition
Digitaliser les coopératives agricoles burkinabèses et ouest-africaines sans attendre que la connectivité soit universelle. AgroTrack doit fonctionner aussi bien que le carnet papier — mais avec la puissance de la donnée structurée, exportable et synchronisable. L'ambition est de couvrir 10% des coopératives formelles au Burkina Faso en Phase 2 (500 coopératives, 50 000+ membres enregistrés).

## Problème résolu
1. **Gestion papier non fiable** — erreurs, perte de données, impossibilité d'agréger au niveau fédération.
2. **Pas de connectivité fiable** — les solutions SaaS classiques sont inutilisables sans internet stable.
3. **Paiements aux producteurs non traçables** — disputes fréquentes faute d'historique.
4. **Invisible pour les acheteurs** — les coopératives ne peuvent pas prouver leur volume ni leur qualité à des acheteurs extérieurs.

## Utilisateurs cibles
- **Gérants de coopératives** — enregistrent les membres, les collectes et gèrent les paiements
- **Agents de terrain** — pèsent et saisissent les récoltes sur tablette ou smartphone
- **Fédérations de coopératives** — voient les données agrégées multi-coopératives
- **Acheteurs/exportateurs** — via ValueChain Connect, accèdent aux données de production certifiées

## Fonctionnalités clés (MVP)

### Module Membres
- Registre des producteurs (nom, contact, surface, cultures)
- GPS des parcelles (latitude/longitude)
- Statut actif/inactif par saison

### Module Collectes
- Enregistrement de chaque collecte (producteur, poids, qualité, date)
- Fonctionne 100% offline (IndexedDB/localStorage)
- Sync automatique quand réseau disponible

### Module Paiements
- Calcul du montant dû (prix × poids)
- Enregistrement des paiements (espèces, OM, Wave)
- Reçu imprimable/partageable

### Module Stocks
- Inventaire entrepôt coopérative (intrants + produits collectés)
- Alertes seuil minimum

### Rapports
- Bilan saison par coopérative
- Export PDF pour banques/acheteurs
- Historique multi-saisons

## Stack technique
```
Frontend    Next.js 15 (App Router) + TypeScript strict + Tailwind CSS
PWA         Workbox (offline-first, sync en arrière-plan)
Auth/DB     Supabase SSR + PostgreSQL + Realtime (sync)
UI          shadcn/ui + Framer Motion (spring animations)
Charts      Recharts (pattern `mounted` pour SSR)
Déploiement Vercel
Charte      Navy #0A1628, Gold #D4AF37, Cyan #00BCD4
Montants    formatMontant(montant, devise) — Intl.NumberFormat, devise du compte
```

## Intégration écosystème FORGE Afrika
- **AgroTrack → ValueChain Connect** : les coopératives peuvent lister leur production directement sur le marketplace B2B depuis AgroTrack
- **AgroTrack → TAAMA** : les données de matière première collectée alimentent les ERP des transformateurs TAAMA
- **AgroTrack → MillTrack** : les minoteries et huileries reçoivent les bons de livraison directement depuis AgroTrack
- **AgroTrack → FORGE Afrika HQ** : métriques (tonnage collecté, coopératives actives) remontées au dashboard groupe

## Feuille de route
### Phase 1 — Gestion membres et parcelles
Registre producteurs, GPS parcelles, interface offline-first validée sur le terrain.

### Phase 2 — Module collectes offline
Saisie terrain, sync automatique, conflit de données géré proprement.

### Phase 3 — Paiements et comptabilité coopérative
Calcul automatique, mobile money, reçus, bilan financier complet.

### Phase 4 — Sync multi-coopératives + dashboard fédération
Vue agrégée par fédération, export pour bailleurs et investisseurs.

## Métriques de succès
- Nombre de coopératives actives (cible Phase 1 : 10 coopératives pilotes)
- Nombre de membres enregistrés
- % de collectes saisies offline vs online
- Durée moyenne de sync (cible < 30 secondes)
- Réduction des disputes de paiement (mesure qualitative via retours terrain)

## Contraintes et décisions clés
- **Offline-first est non-négociable** — la connexion internet n'est pas un prérequis d'utilisation
- **Interface ultra-simple** — les agents de terrain ne sont pas des techniciens ; l'UX doit fonctionner avec un minimum de formation
- **RTK Proxy activé** — économiser les tokens Supabase Realtime en zone de faible connectivité
- **Pub/sub Realtime, jamais polling** — `setInterval` interdit, utiliser uniquement les canaux Supabase Realtime pour la sync
- **LAUNCH_CHECKLIST.md** doit être validée intégralement avant tout déploiement production

---
*PRD rédigé par Claude (COO) sur instruction de Steve Donald Compaore (PDG FORGE Afrika)*
*Dernière mise à jour : 2026-07-25*
