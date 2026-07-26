// app/(dashboard)/parcelles/ParcelleTable.tsx
import { MapPin } from 'lucide-react'
import type { Parcelle } from './parcelles.data'
import { STATUT_STYLES, CULTURE_COLORS } from './parcelles.data'

interface Props {
  parcelles: Parcelle[]
}

export function ParcelleTable({ parcelles }: Props) {
  const surfaceFiltered = parcelles.reduce((a, p) => a + p.surface, 0)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: '#0A1628' }}>
            {['N° Parcelle', 'Membre propriétaire', 'Surface', 'Culture', 'Village', 'Statut', 'Dernière récolte'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/60">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {parcelles.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center text-gray-400 py-12 text-sm">Aucune parcelle trouvée</td>
            </tr>
          ) : (
            parcelles.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#00BCD4' }} />
                    <span className="font-mono text-xs font-semibold text-gray-700">{p.numero}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{p.membre}</td>
                <td className="px-4 py-3 text-gray-700 font-semibold">{p.surface} ha</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: CULTURE_COLORS[p.culture] + '20', color: CULTURE_COLORS[p.culture] }}>
                    {p.culture}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.village}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={STATUT_STYLES[p.statut]}>
                    {p.statut}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {p.derniereRecolte === '—' ? '—' : new Date(p.derniereRecolte).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {parcelles.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-50 text-xs text-gray-400">
          {parcelles.length} parcelle{parcelles.length > 1 ? 's' : ''} — {surfaceFiltered.toFixed(1)} ha
        </div>
      )}
    </div>
  )
}
