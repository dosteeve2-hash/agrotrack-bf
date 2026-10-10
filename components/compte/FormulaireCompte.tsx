'use client'

import { useId, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import ChoixPays from './ChoixPays'
import { deviseProposee, nomDevise, nomPays, toutesLesDevises } from '@/lib/pays'
import { coordonneesValides, enregistrerParametres } from '@/lib/compte/parametres'
import { useParametresCompte } from '@/lib/compte/useParametresCompte'

function versNombre(texte: string): number | null {
  const t = texte.trim().replace(',', '.')
  if (t === '') return null
  const n = Number(t)
  return Number.isFinite(n) ? n : Number.NaN
}

const champ = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50'

/** Pays, devise proposée (modifiable), coordonnées facultatives. */
export default function FormulaireCompte({ onEnregistre }: { onEnregistre?: () => void }) {
  const actuel = useParametresCompte()
  const idDevise = useId()
  const idLat = useId()
  const idLon = useId()
  const [pays, setPays] = useState<string | null>(null)
  const [devise, setDevise] = useState<string | null>(null)
  const [lat, setLat] = useState<string | null>(null)
  const [lon, setLon] = useState<string | null>(null)
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null)

  // Tant que l'utilisateur n'a rien changé, le formulaire reflète les paramètres enregistrés.
  const paysCourant = pays ?? actuel?.paysCode ?? ''
  const deviseCourante = devise ?? actuel?.deviseCode ?? ''
  const latCourante = lat ?? (actuel?.latitude?.toString() ?? '')
  const lonCourante = lon ?? (actuel?.longitude?.toString() ?? '')
  const devises = useMemo(() => toutesLesDevises(), [])

  function choisirPays(code: string) {
    setPays(code)
    // La devise est PROPOSÉE selon le pays ; elle reste modifiable ensuite.
    const proposee = deviseProposee(code)
    if (proposee) setDevise(proposee)
    setMessage(null)
  }

  function enregistrer(e: React.FormEvent) {
    e.preventDefault()
    const latitude = versNombre(latCourante)
    const longitude = versNombre(lonCourante)
    if (Number.isNaN(latitude) || Number.isNaN(longitude) || !coordonneesValides(latitude, longitude)) {
      setMessage({ ok: false, texte: 'Coordonnées invalides : renseignez les deux valeurs (latitude entre -90 et 90, longitude entre -180 et 180) ou aucune.' })
      return
    }
    if (!paysCourant || !deviseCourante) {
      setMessage({ ok: false, texte: 'Choisissez un pays et une devise.' })
      return
    }
    const ok = enregistrerParametres({ paysCode: paysCourant, deviseCode: deviseCourante, latitude, longitude })
    setMessage(ok
      ? { ok: true, texte: 'Paramètres du compte enregistrés sur cet appareil.' }
      : { ok: false, texte: 'Enregistrement impossible : le navigateur refuse le stockage local.' })
    if (ok) onEnregistre?.()
  }

  const deviseChangee = actuel !== null && deviseCourante !== '' && deviseCourante !== actuel.deviseCode

  return (
    <form onSubmit={enregistrer} className="space-y-5" noValidate>
      <ChoixPays valeur={paysCourant} onChange={choisirPays} />
      {paysCourant && (
        <p className="text-xs text-gray-600" role="status">Pays choisi : <strong>{nomPays(paysCourant)}</strong></p>
      )}

      <div>
        <label htmlFor={idDevise} className="block text-xs font-medium text-gray-600 mb-1">
          Devise du compte * <span className="font-normal">(une seule, sans conversion)</span>
        </label>
        <select id={idDevise} value={deviseCourante} onChange={e => { setDevise(e.target.value); setMessage(null) }} className={`${champ} bg-white`}>
          <option value="">Choisir une devise</option>
          {devises.map(d => <option key={d} value={d}>{d} — {nomDevise(d)}</option>)}
        </select>
        {deviseChangee && (
          <p className="text-xs mt-1" style={{ color: '#92400e' }} role="status">
            Changer de devise ne convertit aucun montant déjà saisi : seul le symbole change.
          </p>
        )}
      </div>

      <fieldset>
        <legend className="text-xs font-medium text-gray-600 mb-1">Coordonnées de l’exploitation (facultatif)</legend>
        <p className="text-xs text-gray-600 mb-2">Servent plus tard à afficher la météo locale. Vous pouvez laisser vide.</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={idLat} className="block text-xs text-gray-600 mb-1">Latitude</label>
            <input id={idLat} inputMode="decimal" value={latCourante} onChange={e => { setLat(e.target.value); setMessage(null) }} placeholder="-90 à 90" className={champ} />
          </div>
          <div>
            <label htmlFor={idLon} className="block text-xs text-gray-600 mb-1">Longitude</label>
            <input id={idLon} inputMode="decimal" value={lonCourante} onChange={e => { setLon(e.target.value); setMessage(null) }} placeholder="-180 à 180" className={champ} />
          </div>
        </div>
      </fieldset>

      {message && (
        <p role="status" className="text-sm rounded-lg px-3 py-2"
          style={message.ok ? { background: '#ecfdf5', color: '#065f46' } : { background: '#fef2f2', color: '#991b1b' }}>
          {message.ok && <Check className="inline w-4 h-4 mr-1" />}{message.texte}
        </p>
      )}

      <button type="submit" className="px-5 py-2.5 text-sm font-semibold rounded-lg transition-all hover:opacity-90"
        style={{ background: '#D4AF37', color: '#0A1628' }}>
        Enregistrer
      </button>
    </form>
  )
}
