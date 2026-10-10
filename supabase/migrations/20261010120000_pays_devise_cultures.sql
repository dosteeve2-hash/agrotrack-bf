-- ============================================================================
-- AgroTrack — un produit indépendant du pays
--
-- NON APPLIQUÉE : ce dépôt n'a pas de projet Supabase correspondant. Ce fichier
-- est la spécification exécutable du schéma ; l'appliquer est une action de
-- production qui appartient au fondateur (voir supabase/README.md).
--
-- Ce que fait cette migration, et rien d'autre :
--   1. Pays, devise et coordonnées facultatives sur `cooperatives`.
--   2. Un gérant peut modifier sa coopérative (avant : lecture seule).
--   3. Fin des énumérations fermées : culture, type de sol et moyen de paiement
--      deviennent du texte, avec une liste de suggestions côté application.
--
-- Idempotente : on peut la rejouer sans erreur.
-- Une seule devise par compte, sans conversion.
-- ============================================================================

-- ── 1. Pays, devise, coordonnées ────────────────────────────────────────────

alter table public.cooperatives
  add column if not exists pays_code  text check (pays_code ~ '^[A-Z]{2}$'),
  add column if not exists devise_code text check (devise_code ~ '^[A-Z]{3}$'),
  add column if not exists latitude   numeric(9, 6) check (latitude  between -90  and 90),
  add column if not exists longitude  numeric(9, 6) check (longitude between -180 and 180);

-- Le GPS est facultatif, mais pas à moitié (même règle que `parcelles`).
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'cooperatives_coordonnees_completes'
      and conrelid = 'public.cooperatives'::regclass
  ) then
    alter table public.cooperatives
      add constraint cooperatives_coordonnees_completes
      check ((latitude is null) = (longitude is null));
  end if;
end $$;

comment on column public.cooperatives.pays_code is
  'ISO 3166-1 alpha-2. Nul tant que le compte n''a pas choisi son pays.';
comment on column public.cooperatives.devise_code is
  'ISO 4217. UNE devise par compte, sans conversion : tous les montants de la
   coopérative sont exprimés dans cette devise.';
comment on column public.cooperatives.latitude is
  'Facultative. Sans coordonnées, les fonctions qui en dépendent (météo, plus tard)
   affichent « bientôt disponible » ; le reste de l''application fonctionne.';

-- Les lignes existantes ont été saisies avec des colonnes *_fcfa : leur devise
-- est connue, ce n'est pas une supposition.
update public.cooperatives set devise_code = 'XOF' where devise_code is null;

-- ── 2. Un gérant modifie sa coopérative ─────────────────────────────────────

drop policy if exists "un gerant modifie sa cooperative" on public.cooperatives;
create policy "un gerant modifie sa cooperative" on public.cooperatives
  for update using (public.est_gerant() and id = public.cooperative_courante())
  with check (id = public.cooperative_courante());

-- ── 3. Fin des énumérations fermées ─────────────────────────────────────────
-- Un `enum` Postgres ne s'étend pas par pays sans migration. Les valeurs déjà
-- stockées ('coton', 'sesame', 'orange_money'…) sont conservées telles quelles ;
-- l'application sait les afficher (lib/database.types.ts) et accepte tout
-- nouveau texte saisi par l'utilisateur.

do $$
begin
  if (select data_type from information_schema.columns
      where table_schema = 'public' and table_name = 'parcelles' and column_name = 'culture')
     = 'USER-DEFINED' then
    alter table public.parcelles alter column culture type text using culture::text;
    alter table public.collectes alter column culture type text using culture::text;
  end if;

  if (select data_type from information_schema.columns
      where table_schema = 'public' and table_name = 'parcelles' and column_name = 'type_sol')
     = 'USER-DEFINED' then
    alter table public.parcelles alter column type_sol type text using type_sol::text;
  end if;

  if (select data_type from information_schema.columns
      where table_schema = 'public' and table_name = 'paiements' and column_name = 'moyen')
     = 'USER-DEFINED' then
    alter table public.paiements alter column moyen type text using moyen::text;
  end if;
end $$;

drop type if exists public.culture;
drop type if exists public.type_sol;
drop type if exists public.moyen_paiement;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'parcelles_culture_non_vide') then
    alter table public.parcelles
      add constraint parcelles_culture_non_vide check (length(trim(culture)) between 1 and 60);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'collectes_culture_non_vide') then
    alter table public.collectes
      add constraint collectes_culture_non_vide check (length(trim(culture)) between 1 and 60);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'parcelles_type_sol_borne') then
    alter table public.parcelles
      add constraint parcelles_type_sol_borne check (type_sol is null or length(trim(type_sol)) between 1 and 60);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'paiements_moyen_non_vide') then
    alter table public.paiements
      add constraint paiements_moyen_non_vide check (length(trim(moyen)) between 1 and 60);
  end if;
end $$;

-- ── À FAIRE PLUS TARD (volontairement NON exécuté ici) ──────────────────────
-- Les colonnes `prix_unitaire_fcfa` (collectes) et `montant_fcfa` (paiements) et
-- la fonction `montant_collecte_fcfa()` gardent leur nom : les renommer dans une
-- base qui n'existe pas encore n'apporterait rien et casserait le code qui les
-- lit. Le jour où une base réelle existe, migrer en deux temps :
--
--   -- Temps 1 : ajouter, recopier, basculer le code.
--   --   alter table public.collectes add column prix_unitaire numeric(14, 4);
--   --   alter table public.paiements add column montant       numeric(14, 4);
--   --   update public.collectes set prix_unitaire = prix_unitaire_fcfa;
--   --   update public.paiements set montant       = montant_fcfa;
--   --   La devise n'est PAS dupliquée sur chaque ligne : une seule devise par
--   --   compte, elle vit sur `cooperatives.devise_code`.
--   --   Remplacer montant_collecte_fcfa(public.collectes) par une fonction
--   --   `montant_collecte` calculée sur `prix_unitaire`.
--   -- Temps 2 (migration ultérieure, après vérification) : retirer les anciennes
--   --   colonnes et la fonction `montant_collecte_fcfa`.
--
-- Changer la devise d'un compte qui a déjà des montants ne convertit RIEN : les
-- chiffres gardent leur valeur, seul le symbole change. L'interface l'avertit.
