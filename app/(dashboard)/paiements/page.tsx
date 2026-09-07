'use client'

import { useState } from 'react'
import { Plus, DollarSign, Clock, CheckCircle, TrendingUp, X, Phone } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

// ─── Types ──────────────────────────────────────────────────────────────────
type Statut  = 'Paye' | 'En attente' | 'Partiel' | 'Rejete'
type Methode = 'Mobile Money' | 'Especes' | 'Virement' | 'Cheque'
type Produit = 'Coton' | 'Sesame' | 'Karite' | 'Mais' | 'Arachide' | 'Sorgho'

interface Paiement {
  id: string; membre: string; montant: number; produit: Produit
  date: string; methode: Methode; telephone: string
  statut: Statut; reference: string; quantite: number; unite: string
}

// ─── Data ──────────────────────────────────────────────────────────────────
const PAIEMENTS: Paiement[] = [
  { id: 'P001', membre: 'Ouedraogo Adama',   montant: 233750, produit: 'Coton',    date: '2026-07-12', methode: 'Mobile Money', telephone: '+226 70 11 22 33', statut: 'Paye',       reference: 'MM-2026-001', quantite: 808,  unite: 'kg' },
  { id: 'P002', membre: 'Sawadogo Fatima',   montant: 54000,  produit: 'Sesame',   date: '2026-07-12', methode: 'Especes',      telephone: '+226 76 44 55 66', statut: 'En attente', reference: '—',           quantite: 120,  unite: 'kg' },
  { id: 'P003', membre: 'Kabore Ibrahim',    montant: 184250, produit: 'Coton',    date: '2026-07-11', methode: 'Mobile Money', telephone: '+226 65 77 88 99', statut: 'Paye',       reference: 'MM-2026-002', quantite: 637,  unite: 'kg' },
  { id: 'P004', membre: 'Zongo Marie',       montant: 76000,  produit: 'Karite',   date: '2026-07-11', methode: 'Virement',     telephone: '+226 71 22 33 44', statut: 'En attente', reference: '—',           quantite: 200,  unite: 'kg' },
  { id: 'P005', membre: 'Tiendrebeogo Paul', montant: 312000, produit: 'Coton',    date: '2026-07-10', methode: 'Mobile Money', telephone: '+226 70 55 66 77', statut: 'Paye',       reference: 'MM-2026-003', quantite: 1080, unite: 'kg' },
  { id: 'P006', membre: 'Ouattara Aissata',  montant: 168000, produit: 'Mais',     date: '2026-07-10', methode: 'Especes',      telephone: '+226 65 33 44 55', statut: 'Partiel',    reference: '—',           quantite: 1155, unite: 'kg' },
  { id: 'P007', membre: 'Beogo Celestin',    montant: 48600,  produit: 'Sesame',   date: '2026-07-09', methode: 'Mobile Money', telephone: '+226 76 88 99 00', statut: 'Paye',       reference: 'MM-2026-004', quantite: 108,  unite: 'kg' },
  { id: 'P008', membre: 'Compaore Salimata', montant: 92500,  produit: 'Arachide', date: '2026-07-08', methode: 'Virement',     telephone: '+226 71 00 11 22', statut: 'Paye',       reference: 'VIR-2026-01', quantite: 205,  unite: 'kg' },
  { id: 'P009', membre: 'Nana Dramane',      montant: 58800,  produit: 'Sorgho',   date: '2026-07-07', methode: 'Cheque',       telephone: '+226 70 22 33 44', statut: 'En attente', reference: 'CHQ-0041',    quantite: 490,  unite: 'kg' },
  { id: 'P010', membre: 'Sawadogo Issa',     montant: 140000, produit: 'Coton',    date: '2026-07-06', methode: 'Mobile Money', telephone: '+226 65 55 66 77', statut: 'Rejete',     reference: '—',           quantite: 484,  unite: 'kg' },
]

const METHODE_TOTAUX = ['Mobile Money', 'Especes', 'Virement', 'Cheque'].map(m => ({
  name: m,
  total: PAIEMENTS.filter(p => p.methode === m).reduce((a, p) => a + p.montant, 0),
  color: m === 'Mobile Money' ? '#00D4FF' : m === 'Especes' ? '#10b981' : m === 'Virement' ? '#818CF8' : '#D4AF37',
}))

const STATUTS: (Statut | 'Tous')[] = ['Tous', 'Paye', 'En attente', 'Partiel', 'Rejete']
const METHODES: (Methode | 'Tous')[] = ['Tous', 'Mobile Money', 'Especes', 'Virement', 'Cheque']

