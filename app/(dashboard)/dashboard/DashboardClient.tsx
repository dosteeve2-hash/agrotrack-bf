'use client'

import { motion } from 'framer-motion'
import { Users, Package, Weight, Banknote, Wifi, WifiOff } from 'lucide-react'
import { useOnlineStatus } from "@/lib/useOnlineStatus"

interface Stats {
  totalMembres: number
  collectesAujourdhui: number
  tonnesCollectees: number
  paiementsEnAttente: number
}

interface Collecte {
  id: string
  membre: string
  produit: string
  quantite: string
  date: string
  statut: string
}

interface Props {
  stats: Stats
  collectes: Collecte[]
}

const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

function formatFCFA(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export default function DashboardClient({ stats, collectes }: Props) {
  const isOnline = useOnlineStatus()

  const statCards = [
    { label: 'Membres actifs', value: stats.totalMembres.toString(), icon: Users, color: '#00BCD4' },
    { label: 'Collectes aujourd\'hui', value: stats.collectesAujourdhui.toString(), icon: Package, color: '#D4AF37' },
    { label: 'Tonnes collectées', value: `${stats.tonnesCollectees} t`, icon: Weight, color: '#4CAF50' },
    { label: 'Paiements en attente', value: formatFCFA(stats.paiementsEnAttente), icon: Banknote, color: '#D4AF37' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-white/50 text-sm mt-1">Lundi 13 juillet 2026</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border"
          style={isOnline
            ? { borderColor: 'rgba(76,175,80,0.4)', backgroundColor: 'rgba(76,175,80,0.1)', color: '#4CAF50' }
            : { borderColor: 'rgba(239,68,68,0.4)', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }
          }>
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isOnline ? 'Synchronisé' : 'Hors ligne'}
        </div>
      </div>

      {/* Stat cards */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((card) => (
          <motion.div key={card.label} variants={fadeInUp}
            className="p-6 rounded-2xl border border-white/10"
            style={{ backgroundColor: '#0d1e35' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                <card.icon size={20} style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-white/50 text-xs mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Collectes récentes */}
      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#0d1e35' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="font-semibold text-white">Collectes récentes</h2>
          <span className="text-xs text-white/40">{collectes.length} entrées</span>
        </div>
        <div className="divide-y divide-white/5">
          {collectes.map((c) => (
            <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
              <div>
                <p className="text-sm font-medium text-white">{c.membre}</p>
                <p className="text-xs text-white/40">{c.produit} · {c.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-white/70">{c.quantite}</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={c.statut === 'Payé'
                    ? { backgroundColor: 'rgba(76,175,80,0.15)', color: '#4CAF50' }
                    : { backgroundColor: 'rgba(255,193,7,0.15)', color: '#FFC107' }
                  }>
                  {c.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
