'use client'

import { useEffect, useState } from 'react'
import { Download, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'

type TxType = 'Vente' | 'Achat intrants' | 'Main d\'œuvre'

interface Transaction {
  id: string; date: string; type: TxType
  description: string; montant: number; solde: number
}

const CHART_DATA = [
  { mois: 'Fév',  revenus: 650, depenses: 280 },
  { mois: 'Mars', revenus: 720, depenses: 420 },
  { mois: 'Avr',  revenus: 850, depenses: 350 },
  { mois: 'Mai',  revenus: 680, depenses: 290 },
  { mois: 'Juin', revenus: 780, depenses: 260 },
  { mois: 'Juil', revenus: 570, depenses: 250 },
]

const TRANSACTIONS: Transaction[] = [
  { id: 'T01', date: '2026-02-05', type: 'Vente',          description: 'Vente sorgho – Coopérative Kaya',       montant:  320000, solde:  320000 },
  { id: 'T02', date: '2026-02-18', type: 'Achat intrants', description: 'Engrais NPK 50 kg × 20 sacs',           montant: -180000, solde:  140000 },
  { id: 'T03', date: '2026-03-04', type: 'Vente',          description: 'Vente sésame – Marché de Ouagadougou',  montant:  450000, solde:  590000 },
  { id: 'T04', date: '2026-03-20', type: 'Main d\'œuvre',  description: 'Labour mécanisé – 5 ha Parcelle B',     montant: -120000, solde:  470000 },
  { id: 'T05', date: '2026-04-08', type: 'Achat intrants', description: 'Semences mil certifié INERA',           montant: -95000,  solde:  375000 },
  { id: 'T06', date: '2026-04-22', type: 'Vente',          description: 'Vente coton SOFITEX – lot 1',           montant:  780000, solde: 1155000 },
  { id: 'T07', date: '2026-05-10', type: 'Main d\'œuvre',  description: 'Sarclage parcelles C et D',             montant: -85000,  solde: 1070000 },
  { id: 'T08', date: '2026-05-28', type: 'Achat intrants', description: 'Pesticides + herbicides saison humide', montant: -70000,  solde: 1000000 },
  { id: 'T09', date: '2026-06-15', type: 'Vente',          description: 'Vente maïs – Groupement de Dori',       montant:  560000, solde: 1560000 },
  { id: 'T10', date: '2026-07-03', type: 'Main d\'œuvre',  description: 'Récolte manuelle sorgho Parcelle A',    montant: -110000, solde: 1450000 },
]

const TX_CFG: Record<TxType, { color: string; bg: string }> = {
  'Vente':          { color: '#4ade80', bg: 'rgba(74,222,128,0.15)'  },
  'Achat intrants': { color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  'Main d\'œuvre':  { color: '#fb923c', bg: 'rgba(251,146,60,0.15)'  },
}

const KPIS = [
  { label: 'Revenus saison',    value: '4 250 000', unit: 'FCFA', color: '#4ade80', icon: TrendingUp   },
  { label: 'Dépenses intrants', value: '1 850 000', unit: 'FCFA', color: '#f87171', icon: TrendingDown  },
  { label: 'Bénéfice net',      value: '2 400 000', unit: 'FCFA', color: '#D4AF37', icon: DollarSign   },
  { label: 'ROI saison',        value: '130',        unit: '%',    color: '#00D4FF', icon: BarChart3    },
]

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.abs(n))

function exportCSV(rows: Transaction[]) {
  const header = 'Date,Type,Description,Montant (FCFA),Solde (FCFA)\n'
  const body = rows.map(r => `${r.date},"${r.type}","${r.description}",${r.montant},${r.solde}`).join('\n')
  const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'finances_agrotrack.csv'; a.click()
  URL.revokeObjectURL(url)
}

const S = {
  page:  { backgroundColor: '#060f1e', minHeight: '100vh', padding: '1.5rem', color: 'white' } as React.CSSProperties,
  card:  { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem' } as React.CSSProperties,
  th:    { color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', padding: '0.75rem 1.25rem', textAlign: 'left' as const },
  td:    { padding: '0.7rem 1.25rem', fontSize: '0.85rem' } as React.CSSProperties,
}

export default function FinancesPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Finances agricoles</h1>
          <p style={{ fontSize: '0.78rem', color: '#8899bb', marginTop: 4 }}>Saison 2026 · Données en FCFA</p>
        </div>
        <button onClick={() => exportCSV(TRANSACTIONS)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)', cursor: 'pointer' }}>
          <Download style={{ width: 15, height: 15 }} /> Exporter CSV
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {KPIS.map(({ label, value, unit, color, icon: Icon }) => (
          <div key={label} style={{ ...S.card, padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.68rem', color: '#8899bb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
              <Icon style={{ width: 17, height: 17, color }} />
            </div>
            <p style={{ fontSize: '1.35rem', fontWeight: 700, color }}>{value} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{unit}</span></p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{ ...S.card, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Revenus vs Dépenses — Saison humide 2026 (×1 000 FCFA)
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={CHART_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="mois" tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}k`} />
            <Tooltip contentStyle={{ backgroundColor: '#0c1a34', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: 'white', fontSize: 12 }} formatter={(v: any) => [`${v} k FCFA`]} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#8899bb' }} />
            <Bar dataKey="revenus"  name="Revenus"  fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="depenses" name="Dépenses" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions Table */}
      <div style={{ ...S.card, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Historique des transactions</p>
          <span style={{ fontSize: '0.72rem', color: '#8899bb' }}>{TRANSACTIONS.length} entrées</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(212,175,55,0.06)' }}>
                {['Date', 'Type', 'Description', 'Montant', 'Solde'].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((tx, i) => {
                const cfg = TX_CFG[tx.type]
                const isPos = tx.montant > 0
                return (
                  <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{ ...S.td, color: '#8899bb', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {new Date(tx.date + 'T00:00:00').toLocaleDateString('fr-FR')}
                    </td>
                    <td style={S.td}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 20, backgroundColor: cfg.bg, color: cfg.color }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ ...S.td, color: '#cbd5e1', maxWidth: 300 }}>{tx.description}</td>
                    <td style={{ ...S.td, textAlign: 'right', fontWeight: 600, color: isPos ? '#4ade80' : '#f87171' }}>
                      {isPos ? '+' : '−'}{fmt(tx.montant)}
                    </td>
                    <td style={{ ...S.td, textAlign: 'right', color: '#D4AF37', fontWeight: 600 }}>
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