// ─── Config ─────────────────────────────────────────────────────────────────
const STATUT_CFG: Record<Statut, { color: string; bg: string; icon: typeof CheckCircle }> = {
  'Paye':       { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle },
  'En attente': { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)', icon: Clock       },
  'Partiel':    { color: '#818CF8', bg: 'rgba(129,140,248,0.12)', icon: TrendingUp  },
  'Rejete':     { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: X           },
}

const METHODE_COLOR: Record<Methode, string> = {
  'Mobile Money': '#00D4FF', 'Especes': '#10b981', 'Virement': '#818CF8', 'Cheque': '#D4AF37',
}

const fmtFCFA = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
const card: React.CSSProperties = { backgroundColor: '#0c1a34', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.25rem' }

// ─── Page ───────────────────────────────────────────────────────────────────
export default function PaiementsPage() {
  const [statutFilter, setStatutFilter] = useState<Statut | 'Tous'>('Tous')
  const [methodeFilter, setMethodeFilter] = useState<Methode | 'Tous'>('Tous')
  const [selected, setSelected] = useState<Paiement | null>(null)

  const filtered = PAIEMENTS.filter(p =>
    (statutFilter  === 'Tous' || p.statut  === statutFilter) &&
    (methodeFilter === 'Tous' || p.methode === methodeFilter)
  )

  const totalPaye    = PAIEMENTS.filter(p => p.statut === 'Paye').reduce((a, p) => a + p.montant, 0)
  const totalAttente = PAIEMENTS.filter(p => p.statut === 'En attente').reduce((a, p) => a + p.montant, 0)
  const totalPartiel = PAIEMENTS.filter(p => p.statut === 'Partiel').reduce((a, p) => a + p.montant, 0)
  const tauxPaiement = Math.round((PAIEMENTS.filter(p => p.statut === 'Paye').length / PAIEMENTS.length) * 100)

  return (
    <div style={{ padding: '1.5rem', color: 'white', background: '#0A1628', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#f0f4ff', fontWeight: 800, fontSize: '1.5rem', margin: '0 0 0.25rem' }}>
            <DollarSign style={{ display: 'inline', width: 20, height: 20, marginRight: 8, color: '#D4AF37', verticalAlign: 'middle' }} />
            Paiements
          </h1>
          <p style={{ color: '#8899bb', fontSize: '0.85rem', margin: 0 }}>Mobile Money · Especes · Virements · Cheques</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#D4AF37', color: '#0A1628', border: 'none', borderRadius: 10, padding: '0.55rem 1rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
          <Plus style={{ width: 14, height: 14 }} /> Enregistrer un paiement
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total paye',       value: fmtFCFA(totalPaye),    color: '#10b981', icon: CheckCircle },
          { label: 'En attente',       value: fmtFCFA(totalAttente), color: '#D4AF37', icon: Clock      },
          { label: 'Partiel',          value: fmtFCFA(totalPartiel), color: '#818CF8', icon: TrendingUp },
          { label: 'Taux de paiement', value: `${tauxPaiement}%`,   color: '#00D4FF', icon: DollarSign },
        ].map((k, i) => (
          <div key={i} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ color: '#8899bb', fontSize: '0.7rem' }}>{k.label}</span>
              <k.icon style={{ width: 14, height: 14, color: k.color }} />
            </div>
            <p style={{ color: k.color, fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>{k.value}</p>
            {k.label === 'Taux de paiement' && (
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', marginTop: 8 }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${tauxPaiement}%`, background: '#00D4FF' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

        {/* BarChart par methode */}
        <div style={card}>
          <h3 style={{ color: '#f0f4ff', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            Volume par methode de paiement (FCFA)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={METHODE_TOTAUX} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8899bb' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#8899bb' }} axisLine={false} tickLine={false} tickFormatter={(v) => (Number(v) / 1000).toFixed(0) + 'k'} />
              <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11, color: 'white' }} formatter={(v) => [fmtFCFA(Number(v)), 'Total']} />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {METHODE_TOTAUX.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PieChart statuts */}
        <div style={card}>
          <h3 style={{ color: '#f0f4ff', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            Repartition par statut
          </h3>
          {(() => {
            const PIE = [
              { name: 'Paye',       value: PAIEMENTS.filter(p => p.statut === 'Paye').length,       color: '#10b981' },
              { name: 'En attente', value: PAIEMENTS.filter(p => p.statut === 'En attente').length, color: '#D4AF37' },
              { name: 'Partiel',    value: PAIEMENTS.filter(p => p.statut === 'Partiel').length,    color: '#818CF8' },
              { name: 'Rejete',     value: PAIEMENTS.filter(p => p.statut === 'Rejete').length,     color: '#ef4444' },
            ]
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={PIE} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                      {PIE.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PIE.map(d => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: '#8899bb' }}>{d.name}</span>
                      <span style={{ fontSize: 12, color: d.color, fontWeight: 700, marginLeft: 'auto' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <span style={{ color: '#8899bb', fontSize: '0.75rem', alignSelf: 'center', marginRight: 4 }}>Statut :</span>
        {STATUTS.map(s => {
          const cfg = s !== 'Tous' ? STATUT_CFG[s] : null
          const isActive = statutFilter === s
          return (
            <button key={s} onClick={() => setStatutFilter(s)} style={{
              padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
              cursor: 'pointer', border: '1px solid',
              background: isActive ? (cfg ? cfg.bg : 'rgba(255,255,255,0.08)') : 'transparent',
              borderColor: isActive ? (cfg ? cfg.color : 'rgba(255,255,255,0.2)') : 'rgba(255,255,255,0.08)',
              color: isActive ? (cfg ? cfg.color : '#f0f4ff') : '#8899bb',
            }}>{s}</button>
          )
        })}
        <span style={{ color: '#8899bb', fontSize: '0.75rem', alignSelf: 'center', marginLeft: 12, marginRight: 4 }}>Methode :</span>
        {METHODES.map(m => {
          const isActive = methodeFilter === m
          const c = m !== 'Tous' ? METHODE_COLOR[m] : '#f0f4ff'
          return (
            <button key={m} onClick={() => setMethodeFilter(m)} style={{
              padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
              cursor: 'pointer', border: '1px solid',
              background: isActive ? `${c}22` : 'transparent',
              borderColor: isActive ? c : 'rgba(255,255,255,0.08)',
              color: isActive ? c : '#8899bb',
            }}>{m}</button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,212,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Ref', 'Membre', 'Produit / Qt', 'Montant', 'Date', 'Methode', 'Statut', 'Detail'].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', color: '#8899bb', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const cfg = STATUT_CFG[p.statut]
              const StatIcon = cfg.icon
              return (
                <tr key={p.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#5a6a85', fontFamily: 'monospace' }}>{p.id}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <p style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '0.82rem', margin: 0 }}>{p.membre}</p>
                    <p style={{ color: '#5a6a85', fontSize: '0.68rem', margin: '2px 0 0' }}>{p.telephone}</p>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <p style={{ color: '#00D4FF', fontWeight: 600, fontSize: '0.78rem', margin: 0 }}>{p.produit}</p>
                    <p style={{ color: '#5a6a85', fontSize: '0.68rem', margin: '2px 0 0' }}>{new Intl.NumberFormat('fr-FR').format(p.quantite)} {p.unite}</p>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#f0f4ff', fontWeight: 800, fontSize: '0.85rem' }}>
                    {fmtFCFA(p.montant)}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#8899bb', fontSize: '0.78rem' }}>{p.date}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600, background: `${METHODE_COLOR[p.methode]}22`, color: METHODE_COLOR[p.methode] }}>
                      {p.methode}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, background: cfg.bg, color: cfg.color }}>
                      <StatIcon style={{ width: 10, height: 10 }} />{p.statut}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <button onClick={() => setSelected(p)} style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: '#D4AF37', fontSize: '0.7rem', fontWeight: 600 }}>
                      Voir
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#8899bb', fontSize: '0.85rem' }}>
            Aucun paiement pour ces filtres
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (() => {
        const cfg = STATUT_CFG[selected.statut]
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, backdropFilter: 'blur(4px)' }}
            onClick={() => setSelected(null)}>
            <div style={{ background: '#0c1a34', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '2rem', width: 440, maxWidth: '90vw' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ color: '#f0f4ff', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 4px' }}>{selected.membre}</h2>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700, background: cfg.bg, color: cfg.color }}>
                    {selected.statut}
                  </span>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: '#8899bb' }}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>

              {[
                ['Montant',    fmtFCFA(selected.montant)],
                ['Produit',    `${selected.produit} — ${new Intl.NumberFormat('fr-FR').format(selected.quantite)} ${selected.unite}`],
                ['Date',       selected.date],
                ['Methode',    selected.methode],
                ['Reference',  selected.reference],
                ['Telephone',  selected.telephone],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#8899bb', fontSize: '0.8rem' }}>{label}</span>
                  <span style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.8rem' }}>{value}</span>
                </div>
              ))}

              <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem' }}>
                <button style={{ flex: 1, padding: '0.65rem', background: '#10b981', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <CheckCircle style={{ width: 13, height: 13 }} /> Marquer paye
                </button>
                <button style={{ flex: 1, padding: '0.65rem', background: 'rgba(255,255,255,0.05)', color: '#8899bb', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Phone style={{ width: 13, height: 13 }} /> Contacter
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
