import { describe, it, expect } from 'vitest'
import { coordonneesDuCompte, urlMeteoActuelle, MESSAGE_METEO_A_VENIR } from '../lib/compte/meteo'

describe('coordonneesDuCompte', () => {
  it('compte absent ou sans coordonnées : null (donc « bientôt disponible »)', () => {
    expect(coordonneesDuCompte(null)).toBeNull()
    expect(coordonneesDuCompte({ paysCode: 'FR', deviseCode: 'EUR', latitude: null, longitude: null })).toBeNull()
  })
  it('lit les coordonnées du compte, jamais celles d’une ville fixe', () => {
    const c = coordonneesDuCompte({ paysCode: 'FR', deviseCode: 'EUR', latitude: 1.5, longitude: -2.5 })
    expect(c).toEqual({ latitude: 1.5, longitude: -2.5 })
    const url = urlMeteoActuelle(c!, 'temperature_2m')
    expect(url).toContain('latitude=1.5')
    expect(url).toContain('longitude=-2.5')
    expect(url).toContain('timezone=auto')
    expect(url).not.toMatch(/12\.37|Abidjan/)
  })
  it('le message est celui demandé par le fondateur', () => {
    expect(MESSAGE_METEO_A_VENIR).toBe('Météo locale : bientôt disponible (à venir)')
  })
})
