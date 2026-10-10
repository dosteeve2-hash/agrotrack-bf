'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Package, CheckCircle, Clock, AlertTriangle, X, Download, Scale } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import EtatVide from '@/components/EtatVide'
import { useFormatMontant } from '@/lib/compte/useParametresCompte'
import { libelleCulture } from '@/lib/cultures'

type Statut = 'Validee' | 'En attente' | 'Rejetee'
type Produit = string

interface Collecte {
  id: string; membre: string; village: string; produit: Produit
  quantiteKg: number; prixUnit: number; date: string; statut: Statut
  notes?: string; lotRef?: string
}

// Aucune donnée d'exemple : les collectes viendront de la base quand ce module y sera raccordé.
const COLLECTES: Collecte[] = []

const PALETTE = ['#D4AF37', '#00D4FF', '#10b981', '#F97316', '#a78bfa', '#EC4899', '#34D399', '#F5D76E']
const couleurProduit = (produits: Produit[], p: Produit) => PALETTE[Math.max(0, produits.indexOf(p)) % PALETTE.length]

const card: React.CSSProperties = { background: '#0c1a34', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.08)' }
const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'white', padding: '8px 12px', fontSize: 13, outline: 'none' }

function StatutBadge({ s }: { s: Statut }) {
  const cfg = {
    'Validee':    { color: '#10b981', bg: 'rgba(16,185,129,0.15)',  label: 'Validee',    icon: CheckCircle   },
    'En attente': { color: '#D4AF37', bg: 'rgba(212,175,55,0.15)',  label: 'En attente', icon: Clock         },
    'Rejetee':    { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   label: 'Rejetee',    icon: AlertTriangle },
  }[s]
  const Icon = cfg.icon
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20,
      background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 600 }}>
      <Icon size={10} />{cfg.label}
    </span>
  )
}

