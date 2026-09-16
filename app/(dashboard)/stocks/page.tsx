'use client'

import { useState } from 'react'
import { Package2, AlertTriangle, Warehouse, TrendingDown, X, Plus, Eye } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

// ─── Types ──────────────────────────────────────────────────────────────────
type Alerte = 'Normal' | 'Faible' | 'Critique'
type Produit =
  | 'Coton grade A' | 'Coton grade B' | 'Sesame blanc'
  | 'Karite brut'   | 'Mais grain sec' | 'Arachide'
  | 'Sorgho'        | 'Niebe'          | 'Fonio'

// ─── Data ──────────────────────────────────────────────────────────────────
interface Stock {
  id: string; produit: Produit; quantite: number; seuil: number
  unite: string; entrepot: string; valeur: number
  dateEntree: string; alerte: Alerte; lot: string
}

const STOCKS: Stock[] = [
  { id: '1', produit: 'Coton grade A',  quantite: 28500, seuil: 5000,  unite: 'kg', entrepot: 'Koudougou central',   valeur: 8242500,  dateEntree: '2026-07-10', alerte: 'Normal',   lot: 'LOT-2026-CGA-01' },
  { id: '2', produit: 'Sesame blanc',   quantite: 4200,  seuil: 2000,  unite: 'kg', entrepot: 'Koudougou central',   valeur: 1890000,  dateEntree: '2026-07-11', alerte: 'Normal',   lot: 'LOT-2026-SES-01' },
  { id: '3', produit: 'Karite brut',    quantite: 380,   seuil: 1000,  unite: 'kg', entrepot: 'Entrepot Dedougou',   valeur: 144400,   dateEntree: '2026-07-08', alerte: 'Critique', lot: 'LOT-2026-KAR-03' },
  { id: '4', produit: 'Mais grain sec', quantite: 12000, seuil: 3000,  unite: 'kg', entrepot: 'Entrepot Bobo',       valeur: 1740000,  dateEntree: '2026-07-09', alerte: 'Normal',   lot: 'LOT-2026-MAI-02' },
  { id: '5', produit: 'Arachide',       quantite: 1850,  seuil: 2000,  unite: 'kg', entrepot: 'Entrepot Dedougou',   valeur: 833000,   dateEntree: '2026-07-15', alerte: 'Faible',   lot: 'LOT-2026-ARA-01' },
  { id: '6', produit: 'Coton grade B',  quantite: 15200, seuil: 5000,  unite: 'kg', entrepot: 'Entrepot Bobo',       valeur: 3344000,  dateEntree: '2026-07-12', alerte: 'Normal',   lot: 'LOT-2026-CGB-01' },
  { id: '7', produit: 'Sorgho',         quantite: 6800,  seuil: 2000,  unite: 'kg', entrepot: 'Koudougou central',   valeur: 816000,   dateEntree: '2026-07-20', alerte: 'Normal',   lot: 'LOT-2026-SOR-01' },
  { id: '8', produit: 'Niebe',          quantite: 920,   seuil: 1500,  unite: 'kg', entrepot: 'Entrepot Dedougou',   valeur: 552000,   dateEntree: '2026-07-22', alerte: 'Faible',   lot: 'LOT-2026-NIE-01' },
  { id: '9', produit: 'Fonio',          quantite: 2100,  seuil: 500,   unite: 'kg', entrepot: 'Entrepot Bobo',       valeur: 945000,   dateEntree: '2026-07-18', alerte: 'Normal',   lot: 'LOT-2026-FON-01' },
]

const CHART_DATA = STOCKS.map(s => ({
  name: s.produit.length > 12 ? s.produit.slice(0, 12) + '…' : s.produit,
  quantite: s.quantite,
  color: s.alerte === 'Critique' ? '#ef4444' : s.alerte === 'Faible' ? '#D4AF37' : '#00D4FF',
}))

