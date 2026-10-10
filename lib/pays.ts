/**
 * Pays et devises, sans aucune liste de pays écrite à la main côté noms :
 * les noms viennent d'`Intl.DisplayNames`, donc de la langue de l'interface.
 *
 * Seule la correspondance pays -> devise est une donnée écrite ici, parce
 * qu'aucune API d'`Intl` ne la fournit. Elle ne sert qu'à PROPOSER une devise :
 * l'utilisateur la confirme ou la change.
 */

// Codes que `Intl.DisplayNames` renvoie mais qui ne sont pas des pays ISO 3166-1
// attribués : anciens codes supprimés, regroupements, codes de test.
const NON_PAYS = new Set([
  'AN', 'BU', 'CS', 'DD', 'DY', 'FX', 'HV', 'NH', 'RH', 'SU', 'TP', 'VD', 'YD', 'YU', 'ZR',
  'UK', 'EU', 'EZ', 'UN', 'XA', 'XB', 'ZZ', 'QO', 'AC', 'CP', 'DG', 'EA', 'IC', 'TA',
])

export interface Pays {
  code: string
  nom: string
}

/** Tous les pays, triés par nom dans la locale donnée. */
export function listerPays(locale = 'fr'): Pays[] {
  const noms = new Intl.DisplayNames([locale], { type: 'region', fallback: 'none' })
  const pays: Pays[] = []
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b)
      if (NON_PAYS.has(code)) continue
      const nom = noms.of(code)
      if (nom && nom !== code) pays.push({ code, nom })
    }
  }
  return pays.sort((x, y) => x.nom.localeCompare(y.nom, locale))
}

export function nomPays(code: string, locale = 'fr'): string {
  return new Intl.DisplayNames([locale], { type: 'region', fallback: 'code' }).of(code) ?? code
}

/** Insensible à la casse et aux accents : « cote » trouve « Côte d'Ivoire ». */
export function normaliser(texte: string): string {
  return texte.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function filtrerPays(pays: Pays[], recherche: string): Pays[] {
  const q = normaliser(recherche)
  if (!q) return pays
  return pays.filter(p => normaliser(p.nom).includes(q) || p.code.toLowerCase() === q)
}

// Devise -> pays qui l'utilisent. Les territoires suivent la devise de leur État.
const DEVISE_PAR_PAYS_GROUPEE: Record<string, string> = {
  EUR: 'AD AT AX BE BL CY DE EE ES FI FR GF GP GR HR IE IT LT LU LV MC ME MF MQ MT NL PM PT RE SI SK SM TF VA XK YT',
  USD: 'AS BQ EC FM GU IO MH MP PR PW SV TC TL UM US VG VI',
  XOF: 'BF BJ CI GW ML NE SN TG',
  XAF: 'CF CG CM GA GQ TD',
  XPF: 'NC PF WF',
  XCD: 'AG AI DM GD KN LC MS VC',
  AUD: 'AU CC CX HM KI NF NR TV',
  NZD: 'CK NU NZ PN TK',
  GBP: 'GB GG GS IM JE',
  NOK: 'BV NO SJ',
  DKK: 'DK FO GL',
  CHF: 'CH LI',
  ILS: 'IL PS',
  MAD: 'EH MA',
  ANG: 'CW SX',
  AED: 'AE', AFN: 'AF', ALL: 'AL', AMD: 'AM', AOA: 'AO', ARS: 'AR', AWG: 'AW', AZN: 'AZ',
  BAM: 'BA', BBD: 'BB', BDT: 'BD', BGN: 'BG', BHD: 'BH', BIF: 'BI', BMD: 'BM', BND: 'BN',
  BOB: 'BO', BRL: 'BR', BSD: 'BS', BTN: 'BT', BWP: 'BW', BYN: 'BY', BZD: 'BZ', CAD: 'CA',
  CDF: 'CD', CLP: 'CL', CNY: 'CN', COP: 'CO', CRC: 'CR', CUP: 'CU', CVE: 'CV', CZK: 'CZ',
  DJF: 'DJ', DOP: 'DO', DZD: 'DZ', EGP: 'EG', ERN: 'ER', ETB: 'ET', FJD: 'FJ', FKP: 'FK',
  GEL: 'GE', GHS: 'GH', GIP: 'GI', GMD: 'GM', GNF: 'GN', GTQ: 'GT', GYD: 'GY', HKD: 'HK',
  HNL: 'HN', HTG: 'HT', HUF: 'HU', IDR: 'ID', INR: 'IN', IQD: 'IQ', IRR: 'IR', ISK: 'IS',
  JMD: 'JM', JOD: 'JO', JPY: 'JP', KES: 'KE', KGS: 'KG', KHR: 'KH', KMF: 'KM', KPW: 'KP',
  KRW: 'KR', KWD: 'KW', KYD: 'KY', KZT: 'KZ', LAK: 'LA', LBP: 'LB', LKR: 'LK', LRD: 'LR',
  LSL: 'LS', LYD: 'LY', MDL: 'MD', MGA: 'MG', MKD: 'MK', MMK: 'MM', MNT: 'MN', MOP: 'MO',
  MRU: 'MR', MUR: 'MU', MVR: 'MV', MWK: 'MW', MXN: 'MX', MYR: 'MY', MZN: 'MZ', NAD: 'NA',
  NGN: 'NG', NIO: 'NI', NPR: 'NP', OMR: 'OM', PAB: 'PA', PEN: 'PE', PGK: 'PG', PHP: 'PH',
  PKR: 'PK', PLN: 'PL', PYG: 'PY', QAR: 'QA', RON: 'RO', RSD: 'RS', RUB: 'RU', RWF: 'RW',
  SAR: 'SA', SBD: 'SB', SCR: 'SC', SDG: 'SD', SEK: 'SE', SGD: 'SG', SHP: 'SH', SLE: 'SL',
  SOS: 'SO', SRD: 'SR', SSP: 'SS', STN: 'ST', SYP: 'SY', SZL: 'SZ', THB: 'TH', TJS: 'TJ',
  TMT: 'TM', TND: 'TN', TOP: 'TO', TRY: 'TR', TTD: 'TT', TWD: 'TW', TZS: 'TZ', UAH: 'UA',
  UGX: 'UG', UYU: 'UY', UZS: 'UZ', VES: 'VE', VND: 'VN', VUV: 'VU', WST: 'WS', YER: 'YE',
  ZAR: 'ZA', ZMW: 'ZM', ZWG: 'ZW',
}

const DEVISE_PAR_PAYS: ReadonlyMap<string, string> = new Map(
  Object.entries(DEVISE_PAR_PAYS_GROUPEE).flatMap(([devise, codes]) =>
    codes.split(' ').map((code): [string, string] => [code, devise]),
  ),
)

export function toutesLesDevises(): string[] {
  return Intl.supportedValuesOf('currency')
}

export function deviseProposee(codePays: string): string | null {
  const devise = DEVISE_PAR_PAYS.get(codePays)
  return devise && toutesLesDevises().includes(devise) ? devise : null
}

export function nomDevise(code: string, locale = 'fr'): string {
  return new Intl.DisplayNames([locale], { type: 'currency', fallback: 'code' }).of(code) ?? code
}

export const devisesProposables = (): string[] => [...new Set(DEVISE_PAR_PAYS.values())]
