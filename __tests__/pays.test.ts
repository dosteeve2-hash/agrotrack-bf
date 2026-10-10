import { describe, it, expect } from 'vitest'
import {
  listerPays, filtrerPays, deviseProposee, toutesLesDevises, nomDevise, devisesProposables,
} from '../lib/pays'

describe('listerPays', () => {
  const pays = listerPays('fr')
  const codes = new Set(pays.map(p => p.code))

  it('renvoie la liste complète (249 pays ISO + Kosovo)', () => {
    expect(pays.length).toBeGreaterThanOrEqual(245)
    expect(pays.length).toBeLessThanOrEqual(255)
  })

  it('contient des pays de tous les continents, sans en privilégier un', () => {
    for (const c of ['BF', 'GH', 'FR', 'TR', 'BR', 'IN', 'US', 'AU', 'CI', 'KE']) {
      expect(codes.has(c)).toBe(true)
    }
  })

  it('exclut les anciens codes et regroupements', () => {
    for (const c of ['EU', 'UN', 'ZZ', 'SU', 'YU', 'DD']) expect(codes.has(c)).toBe(false)
  })

  it('est triée par nom', () => {
    const noms = pays.map(p => p.nom)
    expect(noms).toEqual([...noms].sort((a, b) => a.localeCompare(b, 'fr')))
  })
})

describe('filtrerPays', () => {
  const pays = listerPays('fr')
  it('ignore la casse et les accents', () => {
    expect(filtrerPays(pays, 'cote').some(p => p.code === 'CI')).toBe(true)
    expect(filtrerPays(pays, 'TURQ').map(p => p.code)).toContain('TR')
  })
  it('recherche vide : tout', () => {
    expect(filtrerPays(pays, '  ')).toHaveLength(pays.length)
  })
  it('aucun résultat : liste vide', () => {
    expect(filtrerPays(pays, 'zzzzqqq')).toEqual([])
  })
})

describe('deviseProposee', () => {
  it('propose la devise du pays choisi', () => {
    expect(deviseProposee('BF')).toBe('XOF')
    expect(deviseProposee('CM')).toBe('XAF')
    expect(deviseProposee('GH')).toBe('GHS')
    expect(deviseProposee('FR')).toBe('EUR')
    expect(deviseProposee('TR')).toBe('TRY')
    expect(deviseProposee('BR')).toBe('BRL')
  })
  it('code inconnu : aucune proposition', () => {
    expect(deviseProposee('AQ')).toBeNull()
    expect(deviseProposee('ZZ')).toBeNull()
  })
  it('toute devise proposée est connue de l’environnement', () => {
    const connues = new Set(toutesLesDevises())
    const inconnues = devisesProposables().filter(d => !connues.has(d))
    expect(inconnues).toEqual([])
  })
  it('nomme les devises', () => {
    expect(nomDevise('XOF')).toMatch(/CFA/)
  })
})
