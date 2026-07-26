'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Package, Plus } from 'lucide-react'

interface Collecte {
  id: string
  membre: string
  produit: string
  quantite: number
  unite: string
  prixUnitaire: number
  total: number
  date: string
  statut: string
  pointCollecte: string
}

interface Props { collectes: Collecte[] }

const PRODUITS = ['Tous', 'Coton', 'Sésame', 'Karité']
const STATUTS = ['Tous', 'Pesé', 'Payé']

function formatFCFA(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

const fadeInUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.06 } } }

export default function CollectesClient({ collectes }: Props) {
  const [produit, setProduit] = useState('Tous')
  const [statut, setStatut] = useState('Tous')

  const filtered = useMemo(() => collectes.filter((c) => {
    const matchProduit = produit === 'Tous' || c.produit === produit
    const matchStatut = statut === 'Tous' || c.statut === statut
    return matchProduit && matchStatut
  }), [collectes, produit, statut])

  const today = collectes.filter((c) => c.date === '2026-07-12').length
  const tonnage = (collectes.reduce((acc, c) => acc + c.quantite, 0) / 1000).toFixed(1)
  const montantTotal = collectes.reduce((acc, c) => acc + c.total, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Collectes</h1>
          <p className="text-white/50 text-sm mt-1">Suivi des pesées et paiements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#0A1628] transition-opacity hover:opacity-90" style={{ backgroundColor: '#D4AF37' }}>
          <Plus size={16} /> Nouvelle collecte
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Collectes du jour', value: today.toString(), color: '#00BCD4' },
          { label: 'Tonnage total', value: `${tonnage} t`, color: '#4CAF50' },
          { label: 'Montant total', value: formatFCFA(montantTotal), color: '#D4AF37' },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-xl border border-white/10" style={{ backgroundColor: '#0d1e35' }}>
            <p className="text-xs text-white/50 mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <select value={produit} onChange={(e) => setProduit(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm text-white border border-white/10 outline-none focus:border-[#D4AF37] transition-colors"
          style={{ backgroundColor: '#0d1e35' }}>
          {PRODUITS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={statut} onChange={(e) => setStatut(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm text-white border border-white/10 outline-none focus:border-[#D4AF37] transition-colors"
          style={{ backgroundColor: '#0d1e35' }}>
          {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#0d1e35' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Membre', 'Produit', 'Quantité', 'Prix/kg', 'Total', 'Date', 'Statut', 'Point collecte'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/40 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <motion.tbody initial="hidden" animate="visible" variants={stagger}>
              {filtered.map((c) => (
                <motion.tr key={c.id} variants={fadeInUp}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Package size={14} style={{ color: '#D4AF37' }} />
                      <span className="text-white font-medium">{c.membre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/70">{c.produit}</td>
                  <td className="px-4 py-3 text-white/70">{c.quantite} {c.unite}</td>
                  <td className="px-4 py-3 text-white/70">{formatFCFA(c.prixUnitaire)}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#D4AF37' }}>{formatFCFA(c.total)}</td>
                  <td className="px-4 py-3 text-white/50">{c.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={c.statut === 'Payé'
                        ? { backgroundColor: 'rgba(76,175,80,0.15)', color: '#4CAF50' }
                        : { backgroundColor: 'rgba(255,152,0,0.15)', color: '#FF9800' }
                      }>
                      {c.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/50">{c.pointCollecte}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
