'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const YIELD_DATA = [
  { mois: 'Jan', Mil: 12.4, Sorgho: 8.2, Maïs: 15.1 },
  { mois: 'Fév', Mil: 10.8, Sorgho: 9.5, Maïs: 13.7 },
  { mois: 'Mar', Mil: 11.2, Sorgho: 10.1, Maïs: 14.9 },
  { mois: 'Avr', Mil: 14.6, Sorgho: 12.3, Maïs: 18.2 },
  { mois: 'Mai', Mil: 18.3, Sorgho: 15.7, Maïs: 22.4 },
  { mois: 'Jun', Mil: 22.1, Sorgho: 18.9, Maïs: 27.6 },
  { mois: 'Jul', Mil: 26.8, Sorgho: 21.4, Maïs: 31.2 },
]

const LINES = [
  { key: 'Mil',    color: '#D4AF37' },
  { key: 'Sorgho', color: '#00BCD4' },
  { key: 'Maïs',  color: '#10b981' },
]

export default function YieldChart() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Évolution du rendement mensuel</h3>
          <p className="text-xs text-gray-400 mt-0.5">Tonnes / hectare — Jan à Juil 2026</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: '#D4AF3720', color: '#92760A' }}>
          Saison 2026
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={YIELD_DATA} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="mois" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit=" t" />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: '1px solid #f3f4f6', fontSize: 12 }}
            formatter={(v, name) => [typeof v === 'number' ? `${v} t/ha` : String(v), name as string]}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {LINES.map(({ key, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 4, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
