'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Printer, Users, Wheat, Banknote, AlertTriangle } from 'lucide-react'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)
const fmtFCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

// ─── Données mock ────────────────────────────────────────────────────────────

const PRODUCTION_6MOIS = [
  { mois: 'Fév',  Mil: 8.2,  Sorgho: 11.4, Maïs: 14.2, Arachide: 4.5, Sésame: 1.8 },
  { mois: 'Mar',  Mil: 5.1,  Sorgho: 8.7,  Maïs: 9.8,  Arachide: 3.2, Sésame: 1.2 },
  { mois: 'Avr',  Mil: 3.4,  Sorgho: 6.2,  Maïs: 12.1, Arachide: 6.8, Sésame: 2.4 },
  { mois: 'Mai',  Mil: 10.8, Sorgho: 14.3, Maïs: 18.4, Arachide: 9.4, Sésame: 3.6 },
  { mois: 'Juin', Mil: 12.1, Sorgho: 18.9, Maïs: 21.3, Arachide: 11.2, Sésame: 4.1 },
  { mois: 'Juil', Mil: 9.7,  Sorgho: 15.2, Maïs: 16.8, Arachide: 8.6, Sésame: 3.3 },
]

interface CultureRow {
  culture: string
  parcelles: number
  surface: number
  production: number
  prixMoyenKg: number
  revenus: number
}

const CULTURES_TABLE: CultureRow[] = [
  { culture: 'Sorgho',   parcelles: 3, surface: 11.6, production: 15200, prixMoyenKg: 120, revenus: 1824000 },
  { culture: 'Maïs',     parcelles: 2, surface: 6.9,  production: 16800, prixMoyenKg: 145, revenus: 2436000 },
  { culture: 'Arachide', parcelles: 4, surface: 9.8,  production: 11200, prixMoyenKg: 350, revenus: 3920000 },
  { culture: 'Mil',      parcelles: 2, surface: 5.3,  production: 9700,  prixMoyenKg: 110, revenus: 1067000 },
  { culture: 'Sésame',   parcelles: 2, surface: 4.1,  production: 3600,  prixMoyenKg: 650, revenus: 2340000 },
]

interface Incident {
  id: string
  type: 'Météo' | 'Maladie' | 'Ravageur'
  description: string
  parcelles: number
  date: string
  gravite: 'Faible' | 'Modérée' | 'Élevée'
}

const INCIDENTS_MOCK: Incident[] = [
  { id: 'I1', type: 'Météo', description: 'Déficit pluviométrique — zone Nord Koudougou', parcelles: 3, date: '2026-07-05', gravite: 'Modérée' },
  { id: 'I2', type: 'Maladie', description: 'Mildiou détecté sur parcelles maïs (PRC-005)', parcelles: 1, date: '2026-07-10', gravite: 'Élevée' },
  { id: 'I3', type: 'Ravageur', description: 'Criquet pèlerin signalé — secteur Réo', parcelles: 2, date: '2026-07-14', gravite: 'Élevée' },
  { id: 'I4', type: 'Météo', description: 'Vent violent — légers dégâts cultures arachide', parcelles: 2, date: '2026-07-16', gravite: 'Faible' },
]

// KPIs statiques pour juillet 2026
const KPI_DATA: Record<string, { membresActifs: number; recoltesTonnes: number; revenusTotal: number; incidents: number }> = {
  '2026-07': { membresActifs: 127, recoltesTonnes: 70.2, revenusTotal: 13164500, incidents: 4 },
  '2026-06': { membresActifs: 124, recoltesTonnes: 85.5, revenusTotal: 22680000, incidents: 2 },
  '2026-05': { membresActifs: 118, recoltesTonnes: 82.4, revenusTotal: 21660000, incidents: 1 },
  '2026-04': { membresActifs: 115, recoltesTonnes: 41.6, revenusTotal: 9820000, incidents: 3 },
}

const GRAVITE_STYLES: Record<Incident['gravite'], { bg: string; color: string }> = {
  Faible:   { bg: '#dcfce7', color: '#15803d' },
  Modérée:  { bg: '#fef3c7', color: '#92400e' },
  Élevée:   { bg: '#fee2e2', color: '#991b1b' },
}

const TYPE_COLORS: Record<Incident['type'], string> = {
  Météo:    '#00BCD4',
  Maladie:  '#ef4444',
  Ravageur: '#f59e0b',
}

const BAR_COLORS: Record<string, string> = {
  Mil:      '#8b5cf6',
  Sorgho:   '#ef4444',
  Maïs:     '#f59e0b',
  Arachide: '#22d98a',
  Sésame:   '#c07d10',
}

