import { createClient } from '@/lib/supabase/server'
import { versVue, type LigneJointe, type ParcelleVue } from './parcelles.model'

export type { ParcelleVue } from './parcelles.model'
export { versVue, rendementMoyen } from './parcelles.model'

export type ResultatParcelles =
  | { etat: 'ok'; parcelles: ParcelleVue[] }
  | { etat: 'sans_cooperative' }
  | { etat: 'erreur'; message: string }

export async function listerParcelles(): Promise<ResultatParcelles> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { etat: 'erreur', message: 'Session expirée.' }

  const { data: profil, error: errProfil } = await supabase
    .from('profils')
    .select('cooperative_id')
    .eq('id', user.id)
    .maybeSingle<{ cooperative_id: string | null }>()

  if (errProfil) return { etat: 'erreur', message: errProfil.message }
  if (!profil?.cooperative_id) return { etat: 'sans_cooperative' }

  // La RLS restreint deja la requete a la cooperative de l'appelant.
  const { data, error } = await supabase
    .from('parcelles')
    .select(`
      id, nom, culture, surface_ha, type_sol, statut,
      date_plantation, date_recolte_estimee, rendement_estime_kg_ha,
      irrigation, notes,
      membres ( nom, village )
    `)
    .order('nom')
    .returns<LigneJointe[]>()

  if (error) return { etat: 'erreur', message: error.message }

  return { etat: 'ok', parcelles: versVue(data ?? []) }
}
