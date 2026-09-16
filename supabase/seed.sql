-- ============================================================================
-- AgroTrack BF — jeu de donnees de demarrage
--
-- Ces douze producteurs vivaient jusqu'ici en dur dans
-- `app/(dashboard)/membres/membres.data.ts`, sous le nom `MEMBRES_INIT`. Ils
-- etaient une maquette ; ils deviennent des lignes. C'est la meme donnee, mais
-- elle passe du cote ou on peut la modifier, la filtrer et la sauvegarder.
--
-- A charger sur une base de developpement, JAMAIS en production :
--   psql "$DATABASE_URL" -f supabase/seed.sql
--
-- Le rattachement d'un compte a cette cooperative reste manuel, et volontairement :
--   update public.profils set cooperative_id = '11111111-1111-4111-8111-111111111111', role = 'gerant'
--   where id = '<uuid du compte>';
-- ============================================================================

insert into public.cooperatives (id, nom, sigle, region, province, commune, telephone)
values ('11111111-1111-4111-8111-111111111111', 'Cooperative agricole de Koudougou', 'CAK',
        'Centre-Ouest', 'Boulkiemde', 'Koudougou', '+226 25 44 00 00')
on conflict (id) do nothing;

insert into public.membres (id, cooperative_id, nom, telephone, village, statut, date_adhesion)
values
  ('22222222-2222-4222-8222-000000000001', '11111111-1111-4111-8111-111111111111', 'Ouédraogo Adama', '+226 70 11 22 33', 'Koudougou', 'actif', '2023-03-15'),
  ('22222222-2222-4222-8222-000000000002', '11111111-1111-4111-8111-111111111111', 'Sawadogo Fatima', '+226 76 44 55 66', 'Réo', 'actif', '2023-05-20'),
  ('22222222-2222-4222-8222-000000000003', '11111111-1111-4111-8111-111111111111', 'Kaboré Ibrahim', '+226 65 77 88 99', 'Didyr', 'actif', '2022-11-08'),
  ('22222222-2222-4222-8222-000000000004', '11111111-1111-4111-8111-111111111111', 'Zongo Marie', '+226 71 22 33 44', 'Koudougou', 'inactif', '2022-09-01'),
  ('22222222-2222-4222-8222-000000000005', '11111111-1111-4111-8111-111111111111', 'Traoré Seydou', '+226 78 99 00 11', 'Bobo-Dioulasso', 'actif', '2021-06-14'),
  ('22222222-2222-4222-8222-000000000006', '11111111-1111-4111-8111-111111111111', 'Diallo Aminata', '+226 72 33 44 55', 'Banfora', 'actif', '2023-01-10'),
  ('22222222-2222-4222-8222-000000000007', '11111111-1111-4111-8111-111111111111', 'Compaoré Jean', '+226 66 55 44 33', 'Dédougou', 'actif', '2022-07-22'),
  ('22222222-2222-4222-8222-000000000008', '11111111-1111-4111-8111-111111111111', 'Yago Sylvie', '+226 75 88 99 00', 'Bobo-Dioulasso', 'actif', '2024-02-05'),
  ('22222222-2222-4222-8222-000000000009', '11111111-1111-4111-8111-111111111111', 'Sawadogo Moussa', '+226 70 77 66 55', 'Ouahigouya', 'actif', '2022-04-18'),
  ('22222222-2222-4222-8222-000000000010', '11111111-1111-4111-8111-111111111111', 'Tapsoba Alimata', '+226 71 44 33 22', 'Dédougou', 'inactif', '2021-12-01'),
  ('22222222-2222-4222-8222-000000000011', '11111111-1111-4111-8111-111111111111', 'Ouédraogo Rasmané', '+226 78 11 22 33', 'Koudougou', 'actif', '2023-08-30'),
  ('22222222-2222-4222-8222-000000000012', '11111111-1111-4111-8111-111111111111', 'Koné Mariam', '+226 76 55 66 77', 'Banfora', 'actif', '2024-01-15')
on conflict (id) do nothing;

-- Une parcelle par membre pour demarrer. Le modele en accepte plusieurs — c'est
-- meme le cas normal sur le terrain — mais la maquette n'en connaissait qu'une.
--
-- Le village n'apparait pas ici : il vient du membre. Le nom de la parcelle le
-- reprend par commodite d'affichage, mais la verite reste sur le producteur.
insert into public.parcelles (
  id, cooperative_id, membre_id, nom, culture, surface_ha, type_sol, statut,
  date_plantation, date_recolte_estimee, rendement_estime_kg_ha, irrigation)
values
  ('33333333-3333-4333-8333-000000000001', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000001', 'Parcelle Koudougou A', 'coton', 3.2, 'lateritique', 'active', '2026-05-15', '2026-09-10', 1800, true),
  ('33333333-3333-4333-8333-000000000002', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000002', 'Parcelle Réo B', 'sesame', 1.8, 'argilo_sableux', 'active', '2026-06-01', '2026-10-15', 1200, false),
  ('33333333-3333-4333-8333-000000000003', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000003', 'Parcelle Didyr C', 'coton', 4.5, 'sablonneux', 'active', '2026-05-20', '2026-11-01', 900, false),
  ('33333333-3333-4333-8333-000000000004', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000004', 'Parcelle Koudougou D', 'karite', 2.1, 'lateritique', 'en_preparation', '2026-06-10', '2026-10-20', 800, false),
  ('33333333-3333-4333-8333-000000000005', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000005', 'Parcelle Bobo-Dioulasso E', 'mais', 6.0, 'lateritique', 'active', '2026-05-25', '2026-09-05', 700, false),
  ('33333333-3333-4333-8333-000000000006', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000006', 'Parcelle Banfora F', 'coton', 2.8, 'argilo_sableux', 'active', '2026-06-15', '2026-09-30', 600, true),
  ('33333333-3333-4333-8333-000000000007', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000007', 'Parcelle Dédougou G', 'sorgho', 5.3, 'sablonneux', 'active', '2026-06-05', '2026-09-25', 1100, false),
  ('33333333-3333-4333-8333-000000000008', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000008', 'Parcelle Bobo-Dioulasso H', 'mil', 1.5, 'lateritique', 'recoltee', '2025-10-01', '2026-02-15', 1300, false),
  ('33333333-3333-4333-8333-000000000009', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000009', 'Parcelle Ouahigouya I', 'mil', 3.8, 'lateritique', 'en_repos', '2026-06-20', '2026-10-10', 1600, true),
  ('33333333-3333-4333-8333-000000000010', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000010', 'Parcelle Dédougou J', 'coton', 2.4, 'argilo_sableux', 'en_preparation', '2026-07-01', '2026-11-15', 750, false),
  ('33333333-3333-4333-8333-000000000011', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000011', 'Parcelle Koudougou K', 'sorgho', 4.1, 'sablonneux', 'active', '2026-05-18', '2026-10-05', 1400, false),
  ('33333333-3333-4333-8333-000000000012', '11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-000000000012', 'Parcelle Banfora L', 'sesame', 0.9, 'lateritique', 'active', '2026-06-08', '2026-09-28', 950, false)
on conflict (id) do nothing;
