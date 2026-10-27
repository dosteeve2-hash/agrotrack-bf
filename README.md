<p align="center"><img src="docs/brand/mark.svg" alt="AgroTrack BF" width="72" height="72"></p>

<h1 align="center">🌾 AgroTrack BF</h1>

> Projet en développement : gestion de coopératives agricoles, conçue pour le terrain burkinabè. Le mode hors ligne est un objectif, pas encore une fonctionnalité livrée.

[![Status](https://img.shields.io/badge/Status-En%20d%C3%A9veloppement-blue)](https://agrotrack-bf.vercel.app)
[![Part of FORGE Afrika](https://img.shields.io/badge/FORGE%20Afrika-Ecosystem-D4AF37)](https://github.com/dosteeve2-hash/forge-afrika)
[![Demo](https://img.shields.io/badge/Demo-Voir%20live-D4AF37?style=for-the-badge)](https://agrotrack-bf.vercel.app)

## 🌍 Demo Live

**Site de présentation en ligne :** https://agrotrack-bf.vercel.app. Le tableau de bord est fermé en production.

> Dans le dépôt, le tableau de bord (membres, parcelles, collectes, paiements, etc.) existe sous forme d'écrans, mais aucune base Supabase n'est branchée ni aucune migration appliquée (voir `supabase/README.md`) : aucune coopérative réelle ne l'utilise.

## 🎯 Problème résolu

Les coopératives agricoles (coton, sésame, karité) gèrent encore leurs membres, stocks et transactions sur papier. Sans connectivité fiable, aucun outil SaaS existant ne fonctionne sur le terrain.

## 💡 Solution

AgroTrack BF vise à devenir une application offline-first (PWA) qui permettrait aux coopératives de :
- Enregistrer les membres et leurs parcelles
- Suivre les collectes et peser les récoltes
- Gérer les paiements aux producteurs
- Synchroniser les données quand la connexion revient

## 🎯 Cible

Coopératives coton et sésame, Burkina Faso.

## 🖥️ Fonctionnalités prévues

État : des écrans existent pour la plupart de ces modules (membres, parcelles, collectes, paiements, stocks, rapports), sans données réelles ; un export PDF de rapport existe, la synchronisation hors ligne n'est pas livrée.

| Module | Description |
|--------|-------------|
| Membres | Registre des producteurs + parcelles GPS |
| Collectes | Pesée et enregistrement des récoltes |
| Paiements | Calcul et traçabilité des paiements |
| Stocks | Inventaire entrepôt coopérative |
| Rapports | Bilan saison, export PDF |
| Sync | Synchronisation offline→online automatique |

## 🛠️ Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth + PostgreSQL, schéma versionné dans `supabase/migrations/`, non appliqué)
- Framer Motion, composants maison
- Vercel
- Prévu, pas encore en place : mode hors ligne (service worker, file de synchronisation), Realtime ; le dépôt n'a qu'un manifeste web

## 🌍 Écosystème FORGE Afrika

AgroTrack BF fait partie de [FORGE Afrika](https://github.com/dosteeve2-hash/forge-afrika) — l'infrastructure logicielle de l'industrialisation ouest-africaine.

**Produits liés :**
- [MillTrack](https://github.com/dosteeve2-hash/milltrack) — usines de transformation (TAAMA en est devenu le module Qualité)
- [ValueChain Connect](https://github.com/dosteeve2-hash/valuechain-connect) — Marketplace B2B

## 🚀 Roadmap

- [ ] Phase 1 : Gestion membres et parcelles
- [ ] Phase 2 : Module collectes offline
- [ ] Phase 3 : Paiements et comptabilité coopérative
- [ ] Phase 4 : Sync multi-coopératives + dashboard fédération

## 📬 Contact

**Steve Donald Compaore** — Fondateur FORGE Afrika  
docompaore2@gmail.com
