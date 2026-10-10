# 🌾 AgroTrack

> Suivi des récoltes et gestion de coopératives agricoles, offline-first. Indépendant du pays : chaque compte choisit son pays et sa devise.

[![Status](https://img.shields.io/badge/Status-En%20conception-blue)](.)
[![Part of FORGE Afrika](https://img.shields.io/badge/FORGE%20Afrika-Ecosystem-D4AF37)](https://github.com/dosteeve2-hash/forge-afrika)
[![Demo](https://img.shields.io/badge/Demo-Voir%20live-D4AF37?style=for-the-badge)](https://agrotrack-bf.vercel.app)

## 🌍 Demo Live

**Application live :** https://agrotrack-bf.vercel.app

> Gestion de coopératives agricoles offline-first — membres, collectes, paiements, sync automatique

## 🎯 Problème résolu

Les coopératives et exploitations agricoles gèrent encore leurs membres, stocks et transactions sur papier. Sans connectivité fiable, aucun outil SaaS existant ne fonctionne sur le terrain.

## 💡 Solution

AgroTrack est une PWA offline-first qui permet aux coopératives de :
- Enregistrer les membres et leurs parcelles
- Suivre les collectes et peser les récoltes
- Gérer les paiements aux producteurs
- Synchroniser les données quand la connexion revient

## 🎯 Cible

Coopératives et exploitations agricoles, quel que soit le pays : le premier marché n'est pas encore choisi, l'outil s'adapte (pays, devise, cultures libres).

## 🖥️ Fonctionnalités prévues

| Module | Description |
|--------|-------------|
| Membres | Registre des producteurs + parcelles GPS |
| Collectes | Pesée et enregistrement des récoltes |
| Paiements | Calcul et traçabilité des paiements |
| Stocks | Inventaire entrepôt coopérative |
| Rapports | Bilan saison, export PDF |
| Sync | Synchronisation offline→online automatique |

## 🛠️ Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Realtime + offline sync)
- PWA (Workbox) — offline-first
- shadcn/ui + Framer Motion
- Vercel

## 🌍 Écosystème FORGE Afrika

AgroTrack fait partie de [FORGE Afrika](https://github.com/dosteeve2-hash/forge-afrika) — l'infrastructure logicielle de l'industrialisation ouest-africaine.

**Produits liés :**
- [TAAMA](https://github.com/dosteeve2-hash/taama) — ERP PMEs transformation
- [ValueChain Connect](https://github.com/dosteeve2-hash/valuechain-connect) — Marketplace B2B

## 🚀 Roadmap

- [ ] Phase 1 : Gestion membres et parcelles
- [ ] Phase 2 : Module collectes offline
- [ ] Phase 3 : Paiements et comptabilité coopérative
- [ ] Phase 4 : Sync multi-coopératives + dashboard fédération

## 📬 Contact

**Steve Donald Compaore** — Fondateur FORGE Afrika  
docompaore2@gmail.com
