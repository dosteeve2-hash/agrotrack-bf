-- ============================================================================
-- AgroTrack — coopérative de développement, VIDE
--
-- Aucune donnée d'exemple : ni personne, ni lieu, ni chiffre inventé. Les anciens
-- producteurs et parcelles de démonstration ont été retirés. Ce fichier ne crée
-- qu'une coopérative vide, à laquelle rattacher un compte de test.
--
-- A charger sur une base de developpement, JAMAIS en production :
--   psql "$DATABASE_URL" -f supabase/seed.sql
--
-- Le rattachement d'un compte reste manuel, et volontairement :
--   update public.profils set cooperative_id = '11111111-1111-4111-8111-111111111111', role = 'gerant'
--   where id = '<uuid du compte>';
-- ============================================================================

insert into public.cooperatives (id, nom)
values ('11111111-1111-4111-8111-111111111111', 'Ma coopérative')
on conflict (id) do nothing;
