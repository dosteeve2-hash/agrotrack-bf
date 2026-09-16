import { createClient } from '@/lib/supabase/server'
import type { Culture, MembreRow, ParcelleRow, StatutMembre } from '@/lib/database.types'

/**
 * Un membre tel que l'ecran l'affiche : le producteur, plus ce que ses parcelles
 * disent de lui. La base ne stocke ni surface ni culture sur le membre — un
 * producteur peut cultiver du coton ici et du sesame la — donc l'agregation se
 * fait ici, une fois, au lieu d'etre refaite dans chaque composant.
 */
export interface MembreVue {
  id: string
  nom: string
  telephone: string | null
  village: string
  statut: StatutMembre
  dateAdhesion: string
  surfaceTotale: number
  cultures: Culture[]
}

/**
 * Ce que la page recoit. Le cas « compte non rattache a une cooperative » est
 * un etat a part entiere, pas une liste vide : un agent dont le gerant n'a pas
 * encore valide le compte doit lire pourquoi son ecran est vide.
 */
export type ResultatMembres =
  | { etat: 'ok'; membres: MembreVue[]; nomCooperative: string }
  | { etat: 'sans_cooperative' }
  | { etat: 'erreur'; message: string }

/** Pure, donc testable sans base. */
export function agregerParcelles(
  membres: Pick<MembreRow, 'id' | 'nom' | 'telephone' | 'village' | 'statut' | 'date_adhesion'>[],
  parcelles: Pick<ParcelleRow, 'membre_id' | 'culture' | 'surface_ha'>[],
): MembreVue[] {
  const parMembre = new Map<string, { surface: number; cultures: Set<Culture> }>()

  for (const p of parcelles) {
    const agg = parMembre.get(p.membre_id) ?? { surface: 0, cultures: new Set<Culture>() }
    // `surface_ha` arrive en chaine (numeric). Une valeur illisible ne doit pas
    // faire basculer le total a NaN et effacer les surfaces des autres parcelles.
    const surface = Number.parseFloat(p.surface_ha)
    if (Number.isFinite(surface)) agg.surface += surface
    agg.cultures.add(p.culture)
    parMembre.set(p.membre_id, agg)
  }

  return membres.map((m) => {
    const agg = parMembre.get(m.id)
    return {
      id: m.id,
      nom: m.nom,
      telephone: m.telephone,
      village: m.village,
      statut: m.statut,
      dateAdhesion: m.date_adhesion,
      // Deux decimales : des hectares, pas des francs. L'arrondi evite les
      // 3.7000000000000006 de l'addition flottante.
      surfaceTotale: agg ? Math.round(agg.surface * 100) / 100 : 0,
      cultures: agg ? [...agg.cultures].sort() : [],
    }
  })
}

export async function listerMembres(): Promise<ResultatMembres> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { etat: 'erreur', message: 'Session expirée.' }

  const { data: profil, error: errProfil } = await supabase
    .from('profils')
    .select('cooperative_id, cooperatives(nom)')
    .eq('id', user.id)
    .maybeSingle<{ cooperative_id: string | null; cooperatives: { nom: string } | null }>()

  if (errProfil) return { etat: 'erreur', message: errProfil.message }
  if (!profil?.cooperative_id) return { etat: 'sans_cooperative' }

  // La RLS restreint deja les deux requetes a la cooperative de l'appelant :
  // pas de filtre `cooperative_id` ici, il serait redondant et donnerait
  // l'illusion que la securite tient au code de la page.
  const [{ data: membres, error: errM }, { data: parcelles, error: errP }] = await Promise.all([
    supabase
      .from('membres')
      .select('id, nom, telephone, village, statut, date_adhesion')
      .order('nom'),
    supabase
      .from('parcelles')
      .select('membre_id, culture, surface_ha'),
  ])

  if (errM) return { etat: 'erreur', message: errM.message }
  if (errP) return { etat: 'erreur', message: errP.message }

  return {
    etat: 'ok',
    membres: agregerParcelles(membres ?? [], parcelles ?? []),
    nomCooperative: profil.cooperatives?.nom ?? 'Ma coopérative',
  }
}
