'use client'

import { useId, useState } from 'react'
import { AUTRE } from '@/lib/cultures'

interface Props {
  label: string
  valeur: string
  onChange: (valeur: string) => void
  /** Suggestions : texte affiché = texte stocké. */
  suggestions: readonly string[]
  className?: string
  style?: React.CSSProperties
  labelClassName?: string
  labelStyle?: React.CSSProperties
  /** Libellé de l'option vide, ou absent pour ne pas en proposer. */
  placeholderVide?: string
}

/**
 * Liste de suggestions + saisie libre « Autre ». Sert aux cultures et aux types
 * de sol : aucune liste fermée, la valeur retournée est toujours du texte.
 */
export default function ChampListeLibre({
  label, valeur, onChange, suggestions, className, style, labelClassName, labelStyle, placeholderVide,
}: Props) {
  const idSelect = useId()
  const idTexte = useId()
  const connue = valeur === '' || suggestions.includes(valeur)
  const [autre, setAutre] = useState(!connue)
  const modeAutre = autre || !connue

  return (
    <div>
      <label htmlFor={idSelect} className={labelClassName} style={labelStyle}>{label}</label>
      <select id={idSelect} className={className} style={style}
        value={modeAutre ? AUTRE : valeur}
        onChange={e => {
          if (e.target.value === AUTRE) { setAutre(true); onChange(''); return }
          setAutre(false)
          onChange(e.target.value)
        }}>
        {placeholderVide !== undefined && <option value="">{placeholderVide}</option>}
        {suggestions.map(s => <option key={s} value={s}>{s}</option>)}
        <option value={AUTRE}>Autre…</option>
      </select>
      {modeAutre && (
        <input id={idTexte} type="text" aria-label={`${label} : saisie libre`} maxLength={60}
          className={className} style={{ ...style, marginTop: 6 }} placeholder="Saisissez le nom"
          value={valeur} onChange={e => onChange(e.target.value.slice(0, 60))} />
      )}
    </div>
  )
}
