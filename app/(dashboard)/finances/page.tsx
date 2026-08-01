'use client'

import { Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

type TxType = 'Vente' | 'Achat intrants' | 'Main d\'œuvre'

interface Transaction {
  id: string
  date: string
  type: TxType
  description: string
  montant: number   // + vente, - dépense
  solde: number
}

// ─── Données fictives ─────────────────────────────────────────────────────────

const CHART_DATA = [
  { mois:'Fév', revenus:650, depenses:280 },
  { mois:'Mars', revenus:720, depenses:420 },
  { mois:'Avr', revenus:850, depenses:350 },
  { mois:'Mai', revenus:680, depenses:290 },
  { mois:'Juin', revenus:780, depenses:260 },
  { mois:'Juil', revenus:570, depenses:250 },
]

const TRANSACTIONS: Transaction[] = [
  { id:'T01', date:'2026-02-05', type:'Vente',          description:'Vente sorgho – Coopérative Kaya',        montant: 320000,  solde:  320000 },
  { id:'T02', date:'2026-02-18', type:'Achat intrants',  description:'Engrais NPK 50 kg × 20 sacs',            montant: -180000, solde:  140000 },
  { id:'T03', date:'2026-03-04', type:'Vente',           description:'Vente sésame – Marché de Ouagadougou',   montant: 450000,  solde:  590000 },
  { id:'T04', date:'2026-03-20', type:'Main d\'œuvre',   description:'Labour mécanisé – 5 ha Parcelle B',      montant: -120000, solde:  470000 },
  { id:'T05', date:'2026-04-08', type:'Achat intrants',  description:'Semences mil certifié INERA',            montant: -95000,  solde:  375000 },
  { id:'T06', date:'2026-04-22', type:'Vente',           description:'Vente coton SOFITEX – lot 1',            montant: 780000,  solde: 1155000 },
  { id:'T07', date:'2026-05-10', type:'Main d\'œuvre',   description:'Sarclage parcelles C et D',              montant: -85000,  solde: 1070000 },
  { id:'T08', date:'2026-05-28', type:'Achat intrants',  description:'Pesticides + herbicides saison humide',  montant: -70000,  solde: 1000000 },
  { id:'T09', date:'2026-06-15', type:'Vente',           description:'Vente maïs – Groupement de Dori',        montant: 560000,  solde: 1560000 },
  { id:'T10', date:'2026-07-03', type:'Main d\'œuvre',   description:'Récolte manuelle sorgho Parcelle A',     montant: -110000, solde: 1450000 },
]

const TX_COLORS: Record<TxType, string> = {
  'Vente':          '#10b981',
  'Achat intrants': '#ef4444',
  'Main d\'œuvre':  '#f97316',
}

// ─── KPIs ──────────────────────────────────────────────────────────────────────

const KPIS = [
  { label:'Revenus de la saison', value:'4 250 000',  unit:'FCFA', color:'#10b981', sub:'+12% vs saison précédente' },
  { label:'Dépenses intrants',    value:'1 850 000',  unit:'FCFA', color:'#ef4444', sub:'Engrais, semences, traitements' },
  { label:'Bénéfice net',         value:'2 400 000',  unit:'FCFA', color:'#D4AF37', sub:'Après main d\'œuvre incluse' },
  { label:'ROI saison',           value:'130',         unit:'%',    color:'#00D4FF', sub:'Retour sur investissement' },
]

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  const abs = Math.abs(n)
  return new Intl.NumberFormat('fr-FR').format(abs)
}

function exportCSV(rows: Transaction[]) {
  const header = 'Date,Type,Description,Montant (FCFA),Solde (FCFA)\n'
  const body   = rows.map(r =>
    `${r.date},"${r.type}","${r.description}",${r.montant},${r.solde}`
  ).join('\n')
  const blob = new Blob([header + body], { type:'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'transactions_agrotrack.csv'; a.click()
  URL.revokeObjectURL(url)
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FinancesPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finances agricoles</h1>
          <p className="text-gray-500 text-sm mt-0.5">Saison 2026 · Données en FCFA</p>
        </div>
        <button onClick={() => exportCSV(TRANSACTIONS)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 border"
          style={{ borderColor:'#D4AF37', color:'#D4AF37' }}>
          <Download className="w-4 h-4" /> Exporter CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KPIS.map(k => (
          <div key={k.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-2">{k.label}</p>
            <p className="text-2xl font-bold" style={{ color: k.color }}>
              {k.value} <span className="text-sm font-medium">{k.unit}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Revenus vs Dépenses — Saison humide 2026 (×1 000 FCFA)
        </h2>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA} margin={{ top:4, right:16, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" tick={{ fontSize:12, fill:'#6b7280' }} />
              <YAxis tick={{ fontSize:12, fill:'#6b7280' }} />
              <Tooltip
                formatter={(v) => [`${new Intl.NumberFormat('fr-FR').format(Number(Array.isArray(v) ? v[0] : (v ?? 0)))} k FCFA`]}
                contentStyle={{ borderRadius:8, border:'1px solid #e5e7eb', fontSize:12 }}
              />
              <Legend wrapperStyle={{ fontSize:12 }} />
              <Bar dataKey="revenus"  name="Revenus"  fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="depenses" name="Dépenses" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Historique des transactions</h2>
          <span className="text-xs text-gray-400">{TRANSACTIONS.length} transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-left">Description</th>
                <th className="px-5 py-3 text-right">Montant (FCFA)</th>
                <th className="px-5 py-3 text-right">Solde (FCFA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TRANSACTIONS.map(tx => {
                const isPos = tx.montant > 0
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(tx.date + 'T00:00:00').toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: TX_COLORS[tx.type] + '18', color: TX_COLORS[tx.type] }}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700 max-w-xs truncate">{tx.description}</td>
                    <td className={`px-5 py-3 text-right font-semibold ${isPos ? 'text-emerald-600' : 'text-red-500'}`}>
                      {isPos ? '+' : '−'}{fmt(tx.montant)}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700 font-medium">
                      {new Intl.NumberFormat('fr-FR').format(tx.solde)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
