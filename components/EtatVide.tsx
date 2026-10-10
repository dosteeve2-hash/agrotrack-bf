import Link from 'next/link'
import type { ReactNode } from 'react'

interface Props {
  titre: string
  texte?: string
  /** Action pour commencer : un lien, ou un bouton si `onClick` est fourni. */
  action?: { libelle: string; href?: string; onClick?: () => void }
  icone?: ReactNode
  /** Fond sombre (pages navy) ou clair (cartes blanches). */
  sombre?: boolean
}

/**
 * Un écran sans données dit ce qu'il attend et propose la première action —
 * il n'affiche ni zéro trompeur ni donnée d'exemple.
 */
export default function EtatVide({ titre, texte, action, icone, sombre = false }: Props) {
  const couleurTitre = sombre ? 'rgba(255,255,255,0.9)' : '#111827'
  const couleurTexte = sombre ? 'rgba(255,255,255,0.7)' : '#4b5563'
  const styleBouton = { background: '#D4AF37', color: '#0A1628' }
  const classeBouton = 'inline-block mt-4 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90'

  return (
    <div role="status" className="text-center px-4 py-10"
      style={{ border: `1px dashed ${sombre ? 'rgba(255,255,255,0.2)' : '#d1d5db'}`, borderRadius: 12 }}>
      {icone && <div className="flex justify-center mb-3 opacity-60">{icone}</div>}
      <p className="font-semibold text-sm" style={{ color: couleurTitre }}>{titre}</p>
      {texte && <p className="text-xs mt-1 max-w-sm mx-auto" style={{ color: couleurTexte }}>{texte}</p>}
      {action?.href && (
        <Link href={action.href} className={classeBouton} style={styleBouton}>{action.libelle}</Link>
      )}
      {action && !action.href && (
        <button type="button" onClick={action.onClick} className={classeBouton} style={styleBouton}>
          {action.libelle}
        </button>
      )}
    </div>
  )
}