export default function CollectesPage() {
  const [search,       setSearch]       = useState('')
  const [filtreProduit, setFiltreProduit] = useState<Produit | 'Tous'>('Tous')
  const [filtreStatut, setFiltreStatut] = useState<Statut | 'Tous'>('Tous')
  const [selected,     setSelected]     = useState<Collecte | null>(null)
  const fmt = useFormatMontant()

  const filtered = useMemo(() => COLLECTES.filter(c => {
    const q = search.toLowerCase()
    const ok1 = c.membre.toLowerCase().includes(q) || c.village.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    const ok2 = filtreProduit === 'Tous' || c.produit === filtreProduit
    const ok3 = filtreStatut === 'Tous' || c.statut === filtreStatut
    return ok1 && ok2 && ok3
  }), [search, filtreProduit, filtreStatut])

  const totalKg     = COLLECTES.reduce((s, c) => s + c.quantiteKg, 0)
  const totalCA     = COLLECTES.reduce((s, c) => s + c.quantiteKg * c.prixUnit, 0)
  const nbValides   = COLLECTES.filter(c => c.statut === 'Validee').length
  const nbRejetes   = COLLECTES.filter(c => c.statut === 'Rejetee').length

  const produits = [...new Set(COLLECTES.map(c => c.produit))] as Produit[]
  const chartData = produits.map(p => ({
    name: libelleCulture(p).split(' ')[0],
    kg: COLLECTES.filter(c => c.produit === p).reduce((s, c) => s + c.quantiteKg, 0),
    color: couleurProduit(produits, p),
  }))

  if (COLLECTES.length === 0) {
    return (
      <div style={{ background: '#0A1628', minHeight: '100vh', padding: 24, color: 'white' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Collectes</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 24 }}>Aucune collecte enregistrée</p>
        <EtatVide sombre
          titre="Aucune collecte : enregistrez la première"
          texte="Les apports de vos membres (culture, quantité, prix, date) apparaîtront ici. La saisie des collectes n’est pas encore raccordée à la base dans cette version." />
      </div>
    )
  }

  return (
    <div style={{ background: '#0A1628', minHeight: '100vh', padding: 24, color: 'white' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Collectes</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            {COLLECTES.length} collectes · {totalKg.toLocaleString('fr-FR')} kg · CA {fmt(totalCA)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer' }}>
            <Download size={14} /> Exporter
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10,
            background: '#D4AF37', color: '#0A1628', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            <Plus size={14} /> Nouvelle collecte
          </button>
        </div>
      </div>

      {nbRejetes > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 10, marginBottom: 20,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertTriangle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
            <strong style={{ color: '#ef4444' }}>{nbRejetes} collecte{nbRejetes > 1 ? 's' : ''} rejetee{nbRejetes > 1 ? 's' : ''}</strong> — verifier la qualite des lots concernes
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Volume total',   value: `${totalKg.toLocaleString('fr-FR')} kg`, icon: Scale,        color: '#D4AF37' },
          { label: 'CA collectes',   value: fmt(totalCA),                              icon: Package,      color: '#00D4FF' },
          { label: 'Lot valides',    value: `${nbValides}/${COLLECTES.length}`,             icon: CheckCircle,  color: '#10b981' },
          { label: 'Lots rejetes',   value: String(nbRejetes),                         icon: AlertTriangle, color: nbRejetes > 0 ? '#ef4444' : '#64748b' },
        ].map(k => (
          <div key={k.label} style={card}>
            <k.icon size={18} style={{ color: k.color, marginBottom: 10 }} />
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>{k.label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginBottom: 24 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Volume par produit (kg)</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: 'white' }}
              formatter={(v) => [`${Number(v).toLocaleString('fr-FR')} kg`, 'Volume']} />
            <Bar dataKey="kg" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Membre, localité, référence…"
            style={{ ...inp, width: '100%', paddingLeft: 32, boxSizing: 'border-box' as const }} />
        </div>
        <select value={filtreProduit} onChange={e => setFiltreProduit(e.target.value as Produit | 'Tous')} style={inp}>
          <option value="Tous">Tous produits</option>
          {produits.map(p => <option key={p} value={p}>{libelleCulture(p)}</option>)}
        </select>
        {(['Tous', 'Validee', 'En attente', 'Rejetee'] as const).map(s => {
          const active = filtreStatut === s
          const colors: Record<string, string> = { 'Validee': '#10b981', 'En attente': '#D4AF37', 'Rejetee': '#ef4444', 'Tous': '#D4AF37' }
          return (
            <button key={s} onClick={() => setFiltreStatut(s)}
              style={{ padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                background: active ? colors[s] : 'rgba(255,255,255,0.06)',
                color: active ? (s === 'En attente' || s === 'Tous' ? '#0A1628' : 'white') : 'rgba(255,255,255,0.5)' }}>
              {s === 'Validee' ? 'Validees' : s === 'Rejetee' ? 'Rejetees' : s}
            </button>
          )
        })}
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', alignSelf: 'center', marginLeft: 'auto' }}>
          {filtered.length} resultat{filtered.length > 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ background: '#0c1a34', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Ref', 'Membre', 'Village', 'Produit', 'Quantite', 'Prix unit', 'Total', 'Date', 'Statut'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} onClick={() => setSelected(c)}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)')}>
                <td style={{ padding: '11px 14px', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{c.id}</td>
                <td style={{ padding: '11px 14px', fontSize: 13, fontWeight: 600, color: 'white' }}>{c.membre}</td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{c.village}</td>
                <td style={{ padding: '11px 14px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                    background: couleurProduit(produits, c.produit) + '22', color: couleurProduit(produits, c.produit) }}>
                    {libelleCulture(c.produit)}
                  </span>
                </td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: '#D4AF37', fontWeight: 700 }}>{c.quantiteKg.toLocaleString('fr-FR')} kg</td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{fmt(c.prixUnit)}/kg</td>
                <td style={{ padding: '11px 14px', fontSize: 12, color: '#00D4FF', fontWeight: 700 }}>{fmt(c.quantiteKg * c.prixUnit)}</td>
                <td style={{ padding: '11px 14px', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{c.date}</td>
                <td style={{ padding: '11px 14px' }}><StatutBadge s={c.statut} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
          onClick={() => setSelected(null)}>
          <div style={{ background: '#0A1628', borderRadius: 16, padding: 28, width: '100%', maxWidth: 480, border: '1px solid rgba(255,255,255,0.12)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{selected.membre}</h2>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                    background: couleurProduit(produits, selected.produit) + '22', color: couleurProduit(produits, selected.produit) }}>
                    {libelleCulture(selected.produit)}
                  </span>
                  <StatutBadge s={selected.statut} />
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                ['Reference',  selected.id],
                ['Village',    selected.village],
                ['Quantite',   `${selected.quantiteKg.toLocaleString('fr-FR')} kg`],
                ['Prix unitaire', `${fmt(selected.prixUnit)}/kg`],
                ['Total',      fmt(selected.quantiteKg * selected.prixUnit)],
                ['Date',       selected.date],
                ...(selected.lotRef ? [['Lot ref', selected.lotRef]] : []),
              ].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 12px' }}>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>{k}</p>
                  <p style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{v}</p>
                </div>
              ))}
            </div>
            {selected.notes && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: '#ef4444', marginBottom: 4 }}>Motif rejet</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{selected.notes}</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setSelected(null)}
                style={{ flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)' }}>
                Fermer
              </button>
              {selected.statut === 'En attente' && (
                <button style={{ flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  border: 'none', background: '#10b981', color: 'white' }}>
                  Valider
                </button>
              )}
              <button style={{ flex: 1, padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: 'none', background: '#D4AF37', color: '#0A1628' }}>
                Imprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
