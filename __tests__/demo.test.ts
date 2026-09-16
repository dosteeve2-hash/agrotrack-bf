import { afterEach, describe, expect, it } from 'vitest'

import { demoConfiguree, emailDemo, estCompteDemo, motDePasseDemo } from '@/lib/demo'

const ORIGINE = { ...process.env }

afterEach(() => {
  process.env = { ...ORIGINE }
})

function poser(email?: string, motDePasse?: string) {
  if (email === undefined) delete process.env.DEMO_EMAIL
  else process.env.DEMO_EMAIL = email
  if (motDePasse === undefined) delete process.env.DEMO_PASSWORD
  else process.env.DEMO_PASSWORD = motDePasse
}

describe('la demonstration n\'est proposee que si elle est configuree', () => {
  it('absente quand les deux variables manquent', () => {
    poser(undefined, undefined)
    expect(demoConfiguree()).toBe(false)
  })

  it('absente quand seul l\'email est pose', () => {
    poser('demo@exemple.test', undefined)
    expect(demoConfiguree()).toBe(false)
  })

  it('absente quand seul le mot de passe est pose', () => {
    poser(undefined, 'secret')
    expect(demoConfiguree()).toBe(false)
  })

  // Une variable DEFINIE mais VIDE doit compter comme absente. Ce test pin ce
  // comportement — mais il ne distingue PAS `||` de `??` : avec un repli sur la
  // chaine vide, les deux operateurs rendent la meme chose. Verifie en echangeant
  // l'un contre l'autre, les tests restent verts. C'est le `!== ''` de
  // demoConfiguree() qui fait le travail.
  it('absente quand une variable est definie mais VIDE', () => {
    poser('demo@exemple.test', '')
    expect(demoConfiguree()).toBe(false)
    poser('', 'secret')
    expect(demoConfiguree()).toBe(false)
  })

  it('presente quand les deux sont posees', () => {
    poser('demo@exemple.test', 'secret')
    expect(demoConfiguree()).toBe(true)
    expect(emailDemo()).toBe('demo@exemple.test')
    expect(motDePasseDemo()).toBe('secret')
  })
})

describe('estCompteDemo', () => {
  it('reconnait le compte de demonstration', () => {
    poser('demo@exemple.test', 'secret')
    expect(estCompteDemo('demo@exemple.test')).toBe(true)
  })

  it('ne confond pas un autre utilisateur', () => {
    poser('demo@exemple.test', 'secret')
    expect(estCompteDemo('vraie-cooperative@exemple.test')).toBe(false)
  })

  // Le piege que ce test existe pour fermer : sans demo configuree, emailDemo() vaut
  // la chaine vide. Une session sans email vaudrait aussi la chaine vide, et une
  // comparaison naive afficherait « Mode Demo » a un vrai utilisateur.
  it('reste faux pour une session sans email quand la demo n\'est pas configuree', () => {
    poser(undefined, undefined)
    expect(estCompteDemo(undefined)).toBe(false)
    expect(estCompteDemo(null)).toBe(false)
    expect(estCompteDemo('')).toBe(false)
  })

  it('reste faux pour une session sans email meme quand la demo est configuree', () => {
    poser('demo@exemple.test', 'secret')
    expect(estCompteDemo(undefined)).toBe(false)
    expect(estCompteDemo('')).toBe(false)
  })
})