const ENTREPOTS = ['Tous', 'Koudougou central', 'Entrepot Dedougou', 'Entrepot Bobo']
const ALERTES_FILTER: Alerte[] = ['Normal', 'Faible', 'Critique']

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmtFCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
const fmtQty  = (n: number, u: string) => new Intl.NumberFormat('fr-FR').format(n) + ' ' + u

const ALERTE_CFG = {
  'Normal':   { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  label: 'Normal'   },
  'Faible':   { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)',  label: 'Faible'   },
  'Critique': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Critique' },
}

const card: React.CSSProperties = {
  backgroundColor: '#0c1a34', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.25rem',
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function StocksPage() {
  const [entrepot, setEntrepot] = useState('Tous')
  const [alerteFilter, setAlerteFilter] = useState<Alerte | 'Tous'>('Tous')
  const [selected, setSelected] = useState<Stock | null>(null)

  const filtered = STOCKS.filter(s =>
    (entrepot === 'Tous'      || s.entrepot === entrepot) &&
    (alerteFilter === 'Tous'  || s.alerte === alerteFilter)
  )

  const totalValeur = STOCKS.reduce((a, s) => a + s.valeur, 0)
  const totalQty    = STOCKS.reduce((a, s) => a + s.quantite, 0)
  const nbCritique  = STOCKS.filter(s => s.alerte === 'Critique').length
  const nbFaible    = STOCKS.filter(s => s.alerte === 'Faible').length

  return (
    <div style={{ padding: '1.5rem', color: 'white', background: '#0A1628', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#f0f4ff', fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem' }}>
            <Package2 style={{ display: 'inline', width: 20, height: 20, marginRight: 8, color: '#00D4FF', verticalAlign: 'middle' }} />
            Stocks
          </h1>
          <p style={{ color: '#8899bb', fontSize: '0.85rem', margin: 0 }}>9 produits · 3 entrepots · Aout 2026</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#D4AF37', color: '#0A1628', border: 'none', borderRadius: 10, padding: '0.55rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
          <Plus style={{ width: 14, height: 14 }} /> Entree stock
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Valeur totale',   value: fmtFCFA(totalValeur),          color: '#D4AF37', icon: Package2      },
          { label: 'Quantite totale', value: `${new Intl.NumberFormat('fr-FR').format(totalQty)} kg`, color: '#00D4FF', icon: Warehouse },
          { label: 'Alertes faibles', value: `${nbFaible} produit${nbFaible !== 1 ? 's' : ''}`, color: '#D4AF37', icon: AlertTriangle },
          { label: 'Alertes critiques', value: `${nbCritique} produit${nbCritique !== 1 ? 's' : ''}`, color: '#ef4444', icon: TrendingDown },
        ].map((k, i) => (
          <div key={i} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ color: '#8899bb', fontSize: '0.7rem' }}>{k.label}</span>
              <k.icon style={{ width: 14, height: 14, color: k.color }} />
            </div>
            <p style={{ color: k.color, fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + Filtres */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

        {/* BarChart */}
        <div style={card}>
          <h3 style={{ color: '#f0f4ff', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            Repartition par produit (kg)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8899bb' }} angle={-35} textAnchor="end" axisLine={false} tickLine={false} interval={0} />
              <YAxis tick={{ fontSize: 10, fill: '#8899bb' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: 'white' }} formatter={(v) => [new Intl.NumberFormat('fr-FR').format(Number(v)) + ' kg', 'Quantite']} />
              <Bar dataKey="quantite" radius={[4, 4, 0, 0]}>
                {CHART_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filtres */}
        <div style={card}>
          <h3 style={{ color: '#f0f4ff', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>Filtres</h3>

          <p style={{ color: '#8899bb', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Entrepot</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
            {ENTREPOTS.map(e => (
              <button key={e} onClick={() => setEntrepot(e)} style={{
                padding: '0.4rem 0.75rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, textAlign: 'left',
                cursor: 'pointer', transition: 'all 0.15s', border: '1px solid',
                background: entrepot === e ? 'rgba(0,212,255,0.1)' : 'transparent',
                borderColor: entrepot === e ? '#00D4FF' : 'rgba(255,255,255,0.08)',
                color: entrepot === e ? '#00D4FF' : '#8899bb',
              }}>{e}</button>
            ))}
          </div>

          <p style={{ color: '#8899bb', fontSize: '0.7rem', marginBottom: '0.5rem' }}>Etat</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(['Tous', ...ALERTES_FILTER] as const).map(a => {
              const cfg = a === 'Tous' ? null : ALERTE_CFG[a]
              const isActive = alerteFilter === a
              return (
                <button key={a} onClick={() => setAlerteFilter(a)} style={{
                  padding: '0.4rem 0.75rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, textAlign: 'left',
                  cursor: 'pointer', border: '1px solid',
                  background: isActive ? (cfg ? cfg.bg : 'rgba(255,255,255,0.06)') : 'transparent',
                  borderColor: isActive ? (cfg ? cfg.color : 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.08)',
                  color: isActive ? (cfg ? cfg.color : '#f0f4ff') : '#8899bb',
                }}>{a}</button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,212,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Produit', 'Quantite', 'Seuil min', 'Entrepot', 'Valeur (FCFA)', 'Etat', 'Detail'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', color: '#8899bb', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const cfg = ALERTE_CFG[s.alerte]
              const pct = Math.min(100, Math.round((s.quantite / s.seuil) * 100))
              return (
                <tr key={s.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Package2 style={{ width: 14, height: 14, color: '#8899bb' }} />
                      <div>
                        <p style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '0.82rem', margin: 0 }}>{s.produit}</p>
                        <p style={{ color: '#5a6a85', fontSize: '0.68rem', margin: '2px 0 0' }}>{s.lot}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ color: cfg.color, fontWeight: 800, fontSize: '0.85rem' }}>{fmtQty(s.quantite, s.unite)}</span>
                    {/* progress bar */}
                    <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', marginTop: 5, width: 80 }}>
                      <div style={{ height: '100%', borderRadius: 2, width: `${Math.min(pct, 100)}%`, background: cfg.color }} />
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#8899bb', fontSize: '0.8rem' }}>{fmtQty(s.seuil, s.unite)}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#8899bb', fontSize: '0.78rem' }}>{s.entrepot}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#f0f4ff', fontWeight: 700, fontSize: '0.82rem' }}>
                    {new Intl.NumberFormat('fr-FR').format(s.valeur)}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, background: cfg.bg, color: cfg.color }}>
                      {s.alerte === 'Critique' && <AlertTriangle style={{ display: 'inline', width: 10, height: 10, marginRight: 3 }} />}
                      {cfg.label}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button onClick={() => setSelected(s)} style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: '#00D4FF', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Eye style={{ width: 11, height: 11 }} /> Voir
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#8899bb', fontSize: '0.85rem' }}>
            Aucun stock pour ces filtres
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}
          onClick={() => setSelected(null)}>
          <div style={{ background: '#0c1a34', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '2rem', width: 420, maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ color: '#f0f4ff', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 4px' }}>{selected.produit}</h2>
                <p style={{ color: '#5a6a85', fontSize: '0.75rem', margin: 0 }}>{selected.lot}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#8899bb' }}>
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {[
              ['Quantite en stock',  fmtQty(selected.quantite, selected.unite)],
              ['Seuil minimum',      fmtQty(selected.seuil, selected.unite)],
              ['Valeur estimee',     fmtFCFA(selected.valeur)],
              ['Entrepot',           selected.entrepot],
              ['Date entree',        selected.dateEntree],
              ['Etat',               ALERTE_CFG[selected.alerte].label],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#8899bb', fontSize: '0.8rem' }}>{label}</span>
                <span style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.8rem' }}>{value}</span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem' }}>
              <button style={{ flex: 1, padding: '0.65rem', background: '#D4AF37', color: '#0A1628', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                <Plus style={{ display: 'inline', width: 13, height: 13, marginRight: 5 }} />Entree
              </button>
              <button style={{ flex: 1, padding: '0.65rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                Sortie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