const CULTURE_TABLE_COLORS: Record<string, string> = {
  Sorgho: '#ef4444', Maïs: '#f59e0b', Arachide: '#22d98a', Mil: '#8b5cf6', Sésame: '#c07d10',
}

const MOIS_OPTIONS = [
  { value: '01', label: 'Janvier' }, { value: '02', label: 'Février' },
  { value: '03', label: 'Mars' },    { value: '04', label: 'Avril' },
  { value: '05', label: 'Mai' },     { value: '06', label: 'Juin' },
  { value: '07', label: 'Juillet' }, { value: '08', label: 'Août' },
  { value: '09', label: 'Septembre' },{ value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },{ value: '12', label: 'Décembre' },
]

export default function RapportsPage() {
  const [mounted, setMounted] = useState(false)
  const [mois, setMois] = useState('07')
  const [annee, setAnnee] = useState('2026')

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const key = `${annee}-${mois}`
  const kpi = KPI_DATA[key] ?? { membresActifs: 0, recoltesTonnes: 0, revenusTotal: 0, incidents: 0 }

  const moisLabel = MOIS_OPTIONS.find(m => m.value === mois)?.label ?? mois

  function handlePrint() {
    window.print()
  }

  return (
    <div className="p-6 max-w-6xl mx-auto print:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 print:mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapport coopérative</h1>
          <p className="text-gray-500 text-sm mt-0.5">{moisLabel} {annee} — Koudougou, Burkina Faso</p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          {/* Sélecteur mois */}
          <select value={mois} onChange={e => setMois(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
            {MOIS_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          {/* Sélecteur année */}
          <select value={annee} onChange={e => setAnnee(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
            {['2024', '2025', '2026'].map(y => <option key={y}>{y}</option>)}
          </select>
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: '#0A1628', color: 'white' }}>
            <Printer className="w-4 h-4" /> Exporter PDF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Membres actifs', value: kpi.membresActifs.toString(), icon: Users, color: '#00BCD4' },
          { label: 'Récoltes totales', value: kpi.recoltesTonnes + ' t', icon: Wheat, color: '#D4AF37' },
          { label: 'Revenus FCFA', value: fmtFCFA(kpi.revenusTotal), icon: Banknote, color: '#10b981' },
          { label: 'Incidents signalés', value: kpi.incidents.toString(), icon: AlertTriangle, color: kpi.incidents > 3 ? '#ef4444' : '#f59e0b' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">{k.label}</p>
              <div className="p-1.5 rounded-lg" style={{ background: k.color + '20' }}>
                <k.icon className="w-4 h-4" style={{ color: k.color }} />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900 leading-tight">{k.value}</p>
          </div>
        ))}
      </div>

      {/* BarChart production par culture — 6 mois */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 text-sm">Production par culture — 6 derniers mois (tonnes)</h3>
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

      {/* Tableau cultures */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm">Bilan par culture — {moisLabel} {annee}</h3>
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
              <td className="px-5 py-3 font-bold text-gray-900">{CULTURES_TABLE.reduce((a, r) => a + r.surface, 0).toFixed(1)} ha</td>
              <td className="px-5 py-3 font-bold text-gray-900">{fmt(CULTURES_TABLE.reduce((a, r) => a + r.production, 0))} kg</td>
              <td className="px-5 py-3 text-gray-400">—</td>
              <td className="px-5 py-3 font-bold" style={{ color: '#10b981' }}>{fmtFCFA(CULTURES_TABLE.reduce((a, r) => a + r.revenus, 0))}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Section incidents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 text-sm">Incidents du mois</h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: '#fee2e2', color: '#991b1b' }}>
            {INCIDENTS_MOCK.length} alertes
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {INCIDENTS_MOCK.map(inc => (
            <div key={inc.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="p-2 rounded-lg flex-shrink-0 mt-0.5" style={{ background: TYPE_COLORS[inc.type] + '15' }}>
                <AlertTriangle className="w-4 h-4" style={{ color: TYPE_COLORS[inc.type] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: TYPE_COLORS[inc.type] }}>{inc.type}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={GRAVITE_STYLES[inc.gravite]}>
                    {inc.gravite}
                  </span>
                </div>
                <p className="text-sm text-gray-900">{inc.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {inc.parcelles} parcelle{inc.parcelles > 1 ? 's' : ''} concernée{inc.parcelles > 1 ? 's' : ''} — {new Date(inc.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
          {INCIDENTS_MOCK.length === 0 && (
            <p className="text-center text-gray-400 py-8 text-sm">Aucun incident ce mois</p>
          )}
        </div>
      </div>

      {/* Styles impression */}
      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}
