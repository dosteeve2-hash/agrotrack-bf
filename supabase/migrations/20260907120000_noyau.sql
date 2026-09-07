-- ============================================================================
-- AgroTrack BF — le noyau de donnees
--
-- Phase 1 du PRD : membres et parcelles. Les collectes et les paiements sont
-- crees ici aussi, parce que leurs cles etrangeres decident de la forme des
-- deux premieres tables et qu'il vaut mieux les poser d'un coup que de les
-- retrofitter.
--
-- Trois principes traversent tout ce fichier :
--
--   1. Le FCFA (XOF) n'a pas de sous-unite. Tous les montants sont des entiers.
--      Jamais de numeric(_, 2) : un arrondi a deux decimales sur du XOF est un
--      bug, pas une precision.
--   2. Chaque ligne appartient a une cooperative, et la RLS l'impose. Une
--      cooperative ne doit jamais pouvoir lire les membres d'une autre.
--   3. `client_id` prepare la synchronisation hors ligne (Phase 2 du PRD). Le
--      terminal genere l'identifiant avant l'envoi ; un renvoi apres coupure
--      reseau retombe sur la meme ligne au lieu d'en creer une deuxieme.
--      Une colonne aujourd'hui, une migration douloureuse plus tard.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Cooperatives ────────────────────────────────────────────────────────────

create table public.cooperatives (
  id           uuid primary key default gen_random_uuid(),
  nom          text not null,
  sigle        text,
  region       text,
  province     text,
  commune      text,
  telephone    text,
  creee_le     timestamptz not null default now()
);

comment on table public.cooperatives is
  'Le locataire. Toute autre table porte une cooperative_id et la RLS s''y adosse.';

-- ── Profils (auth.users -> cooperative) ─────────────────────────────────────

create type public.role_utilisateur as enum ('gerant', 'agent');

create table public.profils (
  id             uuid primary key references auth.users(id) on delete cascade,
  cooperative_id uuid references public.cooperatives(id) on delete restrict,
  nom_complet    text,
  role           public.role_utilisateur not null default 'agent',
  creee_le       timestamptz not null default now()
);

comment on column public.profils.cooperative_id is
  'Nul tant qu''un gerant n''a pas rattache le compte. Un profil sans cooperative
   ne voit rien — c''est voulu, et l''application doit le dire clairement plutot
   que d''afficher une liste vide.';

-- Un compte cree par signup obtient son profil, sans cooperative.
create or replace function public.creer_profil_a_l_inscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profils (id, nom_complet)
  values (new.id, new.raw_user_meta_data ->> 'nom_complet');
  return new;
end;
$$;

create trigger inscription_cree_profil
  after insert on auth.users
  for each row execute function public.creer_profil_a_l_inscription();

-- La cooperative de l'appelant. `security definer` casse la recursion : sans
-- elle, la politique de `profils` devrait interroger `profils`.
create or replace function public.cooperative_courante()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select cooperative_id from public.profils where id = auth.uid()
$$;

create or replace function public.est_gerant()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role = 'gerant' from public.profils where id = auth.uid()), false)
$$;

-- ── Membres ─────────────────────────────────────────────────────────────────

create type public.statut_membre as enum ('actif', 'inactif');

create table public.membres (
  id             uuid primary key default gen_random_uuid(),
  cooperative_id uuid not null references public.cooperatives(id) on delete cascade,
  client_id      uuid not null default gen_random_uuid(),
  nom            text not null check (length(trim(nom)) > 0),
  telephone      text,
  village        text not null,
  statut         public.statut_membre not null default 'actif',
  date_adhesion  date not null default current_date,
  creee_le       timestamptz not null default now(),
  modifiee_le    timestamptz not null default now(),
  unique (cooperative_id, client_id)
);

create index membres_cooperative_idx on public.membres (cooperative_id);
create index membres_village_idx     on public.membres (cooperative_id, village);

comment on table public.membres is
  'Les producteurs. La surface et les cultures ne sont PAS ici : elles vivent sur
   les parcelles. Un producteur qui cultive du coton sur une parcelle et du
   sesame sur une autre est le cas normal, pas l''exception.';

-- ── Parcelles ───────────────────────────────────────────────────────────────

create type public.culture as enum
  ('mil', 'sorgho', 'mais', 'coton', 'sesame', 'karite', 'arachide', 'niebe');

create table public.parcelles (
  id             uuid primary key default gen_random_uuid(),
  cooperative_id uuid not null references public.cooperatives(id) on delete cascade,
  membre_id      uuid not null references public.membres(id) on delete cascade,
  client_id      uuid not null default gen_random_uuid(),
  nom            text,
  culture        public.culture not null,
  surface_ha     numeric(6, 2) not null check (surface_ha > 0),
  latitude       numeric(9, 6),
  longitude      numeric(9, 6),
  creee_le       timestamptz not null default now(),
  modifiee_le    timestamptz not null default now(),
  unique (cooperative_id, client_id),
  -- Le GPS est facultatif, mais pas a moitie : une latitude sans longitude
  -- ne situe rien.
  check ((latitude is null) = (longitude is null))
);

create index parcelles_membre_idx on public.parcelles (membre_id);

comment on column public.parcelles.surface_ha is
  'Des hectares, pas des francs : les decimales sont ici legitimes.';

