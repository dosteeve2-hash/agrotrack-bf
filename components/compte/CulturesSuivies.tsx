'use client'

import { useId, useState } from 'react'
import { X } from 'lucide-react'
import { CULTURES_SUGGEREES, nettoyerCulture } from '@/lib/cultures'

interface Props {
  valeur: string[]
  onChange: (cultures: string[]) => void
}

/** Cultures suivies par le compte : suggestions à cocher + ajout libre. */
export default function CulturesSuivies({ valeur, onChange }: Props) {
  const idAjout = useId()
  const [saisie, setSaisie] = useState('')
  const aussi = valeur.filter(c => !CULTURES_SUGGEREES.includes(c))

  const basculer = (c: string) =>
    onChange(valeur.includes(c) ? valeur.filter(x => x !== c) : [...valeur, c])

  function ajouter() {
    const c = nettoyerCulture(saisie)
    if (!c) return
    if (!valeur.some(v => v.toLowerCase() === c.toLowerCase())) onChange([...valeur, c])
    setSaisie('')
  }

  return (
    <fieldset>
      <legend className="block text-xs font-medium text-gray-600 mb-2">Cultures suivies</legend>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CULTURES_SUGGEREES.map(c => (
          <label key={c} className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={valeur.includes(c)} onChange={() => basculer(c)}
              className="rounded" style={{ accentColor: '#0e7490' }} />
            <span className="text-sm text-gray-700">{c}</span>
          </label>
        ))}
      </div>
      {aussi.length > 0 && (
        <ul className="flex flex-wrap gap-2 mt-3" aria-label="Cultures ajoutées">
          {aussi.map(c => (
            <li key={c} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
              {c}
              <button type="button" onClick={() => basculer(c)} aria-label={`Retirer ${c}`}>
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 mt-3">
        <label htmlFor={idAjout} className="sr-only">Ajouter une autre culture</label>
        <input id={idAjout} type="text" value={saisie} maxLength={60} placeholder="Autre culture…"
          onChange={e => setSaisie(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); ajouter() } }}
          className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
        <button type="button" onClick={ajouter}
          className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
          Ajouter
        </button>
      </div>
    </fieldset>
  )
}
