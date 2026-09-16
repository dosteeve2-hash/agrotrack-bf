/**
 * La partie pure du domaine « parcelles » : les formes et les calculs, sans
 * aucun acces a la base.
 *
 * Ce fichier existe parce que `parcelles.ts` importe le client Supabase serveur,
 * donc `next/headers`. Un composant client qui importerait une fonction depuis
 * ce module-la ferait entrer `next/headers` dans le bundle navigateur, et le
 * build echoue. La frontiere est ici, et elle est explicite.
 */
import type { Culture, MembreRow, ParcelleRow, StatutParcelle, TypeSol } from '@/lib/database.types'

/**
 * Une parcelle telle que l'ecran la montre : la parcelle, plus le producteur
 * a qui elle appartient. Le village n'est pas stocke sur la parcelle — il est
 * sur le membre, et le dupliquer garantirait qu'un jour les deux se
 * contrediraient — mais l'ecran a besoin des deux, alors la jointure se fait
 * ici, une fois.
 */
export interface ParcelleVue {
  id: string
  nom: string
  membreNom: string
  village: string
  culture: Culture
  superficie: number
  typeSol: TypeSol | null
  statut: StatutParcelle
  datePlantation: string | null
  dateRecolteEstimee: string | null
  rendementEstime: number
  irrigation: boolean
  notes: string
}

export type LigneJointe = Pick<
  ParcelleRow,
  'id' | 'nom' | 'culture' | 'surface_ha' | 'type_sol' | 'statut'
  | 'date_plantation' | 'date_recolte_estimee' | 'rendement_estime_kg_ha'
  | 'irrigation' | 'notes'
> & { membres: Pick<MembreRow, 'nom' | 'village'> | null }

export function versVue(lignes: LigneJointe[]): ParcelleVue[] {
  return lignes.map((l) => {
    const superficie = Number.parseFloat(l.surface_ha)
    return {
      id: l.id,
      // Une parcelle sans nom existe (le nom est facultatif en base) ; l'ecran,
      // lui, doit toujours avoir quelque chose a afficher.
      nom: l.nom ?? `Parcelle de ${l.membres?.nom ?? 'membre inconnu'}`,
      membreNom: l.membres?.nom ?? '—',
      village: l.membres?.village ?? '—',
      culture: l.culture,
      superficie: Number.isFinite(superficie) ? superficie : 0,
      typeSol: l.type_sol,
      statut: l.statut,
      datePlantation: l.date_plantation,
      dateRecolteEstimee: l.date_recolte_estimee,
      rendementEstime: l.rendement_estime_kg_ha ?? 0,
      irrigation: l.irrigation,
      notes: l.notes ?? '',
    }
  })
}

/**
 * Le rendement moyen des parcelles.
 *
 * Une moyenne sur zero parcelle vaut zero, pas NaN : la maquette divisait par
 * `parcelles.length` sans se demander ce qui se passait pour une cooperative
 * qui vient de s'inscrire — et affichait « NaN kg/ha » a son premier ecran.
 */
export function rendementMoyen(parcelles: Pick<ParcelleVue, 'rendementEstime'>[]): number {
  if (parcelles.length === 0) return 0
  return Math.round(parcelles.reduce((s, p) => s + p.rendementEstime, 0) / parcelles.length)
}
