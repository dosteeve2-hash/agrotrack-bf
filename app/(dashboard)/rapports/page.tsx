'use client'
import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Download } from 'lucide-react'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

const COLLECTES_30J = [
  { semaine: 'S1 Juin', tonnage: 18.4, ca: 4830000 },
  { semaine: 'S2 Juin', tonnage: 22.1, ca: 5932500 },
  { semaine: 'S3 Juin', tonnage: 19.7, ca: 5175000 },
  { semaine: 'S4 Juin', tonnage: 25.3, ca: 6742500 },
  { semaine: 'S1 Juil', tonnage: 21.8, ca: 5857500 },
  { semaine: 'S2 Juil', tonnage: 28.6, ca: 7560000 },
]

const PRODUITS = [
  { produit: 'Coton', tonnage: 28.5, ca: 7837500 },
  { produit: 'Sésame', tonnage: 4.2, ca: 1890000 },
  { produit: 'Karité', tonnage: 0.38, ca: 144400 },
  { produit: 'Maïs', tonnage: 12.0, ca: 1740000 },
]

const MENSUEL = [
  { mois: 'Mai 2026', membres: 118, tonnage: '82.4 t', ca: 21660000 },
  { mois: 'Juin 2026', membres: 124, tonnage: '85.5 t', ca: 22680000 },
  { mois: 'Juil 2026', membres: 127, tonnage: '45.2 t', ca: 11612000 },
]

const CSV_DATA = `Semaine,Tonnage (t),CA (FCFA)\n${COLLECTES_30J.map(r => `${r.semaine},${r.tonnage},${r.ca}`).join('\n')}`

function downloadCSV() {
  const blob = new Blob([CSV_DATA], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'agrotrack-rapport-2026-07.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-800 mb-4 text-sm">{title}</h3>
      {children}
    </div>
  )
}

export default function RapportsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-500 text-sm mt-0.5">Analyse des 30 derniers jours</p>
        </div>
        <button onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#0A1628', color: 'white' }}>
          <Download className="w-4 h-4" /> Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <ChartCard title="Évolution collectes — 30 jours (tonnes)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={COLLECTES_30J} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="gradTonnage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="semaine" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [typeof v === 'number' ? `${v} t` : String(v), 'Tonnage']} />
              <Area type="monotone" dataKey="tonnage" stroke="#D4AF37" strokeWidth={2}
                fill="url(#gradTonnage)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Comparatif produits — CA (FCFA)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PRODUITS} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="produit" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} />
              <Tooltip formatter={(v) => [typeof v === 'number' ? `${fmt(v)} FCFA` : String(v), 'CA']} />
              <Legend />
              <Bar dataKey="ca" name="CA" fill="#00BCD4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Table mensuelle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm">Récapitulatif mensuel</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#0A1628' }}>
              {['Mois', 'Membres actifs', 'Tonnage total', 'CA total'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-medium text-white/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MENSUEL.map((row) => (
              <tr key={row.mois} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{row.mois}</td>
                <td className="px-5 py-3 text-gray-600">{row.membres}</td>
                <td className="px-5 py-3 text-gray-600">{row.tonnage}</td>
                <td className="px-5 py-3 font-bold text-gray-900">{fmt(row.ca)} FCFA</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
