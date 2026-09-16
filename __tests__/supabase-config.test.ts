import { describe, it, expect, afterEach } from 'vitest'

import { supabaseConfigure, urlSupabase, cleSupabase, URL_ABSENTE, CLE_ABSENTE } from '@/lib/supabase/config'

/**
 * Ce que ces tests verrouillent : le 16 septembre 2026, `/dashboard` répondait 500 en
 * production — depuis le 22 août. `client.ts` et `server.ts` écrivaient
 * `process.env.X!` ; l'assertion ne ment qu'au vérificateur de types, et à l'exécution
 * `@supabase/ssr` levait DANS createClient(), avant que le layout ait pu rediriger.
 * Les seize pages du tableau de bord renvoyaient une erreur serveur au lieu d'une page
 * de connexion.
 */

const ORIGINE = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  cle: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

function poser(url: string | undefined, cle: string | undefined) {
  if (url === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL
  else process.env.NEXT_PUBLIC_SUPABASE_URL = url
  if (cle === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = cle
}

afterEach(() => poser(ORIGINE.url, ORIGINE.cle))

describe('supabaseConfigure', () => {
  it('reconnaît une configuration complète', () => {
    poser('https://exemple.supabase.co', 'une-cle')
    expect(supabaseConfigure()).toBe(true)
  })

  it('voit les deux variables absentes', () => {
    poser(undefined, undefined)
    expect(supabaseConfigure()).toBe(false)
  })

  it("voit une SEULE des deux manquer — une moitié ne suffit pas", () => {
    poser('https://exemple.supabase.co', undefined)
    expect(supabaseConfigure()).toBe(false)
    poser(undefined, 'une-cle')
    expect(supabaseConfigure()).toBe(false)
  })

  it('traite une variable DÉFINIE MAIS VIDE comme absente', () => {
    // C'est la façon la plus courante de désactiver une variable dans un tableau de
    // bord d'hébergeur, et c'est le piège de `??`, qui l'aurait laissée passer :
    // createBrowserClient('') lève, et on retombe sur la panne d'origine.
    poser('', '')
    expect(supabaseConfigure()).toBe(false)
    poser('https://exemple.supabase.co', '')
    expect(supabaseConfigure()).toBe(false)
  })
})

describe('les valeurs de repli', () => {
  it("sont des chaînes valides — createClient ne doit plus JAMAIS lever", () => {
    poser(undefined, undefined)
    expect(urlSupabase()).toBe(URL_ABSENTE)
    expect(cleSupabase()).toBe(CLE_ABSENTE)
    // Une URL syntaxiquement valide : c'est ce qui empêche @supabase/ssr de lever.
    expect(() => new URL(urlSupabase())).not.toThrow()
    expect(cleSupabase().length).toBeGreaterThan(0)
  })
})
