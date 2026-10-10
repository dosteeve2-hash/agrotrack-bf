/**
 * Suite de tests Vitest — agregation membre / parcelles (AgroTrack)
 *
 * `agregerParcelles` est la seule logique metier de la page Membres qui ne
 * depende pas de la base : c'est elle qui transforme des lignes en ce que
 * l'ecran montre. Elle est testee ici sans Supabase.
 */
import { describe, it, expect } from 'vitest'
import { agregerParcelles } from '../lib/data/membres'
import type { MembreRow, ParcelleRow } from '../lib/database.types'

type M = Pick<MembreRow, 'id' | 'nom' | 'telephone' | 'village' | 'statut' | 'date_adhesion'>
type P = Pick<ParcelleRow, 'membre_id' | 'culture' | 'surface_ha'>

const membre = (id: string, nom = 'Ouédraogo Adama'): M => ({
  id, nom, telephone: '+00 000 000', village: 'Village A',
  statut: 'actif', date_adhesion: '2023-03-15',
})

const parcelle = (membre_id: string, culture: P['culture'], surface_ha: string): P =>
  ({ membre_id, culture, surface_ha })

describe('agregerParcelles', () => {
  it('additionne les surfaces des parcelles d’un même membre', () => {
    const [vue] = agregerParcelles(
      [membre('m1')],
      [parcelle('m1', 'coton', '3.20'), parcelle('m1', 'sesame', '1.80')],
    )
    expect(vue.surfaceTotale).toBe(5)
  })

  it('collecte les cultures distinctes, sans doublon et triées', () => {
    const [vue] = agregerParcelles(
      [membre('m1')],
      [
        parcelle('m1', 'sesame', '1.00'),
        parcelle('m1', 'coton', '2.00'),
        parcelle('m1', 'coton', '1.50'),
      ],
    )
    expect(vue.cultures).toEqual(['coton', 'sesame'])
  })

  it('rend un membre sans parcelle avec 0 ha et aucune culture', () => {
    const [vue] = agregerParcelles([membre('m1')], [])
    expect(vue.surfaceTotale).toBe(0)
    expect(vue.cultures).toEqual([])
  })

  it('n’attribue pas les parcelles d’un membre à un autre', () => {
    const [a, b] = agregerParcelles(
      [membre('m1', 'Adama'), membre('m2', 'Fatima')],
      [parcelle('m1', 'coton', '3.00'), parcelle('m2', 'karite', '1.00')],
    )
    expect(a.surfaceTotale).toBe(3)
    expect(a.cultures).toEqual(['coton'])
    expect(b.surfaceTotale).toBe(1)
    expect(b.cultures).toEqual(['karite'])
  })

  it('ignore une parcelle orpheline sans planter', () => {
    const vues = agregerParcelles([membre('m1')], [parcelle('inconnu', 'mil', '9.00')])
    expect(vues).toHaveLength(1)
    expect(vues[0].surfaceTotale).toBe(0)
  })

  it('arrondit au centième d’hectare — 0.1 + 0.2 ne doit pas fuir', () => {
    const [vue] = agregerParcelles(
      [membre('m1')],
      [parcelle('m1', 'mil', '0.1'), parcelle('m1', 'sorgho', '0.2')],
    )
    expect(vue.surfaceTotale).toBe(0.3)
  })

  it('ne laisse pas une surface illisible effacer les autres', () => {
    const [vue] = agregerParcelles(
      [membre('m1')],
      [parcelle('m1', 'coton', '2.50'), parcelle('m1', 'mil', 'illisible')],
    )
    expect(vue.surfaceTotale).toBe(2.5)
    // La parcelle compte quand meme comme culture : elle existe, c'est sa
    // surface qui est inexploitable.
    expect(vue.cultures).toEqual(['coton', 'mil'])
  })

  it('reporte les champs du membre tels quels', () => {
    const [vue] = agregerParcelles([membre('m1', 'Kaboré Ibrahim')], [])
    expect(vue).toMatchObject({
      id: 'm1',
      nom: 'Kaboré Ibrahim',
      village: 'Village A',
      statut: 'actif',
      dateAdhesion: '2023-03-15',
    })
  })

  it('rend une liste vide quand il n’y a aucun membre', () => {
    expect(agregerParcelles([], [parcelle('m1', 'coton', '1.00')])).toEqual([])
  })
})
