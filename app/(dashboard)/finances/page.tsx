'use client'

import { Download, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'
import EtatVide from '@/components/EtatVide'
import { useFormatMontant } from '@/lib/compte/useParametresCompte'
import { useHydrated } from '@/lib/useHydrated'

type TxType = 'Vente' | 'Achat intrants' | 'Main d\'œuvre'

interface Transaction {
  id: string; date: string; type: TxType
  description: string; montant: number; solde: number
}

// Aucune donnée d'exemple : les transactions viendront de la base quand ce module y sera raccordé.
const CHART_DATA: { mois: string; revenus: number; depenses: number }[] = []

const TRANSACTIONS: Transaction[] = []

const TX_CFG: Record<TxType, { color: string; bg: string }> = {
  'Vente':          { color: '#4ade80', bg: 'rgba(74,222,128,0.15)'  },
  'Achat intrants': { color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  'Main d\'œuvre':  { color: '#fb923c', bg: 'rgba(251,146,60,0.15)'  },
}

const fmtAbs = (n: number, fmt: (m: number) => string) => fmt(Math.abs(n))

function exportCSV(rows: Transaction[]) {
  const header = 'Date,Type,Description,Montant,Solde\n'
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
  const fmt = useFormatMontant()
  const monte = useHydrated()

  if (TRANSACTIONS.length === 0) {
    return (
      <div style={S.page}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Finances agricoles</h1>
        <p style={{ fontSize: '0.78rem', color: '#a9b6d0', margin: '4px 0 1.5rem' }}>Ventes, achats d’intrants et main-d’œuvre</p>
        <EtatVide sombre
          titre="Aucune transaction : enregistrez la première"
          texte="Vos revenus, dépenses et soldes apparaîtront ici, dans la devise de votre compte. L’enregistrement des transactions n’est pas encore raccordé à la base dans cette version." />
      </div>
    )
  }

  const totalRevenus = TRANSACTIONS.filter(t => t.montant > 0).reduce((a, t) => a + t.montant, 0)
  const totalDepenses = TRANSACTIONS.filter(t => t.montant < 0).reduce((a, t) => a + t.montant, 0)
  const KPIS = [
    { label: 'Revenus',    value: fmt(totalRevenus),                color: '#4ade80', icon: TrendingUp  },
    { label: 'Dépenses',   value: fmtAbs(totalDepenses, fmt),       color: '#f87171', icon: TrendingDown },
    { label: 'Résultat net', value: fmt(totalRevenus + totalDepenses), color: '#D4AF37', icon: DollarSign },
    { label: 'Transactions', value: String(TRANSACTIONS.length),    color: '#00D4FF', icon: BarChart3   },
  ]

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Finances agricoles</h1>
          <p style={{ fontSize: '0.78rem', color: '#8899bb', marginTop: 4 }}>Dans la devise de votre compte</p>
        </div>
        <button onClick={() => exportCSV(TRANSACTIONS)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.08)', cursor: 'pointer' }}>
          <Download style={{ width: 15, height: 15 }} /> Exporter CSV
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {KPIS.map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{ ...S.card, padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.68rem', color: '#8899bb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
              <Icon style={{ width: 17, height: 17, color }} />
            </div>
            <p style={{ fontSize: '1.35rem', fontWeight: 700, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{ ...S.card, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Revenus vs Dépenses par mois
        </p>
        {CHART_DATA.length === 0 || !monte ? <EtatVide sombre titre="Pas encore de données mensuelles" /> : <ResponsiveContainer width="100%" height={220}>
          <BarChart data={CHART_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="mois" tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#8899bb', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#0c1a34', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: 'white', fontSize: 12 }} formatter={(v) => [fmt(Number(v))]} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#8899bb' }} />
            <Bar dataKey="revenus"  name="Revenus"  fill="#4ade80" radius={[4, 4, 0, 0]} />
            <Bar dataKey="depenses" name="Dépenses" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>}
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
                      {isPos ? '+' : '−'}{fmtAbs(tx.montant, fmt)}
                    </td>
                    <td style={{ ...S.td, textAlign: 'right', color: '#D4AF37', fontWeight: 600 }}>
                      {fmt(tx.solde)}
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
