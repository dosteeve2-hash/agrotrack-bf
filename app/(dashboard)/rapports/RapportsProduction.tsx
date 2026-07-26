// app/(dashboard)/rapports/RapportsProduction.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  PRODUCTION_6MOIS, CULTURES_TABLE, BAR_COLORS, CULTURE_TABLE_COLORS,
  fmt, fmtFCFA,
} from './rapports.data'

interface Props {
  moisLabel: string
  annee: string
}

export function RapportsProduction({ moisLabel, annee }: Props) {
  const totalSurface    = CULTURES_TABLE.reduce((a, r) => a + r.surface, 0)
  const totalProduction = CULTURES_TABLE.reduce((a, r) => a + r.production, 0)
  const totalRevenus    = CULTURES_TABLE.reduce((a, r) => a + r.revenus, 0)

  return (
    <>
      {/* BarChart production — 6 mois */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 text-sm">
          Production par culture — 6 derniers mois (tonnes)
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={PRODUCTION_6MOIS} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} unit=" t" />
            <Tooltip formatter={(v) => [typeof v === 'number' ? `${v} t` : String(v)]} />
            <Legend />
            {(['Mil', 'Sorgho', 'Maïs', 'Arachide', 'Sésame'] as const).map(c => (
              <Bar key={c} dataKey={c} fill={BAR_COLORS[c]} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tableau bilan cultures */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm">
            Bilan par culture — {moisLabel} {annee}
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#0A1628' }}>
              {['Culture', 'Parcelles', 'Surface totale', 'Production', 'Prix moy./kg', 'Revenus'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium text-white/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {CULTURES_TABLE.map(row => (
              <tr key={row.culture} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: CULTURE_TABLE_COLORS[row.culture] + '20', color: CULTURE_TABLE_COLORS[row.culture] }}>
                    {row.culture}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600">{row.parcelles}</td>
                <td className="px-5 py-3 text-gray-600">{row.surface} ha</td>
                <td className="px-5 py-3 font-semibold text-gray-900">{fmt(row.production)} kg</td>
                <td className="px-5 py-3 text-gray-600">{fmt(row.prixMoyenKg)} FCFA</td>
                <td className="px-5 py-3 font-bold text-gray-900">{fmtFCFA(row.revenus)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200" style={{ background: '#f8fafc' }}>
              <td className="px-5 py-3 font-bold text-gray-900" colSpan={2}>Total</td>
              <td className="px-5 py-3 font-bold text-gray-900">{totalSurface.toFixed(1)} ha</td>
              <td className="px-5 py-3 font-bold text-gray-900">{fmt(totalProduction)} kg</td>
              <td className="px-5 py-3 text-gray-400">—</td>
              <td className="px-5 py-3 font-bold" style={{ color: '#10b981' }}>{fmtFCFA(totalRevenus)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}
