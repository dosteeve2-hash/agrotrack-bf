'use client'

// app/(dashboard)/rapports/page.tsx
import { useState } from 'react'
import { Printer, Users, Wheat, Banknote, AlertTriangle } from 'lucide-react'
import {
  KPI_DATA, INCIDENTS_MOCK, MOIS_OPTIONS, GRAVITE_STYLES, TYPE_COLORS, fmtFCFA,
} from './rapports.data'
import { RapportsProduction } from './RapportsProduction'
import PDFExportButton from '@/components/PDFExportButton'
import { useHydrated } from "@/lib/useHydrated"

export default function RapportsPage() {
  const mounted = useHydrated()
  const [mois,    setMois]    = useState('07')
  const [annee,   setAnnee]   = useState('2026')

  if (!mounted) return null

  const key = `${annee}-${mois}`
  const kpi = KPI_DATA[key] ?? { membresActifs: 0, recoltesTonnes: 0, revenusTotal: 0, incidents: 0 }
  const moisLabel = MOIS_OPTIONS.find(m => m.value === mois)?.label ?? mois

  return (
    <div className="p-6 max-w-6xl mx-auto print:p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 print:mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapport cooperative</h1>
          <p className="text-gray-500 text-sm mt-0.5">{moisLabel} {annee} - Koudougou, Burkina Faso</p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <select value={mois} onChange={e => setMois(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
            {MOIS_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select value={annee} onChange={e => setAnnee(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
            {['2024', '2025', '2026'].map(y => <option key={y}>{y}</option>)}
          </select>
          <PDFExportButton moisLabel={moisLabel} annee={annee} kpi={kpi} />
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: '#0A1628', color: 'white' }}>
            <Printer className="w-4 h-4" /> Imprimer
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Membres actifs',     value: kpi.membresActifs.toString(),  icon: Users,         color: '#00BCD4' },
          { label: 'Recoltes totales',   value: kpi.recoltesTonnes + ' t',     icon: Wheat,         color: '#D4AF37' },
          { label: 'Revenus FCFA',       value: fmtFCFA(kpi.revenusTotal),     icon: Banknote,      color: '#10b981' },
          { label: 'Incidents signales', value: kpi.incidents.toString(),       icon: AlertTriangle, color: kpi.incidents > 3 ? '#ef4444' : '#f59e0b' },
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

      <RapportsProduction moisLabel={moisLabel} annee={annee} />

      {/* Incidents */}
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
              <div className="p-2 rounded-lg flex-shrink-0 mt-0.5"
                style={{ background: TYPE_COLORS[inc.type] + '15' }}>
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
                  {inc.parcelles} parcelle{inc.parcelles > 1 ? 's' : ''} concernee{inc.parcelles > 1 ? 's' : ''} - {new Date(inc.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}
