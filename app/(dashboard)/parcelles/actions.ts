'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Culture, StatutParcelle, TypeSol } from '@/lib/database.types'

export interface ResultatCreation {
  ok: boolean
  message?: string
}

const CULTURES: readonly Culture[] =
  ['mil', 'sorgho', 'mais', 'coton', 'sesame', 'karite', 'arachide', 'niebe']
const SOLS: readonly TypeSol[] =
  ['lateritique', 'argilo_sableux', 'sablonneux', 'limoneux']
const STATUTS: readonly StatutParcelle[] =
  ['active', 'en_repos', 'en_preparation', 'recoltee']

/** Une chaine vide venant d'un `<input type="date">` vide vaut « pas de date ». */
function dateOuNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? '').trim()
  return s === '' ? null : s
}

export async function creerParcelle(donnees: FormData): Promise<ResultatCreation> {
  const supabase = await createClient()

  // Une Server Action est une route a part entiere : elle revalide
  // l'utilisateur elle-meme et n'herite d'aucune verification du layout.
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
  const membreId = String(donnees.get('membre_id') ?? '')
  const culture = String(donnees.get('culture') ?? '')
  const typeSol = String(donnees.get('type_sol') ?? '')
  const statut = String(donnees.get('statut') ?? '')
  const superficie = Number.parseFloat(String(donnees.get('superficie') ?? ''))
  const rendementBrut = String(donnees.get('rendement_estime') ?? '').trim()
  const rendement = rendementBrut === '' ? null : Number.parseInt(rendementBrut, 10)
  const plantation = dateOuNull(donnees.get('date_plantation'))
  const recolte = dateOuNull(donnees.get('date_recolte_estimee'))

  if (!nom) return { ok: false, message: 'Le nom de la parcelle est obligatoire.' }
  if (!membreId) return { ok: false, message: 'Choisis le producteur à qui appartient la parcelle.' }
  if (!Number.isFinite(superficie) || superficie <= 0) {
    return { ok: false, message: 'La superficie doit être un nombre supérieur à 0.' }
  }
  if (!CULTURES.includes(culture as Culture)) return { ok: false, message: 'Culture inconnue.' }
  if (!SOLS.includes(typeSol as TypeSol)) return { ok: false, message: 'Type de sol inconnu.' }
  if (!STATUTS.includes(statut as StatutParcelle)) return { ok: false, message: 'Statut inconnu.' }
  if (rendement !== null && (!Number.isFinite(rendement) || rendement < 0)) {
    return { ok: false, message: 'Le rendement estimé doit être un entier positif.' }
  }
  // La base porte la meme contrainte ; la verifier ici permet de le dire en
  // francais au lieu de laisser remonter une erreur Postgres.
  if (plantation && recolte && recolte < plantation) {
    return { ok: false, message: 'La récolte ne peut pas précéder la plantation.' }
  }

  const { error } = await supabase.from('parcelles').insert({
    cooperative_id: profil.cooperative_id,
    membre_id: membreId,
    nom,
    culture,
    surface_ha: superficie,
    type_sol: typeSol,
    statut,
    date_plantation: plantation,
    date_recolte_estimee: recolte,
    rendement_estime_kg_ha: rendement,
    irrigation: String(donnees.get('irrigation') ?? '') === 'true',
    notes: String(donnees.get('notes') ?? '').trim() || null,
  })

  if (error) return { ok: false, message: error.message }

  revalidatePath('/parcelles')
  return { ok: true }
}
