'use client'

import { useId, useMemo, useState } from 'react'
import { filtrerPays, listerPays } from '@/lib/pays'

interface Props {
  valeur: string
  onChange: (code: string) => void
}

/** Liste complète des pays (Intl.DisplayNames), avec recherche. */
export default function ChoixPays({ valeur, onChange }: Props) {
  const idRecherche = useId()
  const idListe = useId()
  const [recherche, setRecherche] = useState('')
  const tous = useMemo(() => listerPays('fr'), [])
  const visibles = useMemo(() => {
    const trouves = filtrerPays(tous, recherche)
    const choisi = tous.find(p => p.code === valeur)
    // Le pays choisi reste visible même quand la recherche l'exclut : sans cela,
    // la liste ne montrerait plus la valeur du formulaire.
    return choisi && !trouves.includes(choisi) ? [choisi, ...trouves] : trouves
  }, [tous, recherche, valeur])

  return (
    <div>
      <label htmlFor={idRecherche} className="block text-xs font-medium text-gray-600 mb-1">
        Rechercher votre pays
      </label>
      <input id={idRecherche} type="search" value={recherche} autoComplete="off"
        onChange={e => setRecherche(e.target.value)} placeholder="Tapez le début du nom du pays"
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
      <label htmlFor={idListe} className="block text-xs font-medium text-gray-600 mb-1">
        Pays *
      </label>
      <select id={idListe} value={valeur} size={6} required
        onChange={e => onChange(e.target.value)}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
        {visibles.map(p => <option key={p.code} value={p.code}>{p.nom}</option>)}
      </select>
      {visibles.length === 0 && (
        <p className="text-xs text-gray-600 mt-1" role="status">Aucun pays ne correspond à « {recherche} ».</p>
      )}
    </div>
  )
}
