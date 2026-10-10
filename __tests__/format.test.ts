import { describe, it, expect } from 'vitest'
import { formatMontant } from '../lib/format'

// Intl insère des espaces insécables (U+00A0 ou U+202F) : on les normalise.
const norm = (s: string) => s.replace(/[  ]/g, ' ')

describe('formatMontant', () => {
  it('XOF : pas de décimale, suffixe de devise', () => {
    expect(norm(formatMontant(1234567, 'XOF'))).toBe('1 234 567 F CFA')
  })

  it('GHS : deux décimales', () => {
    expect(norm(formatMontant(1234.5, 'GHS'))).toBe('1 234,50 GHS')
  })

  it('EUR : symbole et deux décimales', () => {
    expect(norm(formatMontant(1234.5, 'EUR'))).toBe('1 234,50 €')
  })

  it('TRY : deux décimales', () => {
    expect(norm(formatMontant(1234.5, 'TRY'))).toBe('1 234,50 TRY')
  })

  it('montant 0 : affiché, pas masqué', () => {
    expect(norm(formatMontant(0, 'XOF'))).toBe('0 F CFA')
    expect(norm(formatMontant(0, 'EUR'))).toBe('0,00 €')
  })

  it('respecte la locale demandée', () => {
    expect(formatMontant(1234.5, 'USD', 'en-US')).toBe('$1,234.50')
  })

  it('sans devise : le nombre seul, jamais un FCFA par défaut', () => {
    const s = norm(formatMontant(1500, null))
    expect(s).toBe('1 500')
    expect(s).not.toMatch(/FCFA|CFA/)
    expect(norm(formatMontant(1500))).toBe('1 500')
  })

  it('devise inconnue : repli sur le nombre et le code, sans exception', () => {
    expect(norm(formatMontant(1500, 'ZZZZ'))).toBe('1 500 ZZZZ')
  })

  it('montant non fini : tiret', () => {
    expect(formatMontant(Number.NaN, 'EUR')).toBe('—')
    expect(formatMontant(Infinity, 'EUR')).toBe('—')
  })
})
