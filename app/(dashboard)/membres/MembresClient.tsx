'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, UserPlus, MapPin, Phone } from 'lucide-react'

interface Membre {
  id: string
  nom: string
  telephone: string
  parcelles: number
  surfaceTotale: string
  produits: string[]
  statut: string
  dateAdhesion: string
}

interface Props { membres: Membre[] }

const PRODUITS = ['Tous', 'Coton', 'Sésame', 'Karité']
const STATUTS = ['Tous', 'Actif', 'Inactif']

const fadeInUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.07 } } }

function initiales(nom: string) {
  return nom.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function MembresClient({ membres }: Props) {
  const [search, setSearch] = useState('')
  const [statut, setStatut] = useState('Tous')
  const [produit, setProduit] = useState('Tous')

  const filtered = useMemo(() => membres.filter((m) => {
    const matchSearch = m.nom.toLowerCase().includes(search.toLowerCase()) || m.telephone.includes(search)
    const matchStatut = statut === 'Tous' || m.statut === statut
    const matchProduit = produit === 'Tous' || m.produits.includes(produit)
    return matchSearch && matchStatut && matchProduit
  }), [membres, search, statut, produit])

  const actifs = membres.filter((m) => m.statut === 'Actif').length
  const surfaceTotale = membres.reduce((acc, m) => acc + parseFloat(m.surfaceTotale), 0).toFixed(1)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Membres</h1>
          <p className="text-white/50 text-sm mt-1">Registre des coopérateurs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#0A1628] transition-opacity hover:opacity-90" style={{ backgroundColor: '#D4AF37' }}>
          <UserPlus size={16} /> Ajouter membre
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: membres.length },
          { label: 'Actifs', value: actifs },
          { label: 'Surface totale', value: `${surfaceTotale} ha` },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-xl border border-white/10 text-center" style={{ backgroundColor: '#0d1e35' }}>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un membre..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 border border-white/10 outline-none focus:border-[#D4AF37] transition-colors"
            style={{ backgroundColor: '#0d1e35' }}
          />
        </div>
        <select value={statut} onChange={(e) => setStatut(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm text-white border border-white/10 outline-none focus:border-[#D4AF37] transition-colors"
          style={{ backgroundColor: '#0d1e35' }}>
          {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={produit} onChange={(e) => setProduit(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm text-white border border-white/10 outline-none focus:border-[#D4AF37] transition-colors"
          style={{ backgroundColor: '#0d1e35' }}>
          {PRODUITS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {/* Cards */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((m) => (
          <motion.div key={m.id} variants={fadeInUp}
            className="p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
            style={{ backgroundColor: '#0d1e35' }}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-[#0A1628]"
                style={{ backgroundColor: '#D4AF37' }}>
                {initiales(m.nom)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-white truncate">{m.nom}</p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
                    style={m.statut === 'Actif'
                      ? { backgroundColor: 'rgba(76,175,80,0.15)', color: '#4CAF50' }
                      : { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }
                    }>
                    {m.statut}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-white/40">
                  <Phone size={11} /> {m.telephone}
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-white/40">
                  <MapPin size={11} /> {m.parcelles} parcelles · {m.surfaceTotale}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {m.produits.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(0,188,212,0.15)', color: '#00BCD4' }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
