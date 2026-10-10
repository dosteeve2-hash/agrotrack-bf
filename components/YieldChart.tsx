'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import EtatVide from '@/components/EtatVide'
import { useHydrated } from '@/lib/useHydrated'

/** Une ligne par mois ; chaque autre clé est une culture (nom libre) -> valeur en t/ha. */
export type PointRendement = { mois: string } & Record<string, string | number>

const COULEURS = ['#D4AF37', '#00BCD4', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']

export default function YieldChart({ donnees = [] }: { donnees?: PointRendement[] }) {
  const monte = useHydrated()
  const cultures = [...new Set(donnees.flatMap(p => Object.keys(p).filter(k => k !== 'mois')))]

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">Évolution du rendement mensuel</h3>
        <p className="text-xs text-gray-600 mt-0.5">Tonnes / hectare</p>
      </div>

      {donnees.length === 0 ? (
        <EtatVide titre="Pas encore de rendement à afficher"
          texte="Le graphique se remplira à partir des récoltes que vous enregistrerez." />
      ) : monte && (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={donnees} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} unit=" t" />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: '1px solid #f3f4f6', fontSize: 12 }}
              formatter={(v, name) => [typeof v === 'number' ? `${v} t/ha` : String(v), name as string]}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            {cultures.map((cle, i) => (
              <Line key={cle} type="monotone" dataKey={cle} stroke={COULEURS[i % COULEURS.length]}
                strokeWidth={2.5} dot={{ r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
