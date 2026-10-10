import { describe, it, expect, beforeEach } from 'vitest'
import {
  analyserParametres, enregistrerParametres, lireBrut, coordonneesValides, CLE_STOCKAGE,
} from '../lib/compte/parametres'

beforeEach(() => window.localStorage.clear())

describe('analyserParametres', () => {
  it('lit des paramètres valides', () => {
    const p = analyserParametres(JSON.stringify({ paysCode: 'GH', deviseCode: 'GHS', latitude: 5.6, longitude: -0.2 }))
    expect(p).toEqual({ paysCode: 'GH', deviseCode: 'GHS', latitude: 5.6, longitude: -0.2 })
  })
  it('coordonnées absentes : null, pas zéro', () => {
    const p = analyserParametres(JSON.stringify({ paysCode: 'FR', deviseCode: 'EUR' }))
    expect(p?.latitude).toBeNull()
    expect(p?.longitude).toBeNull()
  })
  it('rejette ce qui est absent, illisible ou incohérent', () => {
    expect(analyserParametres(null)).toBeNull()
    expect(analyserParametres('pas du json')).toBeNull()
    expect(analyserParametres('{"paysCode":"gh","deviseCode":"GHS"}')).toBeNull()
    expect(analyserParametres('{"paysCode":"GH","deviseCode":"GH"}')).toBeNull()
    expect(analyserParametres('{"paysCode":"GH","deviseCode":"GHS","latitude":5}')).toBeNull()
    expect(analyserParametres('{"paysCode":"GH","deviseCode":"GHS","latitude":95,"longitude":0}')).toBeNull()
  })
})

describe('coordonneesValides', () => {
  it('jamais à moitié', () => {
    expect(coordonneesValides(null, null)).toBe(true)
    expect(coordonneesValides(10, null)).toBe(false)
    expect(coordonneesValides(0, 0)).toBe(true)
    expect(coordonneesValides(-91, 0)).toBe(false)
    expect(coordonneesValides(0, 181)).toBe(false)
  })
})

describe('enregistrerParametres', () => {
  it('écrit puis relit', () => {
    expect(enregistrerParametres({ paysCode: 'TR', deviseCode: 'TRY', latitude: null, longitude: null })).toBe(true)
    expect(analyserParametres(lireBrut())).toEqual({ paysCode: 'TR', deviseCode: 'TRY', latitude: null, longitude: null })
  })
  it('refuse des paramètres invalides sans rien écrire', () => {
    expect(enregistrerParametres({ paysCode: 'T', deviseCode: 'TRY', latitude: null, longitude: null })).toBe(false)
    expect(enregistrerParametres({ paysCode: 'TR', deviseCode: 'TRY', latitude: 1, longitude: null })).toBe(false)
    expect(window.localStorage.getItem(CLE_STOCKAGE)).toBeNull()
  })
})
