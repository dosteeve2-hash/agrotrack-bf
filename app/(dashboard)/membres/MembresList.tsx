// app/(dashboard)/membres/MembresList.tsx
import { MapPin } from 'lucide-react'
import type { MembreVue } from '@/lib/data/membres'
import { LIBELLE_STATUT_MEMBRE } from '@/lib/database.types'
import { couleurCulture, libelleCulture } from '@/lib/cultures'
import { AVATAR_COLORS, initiales } from './membres.data'

interface Props {
  membres: MembreVue[]
}

export function MembresList({ membres }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {membres.length === 0 ? (
        <p className="text-center text-gray-400 py-12 text-sm">Aucun membre trouvé</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {membres.map((m, i) => (
            <div key={m.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                {initiales(m.nom)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{m.nom}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />{m.village}
                </p>
              </div>
              {/* Un producteur cultive souvent plusieurs choses. Deux pastilles
                  tiennent sur un telephone ; au-dela on compte. */}
              <span className="hidden sm:flex items-center gap-1">
                {m.cultures.slice(0, 2).map(c => (
                  <span key={c} className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: couleurCulture(libelleCulture(c)) + '20', color: couleurCulture(libelleCulture(c)) }}>
                    {libelleCulture(c)}
                  </span>
                ))}
                {m.cultures.length > 2 && (
                  <span className="text-xs text-gray-400">+{m.cultures.length - 2}</span>
                )}
              </span>
              <span className="text-sm text-gray-600 hidden md:block w-14 text-right">{m.surfaceTotale} ha</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium w-16 text-center"
                style={{
                  background: m.statut === 'actif' ? '#dcfce7' : '#f3f4f6',
                  color:      m.statut === 'actif' ? '#15803d' : '#6b7280',
                }}>
                {LIBELLE_STATUT_MEMBRE[m.statut]}
              </span>
              <span className="text-xs text-gray-400 hidden lg:block w-24 text-right">
                {new Date(m.dateAdhesion).toLocaleDateString('fr-FR')}
              </span>
            </div>
          ))}
        </div>
      )}
      {membres.length > 0 && (
        <div className="px-5 py-2 border-t border-gray-50 text-xs text-gray-400">
          {membres.length} membre{membres.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