-- ── Collectes ───────────────────────────────────────────────────────────────

create type public.statut_collecte as enum ('en_attente', 'validee', 'rejetee');

create table public.collectes (
  id                  uuid primary key default gen_random_uuid(),
  cooperative_id      uuid not null references public.cooperatives(id) on delete cascade,
  membre_id           uuid not null references public.membres(id) on delete restrict,
  parcelle_id         uuid references public.parcelles(id) on delete set null,
  client_id           uuid not null default gen_random_uuid(),
  culture             public.culture not null,
  quantite_kg         numeric(10, 2) not null check (quantite_kg > 0),
  prix_unitaire_fcfa  integer not null check (prix_unitaire_fcfa >= 0),
  date_collecte       date not null default current_date,
  statut              public.statut_collecte not null default 'en_attente',
  lot_ref             text,
  note                text,
  saisie_hors_ligne   boolean not null default false,
  creee_le            timestamptz not null default now(),
  modifiee_le         timestamptz not null default now(),
  unique (cooperative_id, client_id)
);

create index collectes_membre_idx on public.collectes (membre_id);
create index collectes_date_idx   on public.collectes (cooperative_id, date_collecte desc);

comment on column public.collectes.prix_unitaire_fcfa is
  'FCFA par kilo, en entier. Le XOF n''a pas de centime.';
comment on column public.collectes.saisie_hors_ligne is
  'Vrai si la ligne a ete saisie sans reseau puis synchronisee. Le PRD veut
   mesurer le pourcentage de collectes saisies hors ligne : c''est cette colonne
   qui le permettra, et elle ne peut pas etre reconstituee apres coup.';

-- Le montant du est un calcul, pas une donnee : le stocker, c'est accepter
-- qu'il devienne faux le jour ou le prix est corrige.
create or replace function public.montant_collecte_fcfa(public.collectes)
returns integer
language sql
immutable
as $$
  select round($1.quantite_kg * $1.prix_unitaire_fcfa)::integer
$$;

-- ── Paiements ───────────────────────────────────────────────────────────────

create type public.moyen_paiement as enum ('especes', 'orange_money', 'wave', 'virement');

create table public.paiements (
  id             uuid primary key default gen_random_uuid(),
  cooperative_id uuid not null references public.cooperatives(id) on delete cascade,
  membre_id      uuid not null references public.membres(id) on delete restrict,
  collecte_id    uuid references public.collectes(id) on delete set null,
  client_id      uuid not null default gen_random_uuid(),
  montant_fcfa   integer not null check (montant_fcfa > 0),
  moyen          public.moyen_paiement not null,
  reference      text,
  date_paiement  date not null default current_date,
  creee_le       timestamptz not null default now(),
  unique (cooperative_id, client_id)
);

create index paiements_membre_idx on public.paiements (membre_id);

comment on column public.paiements.montant_fcfa is
  'Entier. Un paiement de 12 500 FCFA vaut 12500, jamais 12500.00.';

-- ── modifiee_le ─────────────────────────────────────────────────────────────

create or replace function public.touche_modifiee_le()
returns trigger language plpgsql as $$
begin
  new.modifiee_le := now();
  return new;
end;
$$;

create trigger membres_modifiee_le   before update on public.membres
  for each row execute function public.touche_modifiee_le();
create trigger parcelles_modifiee_le before update on public.parcelles
  for each row execute function public.touche_modifiee_le();
create trigger collectes_modifiee_le before update on public.collectes
  for each row execute function public.touche_modifiee_le();

-- ── RLS ─────────────────────────────────────────────────────────────────────
-- Sans ces politiques, la cle anonyme lit toute la base depuis le navigateur.

alter table public.cooperatives enable row level security;
alter table public.profils      enable row level security;
alter table public.membres      enable row level security;
alter table public.parcelles    enable row level security;
alter table public.collectes    enable row level security;
alter table public.paiements    enable row level security;

create policy "sa cooperative" on public.cooperatives
  for select using (id = public.cooperative_courante());

create policy "son profil" on public.profils
  for select using (id = auth.uid());
create policy "profils de sa cooperative" on public.profils
  for select using (cooperative_id = public.cooperative_courante());
create policy "un gerant rattache les comptes" on public.profils
  for update using (public.est_gerant() and cooperative_id = public.cooperative_courante())
  with check (cooperative_id = public.cooperative_courante());

-- Une seule instruction par EXECUTE : PL/pgSQL accepte parfois plusieurs
-- commandes dans une meme chaine, mais s'appuyer dessus rend l'echec muet.
do $$
declare t text;
begin
  foreach t in array array['membres', 'parcelles', 'collectes', 'paiements'] loop
    execute format(
      'create policy "lecture cooperative" on public.%I
         for select using (cooperative_id = public.cooperative_courante())', t);
    execute format(
      'create policy "ecriture cooperative" on public.%I
         for insert with check (cooperative_id = public.cooperative_courante())', t);
    execute format(
      'create policy "mise a jour cooperative" on public.%I
         for update using (cooperative_id = public.cooperative_courante())
         with check (cooperative_id = public.cooperative_courante())', t);
    execute format(
      'create policy "suppression reservee au gerant" on public.%I
         for delete using (public.est_gerant()
                           and cooperative_id = public.cooperative_courante())', t);
  end loop;
end $$;
