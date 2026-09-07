# Base de données AgroTrack BF

## Ce que contient ce dossier

| Fichier | Rôle |
|---|---|
| `migrations/20260907120000_noyau.sql` | Le schéma : coopératives, profils, membres, parcelles, collectes, paiements, et la RLS |
| `seed.sql` | Douze producteurs de démonstration, pour une base de développement |

## ⚠️ Rien de tout ceci n'a été appliqué

Ces fichiers ont été écrits, relus et versionnés. **Aucun projet Supabase n'a été
créé, aucune migration n'a été exécutée.** Créer une base est une action de
production ; elle appartient à Steeve.

Tant que la migration n'est pas appliquée, la page `/membres` affiche l'erreur
renvoyée par Supabase — c'est voulu : mieux vaut un message franc qu'une liste
vide qui ressemble à une coopérative sans membres.

## Appliquer

```bash
# 1. Créer le projet sur supabase.com, puis renseigner .env.local
#    NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY

# 2. Le schéma
psql "$DATABASE_URL" -f supabase/migrations/20260907120000_noyau.sql

# 3. Les données de démonstration — développement uniquement
psql "$DATABASE_URL" -f supabase/seed.sql

# 4. Rattacher ton compte à la coopérative de démonstration
#    (crée d'abord un compte via /auth/register)
psql "$DATABASE_URL" -c "update public.profils
  set cooperative_id = '11111111-1111-4111-8111-111111111111', role = 'gerant'
  where id = '<uuid de ton compte>';"
```

Le déclencheur sur `auth.users` demande les droits d'administration du projet :
il passe via `psql` avec l'URL de connexion directe, pas via la clé anonyme.

## Les trois décisions qui structurent le schéma

**1. Le FCFA est un entier.** `prix_unitaire_fcfa`, `montant_fcfa` : `integer`,
jamais `numeric(_, 2)`. Le XOF n'a pas de sous-unité — arrondir un paiement à
deux décimales n'est pas de la précision, c'est un bug qui attend son heure.
Les hectares, eux, gardent leurs décimales : ce sont des surfaces, pas de
l'argent.

**2. Une coopérative ne lit jamais les données d'une autre.** Chaque table porte
une `cooperative_id` et la RLS l'impose au niveau de Postgres, pas dans le code
des pages. La fonction `cooperative_courante()` est `security definer` pour
casser la récursion : sans elle, la politique de `profils` devrait interroger
`profils`. La clé anonyme circule dans le navigateur ; sans ces politiques, elle
lirait toute la base.

**3. `client_id` prépare la synchronisation hors ligne.** Le terminal génère
l'identifiant *avant* l'envoi. Si le réseau coupe pendant l'écriture et que
l'agent renvoie, la contrainte d'unicité `(cooperative_id, client_id)` fait
retomber le renvoi sur la même ligne au lieu d'enregistrer deux fois la même
collecte. C'est une colonne aujourd'hui ; ce serait une migration douloureuse
sur des données réelles plus tard. La Phase 2 du PRD s'appuiera dessus.

## Ce que le modèle change par rapport à la maquette

La maquette donnait à chaque membre **une** culture et **une** surface. Sur le
terrain, un producteur cultive du coton sur une parcelle et du sésame sur une
autre — c'est le cas normal.

Ici, la surface et la culture vivent sur la **parcelle**. La surface d'un membre
est la somme de ses parcelles, calculée à l'affichage (`agregerParcelles`), pas
stockée. Une donnée dérivée qu'on stocke est une donnée qui devient fausse.

Même raison pour le montant d'une collecte : `montant_collecte_fcfa()` est une
fonction, pas une colonne. Le jour où un prix est corrigé, les montants suivent.

## Ce qui manque encore

- **Les stocks** (module 4 du PRD) — pas de table, pas encore nécessaire.
- **La synchronisation hors ligne** — `client_id` et `saisie_hors_ligne` sont
  posés, mais il n'y a ni service worker, ni IndexedDB, ni file d'attente.
  C'est la Phase 2, et c'est le vrai chantier restant.
- **Les tests d'intégration** — impossibles sans base. Seule `agregerParcelles`,
  qui est pure, est couverte (9 tests).
