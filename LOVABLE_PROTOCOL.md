# AgroTrack BF — Lovable Protocol

## Vision
AgroTrack BF est la PWA offline-first qui digitalise les coopératives agricoles burkinabèses. Des champs de coton de la Boucle du Mouhoun aux marchés de sésame du Sahel, elle permet aux agents de coopérative d'enregistrer membres, collectes et paiements sans connexion internet — avec sync automatique dès le retour du réseau.

## URL de production
https://agrotrack-bf.vercel.app

## Utilisateurs cibles
- **Persona 1 — Hamidou, Agent de coopérative coton (Dédougou)** : Collecte 80 producteurs sur le terrain. Réseau GSM faible. Besoin : saisir les pesées offline sur smartphone, sync auto le soir au village.
- **Persona 2 — Fatoumata, Directrice coopérative sésame (Kaya)** : Gère 200 membres. Besoin : voir les bilans de saison, payer les producteurs, générer les rapports pour SOFITEX et les ONG.
- **Persona 3 — Drissa, Superviseur fédération (Ouagadougou)** : Suit 15 coopératives membres. Besoin : dashboard consolidé, alertes anomalies, exports PDF pour bailleurs.

## Fonctionnalités core
### P0 (MVP live)
- Registre membres et parcelles (nom, surface, GPS, culture)
- Enregistrement collectes et pesées (offline-first, IndexedDB)
- Calcul et traçabilité des paiements producteurs
- Inventaire entrepôt coopérative
- Rapports bilan de saison (export PDF via jsPDF)
- Synchronisation offline→online automatique (Supabase Realtime)

### P1 (prochaine itération)
- PWA installable sur Android (manifest, Service Worker, cache offline complet)
- QR codes membres pour identification terrain rapide
- Module intrants (distribution engrais, semences) avec déduction sur paiement
- Notifications sync réussie / conflits détectés
- Dashboard superviseur multi-coopératives

### P2 (roadmap)
- Géolocalisation parcelles sur carte (Leaflet.js)
- Intégration Mobile Money (paiements directement depuis l'app)
- API SOFITEX / UNPCB pour transmission automatique données
- Prévisions météo intégrées (alertes sécheresse, dates semis)
- Mode multi-langues (français + mooré + dioula)

## Design System
- **Couleurs** : Navy `#0A1628`, Gold `#D4AF37`, Cyan `#00BCD4`
- **Typographie** : Inter / Geist
- **Animations** : Framer Motion (fadeInUp, transitions)
- **Icônes** : Lucide React
- **Charts** : Recharts (bilans saison, volumes collectés)
- **PDF** : jsPDF

## Stack Technique
- **Frontend** : Next.js 16 (App Router), React 19, TypeScript
- **Styles** : Tailwind CSS v4
- **Animations** : Framer Motion v12
- **Backend** : Supabase (PostgreSQL, Auth, Realtime)
- **Offline** : PWA (Service Worker, IndexedDB / Supabase offline sync)
- **PDF** : jsPDF
- **Charts** : Recharts
- **Icônes** : Lucide React
- **Déploiement** : Vercel

## Modèle de données

### Table `members`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| coop_id | uuid | FK cooperatives |
| full_name | text | Nom complet |
| phone | text | Téléphone Mobile Money |
| village | text | Village |
| plot_area_ha | numeric | Surface parcelle (hectares) |
| culture | text | coton / sesame / karite |
| gps_lat / gps_lng | numeric | Coordonnées parcelle |

### Table `collections`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| member_id | uuid | FK members |
| season | text | 2024-2025 |
| weight_kg | numeric | Poids récolte (kg) |
| quality_grade | text | Grade (A/B/C) |
| collected_at | timestamp | Date/heure pesée |
| synced | boolean | false si offline |

### Table `payments`
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | PK |
| member_id | uuid | FK members |
| amount_fcfa | numeric | Montant FCFA |
| payment_method | text | cash / mobile_money |
| paid_at | timestamp | Date paiement |
| season | text | Saison concernée |

## Flux utilisateur clé — Collecte sésame sur le terrain

1. Hamidou arrive au champ sans réseau → ouvre AgroTrack BF (PWA installée)
2. Recherche Konaté Seydou dans le registre membres (offline)
3. Saisit pesée : 185 kg grade A → enregistrement local IndexedDB
4. Continue avec 12 autres producteurs → tout stocké offline
5. Soir : retour au village avec connexion 3G → sync automatique Supabase
6. Fatoumata voit les données sur son dashboard le lendemain matin

## Critères de succès
- Fonctionne 100% offline (0 requête réseau pour saisie terrain)
- Sync sans perte de données en cas de coupure pendant la synchronisation
- Interface utilisable sur smartphone Android entrée de gamme (3 Go RAM)
- Score Lighthouse PWA > 90
- Rapport PDF bilan saison généré en < 3 secondes

---
*Lovable Protocol v1.0 — FORGE Afrika © 2025 — Steeve Donald Compaore*
