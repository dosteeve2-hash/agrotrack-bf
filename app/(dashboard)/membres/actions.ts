'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { nettoyerCulture } from '@/lib/cultures'

export interface ResultatAjout {
  ok: boolean
  message?: string
}

/**
 * Ajoute un producteur et sa premiere parcelle.
 *
 * L'utilisateur est revalide ici et pas seulement dans le layout : une Server
 * Action est une route a part entiere, appelable directement, et ne herite
 * d'aucune verification faite ailleurs.
 */
export async function ajouterMembre(donnees: FormData): Promise<ResultatAjout> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, message: 'Session expirée. Reconnecte-toi.' }

  const { data: profil } = await supabase
    .from('profils')
    .select('cooperative_id')
    .eq('id', user.id)
    .maybeSingle<{ cooperative_id: string | null }>()

  if (!profil?.cooperative_id) {
    return { ok: false, message: 'Ton compte n’est rattaché à aucune coopérative.' }
  }

  const nom = String(donnees.get('nom') ?? '').trim()
  const village = String(donnees.get('village') ?? '').trim()
  const telephone = String(donnees.get('telephone') ?? '').trim()
  const culture = nettoyerCulture(String(donnees.get('culture') ?? ''))
  const surface = Number.parseFloat(String(donnees.get('surface') ?? ''))

  if (!nom) return { ok: false, message: 'Le nom est obligatoire.' }
  if (!village) return { ok: false, message: 'Le village est obligatoire.' }
  if (!culture) return { ok: false, message: 'La culture est obligatoire.' }
  if (!Number.isFinite(surface) || surface <= 0) {
    return { ok: false, message: 'La surface doit être un nombre supérieur à 0.' }
  }

  const { data: membre, error: errMembre } = await supabase
    .from('membres')
    .insert({
      cooperative_id: profil.cooperative_id,
      nom,
      village,
      telephone: telephone || null,
    })
    .select('id')
    .single<{ id: string }>()

  if (errMembre || !membre) {
    return { ok: false, message: errMembre?.message ?? 'Enregistrement impossible.' }
  }

  const { error: errParcelle } = await supabase.from('parcelles').insert({
    cooperative_id: profil.cooperative_id,
    membre_id: membre.id,
    culture,
    surface_ha: surface,
  })

  if (errParcelle) {
    // Le membre existe, sa parcelle non. On le dit au lieu de laisser l'ecran
    // afficher une surface de 0 ha sans explication.
    return {
      ok: false,
      message: `Membre enregistré, mais sa parcelle a échoué : ${errParcelle.message}`,
    }
  }

  revalidatePath('/membres')
  return { ok: true }
}
