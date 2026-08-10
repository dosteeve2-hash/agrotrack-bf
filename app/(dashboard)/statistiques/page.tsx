'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, ShoppingBasket, Banknote, TrendingUp, Leaf,
  MapPin, Award, BarChart3,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

// ─── Palette ──────────────────────────────────────────────────────────────────
const NAVY  = '#0A1628'
const GOLD  = '#D4AF37'
const CYAN  = '#00BCD4'
const GREEN = '#10B981'
const PURPLE = '#8B5CF6'
const ORANGE = '#F59E0B'
const NAVY2 = '#060e1a'
const TEXT2 = '#94A3B8'
const CARD  = 'rgba(255,255,255,0.03)'
const BORD  = '1px solid rgba(255,255,255,0.07)'

// ─── Data ─────────────────────────────────────────────────────────────────────
const COLLECTES_MENSUELLES = [
  { mois: 'Jan', collectes: 18400, membres: 118, revenus: 4140000 },
  { mois: 'Fév', collectes: 22100, membres: 120, revenus: 4972500 },
  { mois: 'Mar', collectes: 26500, membres: 122, revenus: 5962500 },
  { mois: 'Avr', collectes: 31800, membres: 123, revenus: 7155000 },
  { mois: 'Mai', collectes: 38200, membres: 124, revenus: 8595000 },
  { mois: 'Jun', collectes: 40300, membres: 125, revenus: 9067500 },
  { mois: 'Jul', collectes: 45200, membres: 127, revenus: 10170000 },
]

const PRODUCTION_PAR_CULTURE = [
  { culture: 'Coton',  kg: 18900, pct: 41.8, color: GOLD   },
  { culture: 'Maïs',   kg: 12400, pct: 27.4, color: CYAN   },
  { culture: 'Sorgho', kg:  7800, pct: 17.3, color: GREEN  },
  { culture: 'Sésame', kg:  3600, pct:  8.0, color: PURPLE },
  { culture: 'Mil',    kg:  2500, pct:  5.5, color: ORANGE },
]

const PRODUCTION_PAR_VILLAGE = [
  { village: 'Koudougou',  production: 14200, membres: 42 },
  { village: 'Sabou',      production:  9800, membres: 28 },
  { village: 'Réo',        production:  8400, membres: 24 },
  { village: 'Pouni',      production:  6100, membres: 18 },
  { village: 'Goundi',     production:  4300, membres: 12 },
  { village: 'Tenado',     production:  2400, membres:  3 },
]

const TOP_MEMBRES = [
  { nom: 'Ouédraogo Adama',  village: 'Koudougou', culture: 'Coton',  kg: 2840, rang: 1 },
  { nom: 'Sawadogo Moussa',  village: 'Sabou',     culture: 'Maïs',   kg: 2190, rang: 2 },
  { nom: 'Compaoré Fatou',   village: 'Réo',       culture: 'Coton',  kg: 1960, rang: 3 },
  { nom: 'Traoré Ibrahim',   village: 'Koudougou', culture: 'Sorgho', kg: 1820, rang: 4 },
  { nom: 'Kaboré Aminata',   village: 'Pouni',     culture: 'Sésame', kg: 1440, rang: 5 },
]

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon, label, value, delta, up, color, i,
}: {
  icon: React.ElementType; label: string; value: string
  delta: string; up: boolean; color: string; i: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 120, damping: 20, delay: i * 0.07 }}
      className="rounded-2xl p-5"
      style={{ background: CARD, border: BORD }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: up ? GREEN : '#ef4444',
          }}>
          {delta}
        </span>
      </div>
      <p className="text-2xl font-black text-white mb-1">{value}</p>
      <p className="text-sm" style={{ color: TEXT2 }}>{label}</p>
    </motion.div>
  )
}

// ─── Tooltip style ─────────────────────────────────────────────────────────────
const TT_STYLE = {
  backgroundColor: NAVY2,
  border: `1px solid rgba(212,175,55,0.3)`,
  borderRadius: 10,
  color: '#e6edf3',
  fontSize: 12,
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StatistiquesPage() {
  const [mounted, setMounted] = useState(false)
  const [periode, setPeriode] = useState<'3m' | '6m' | '12m'>('6m')

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div style={{ height: 400 }} />

  const sliceMap = { '3m': 4, '6m': 4, '12m': 0 }
  const data = COLLECTES_MENSUELLES.slice(sliceMap[periode])

  const totalCollectes = COLLECTES_MENSUELLES.reduce((s, d) => s + d.collectes, 0)
  const totalRevenus   = COLLECTES_MENSUELLES.reduce((s, d) => s + d.revenus, 0)
  const membresActifs  = COLLECTES_MENSUELLES[COLLECTES_MENSUELLES.length - 1].membres

  const kpis = [
    { icon: Users,         label: 'Membres actifs',     value: membresActifs + '',          delta: '+9 vs jan', up: true,  color: CYAN   },
    { icon: ShoppingBasket,label: 'Collectes totales',  value: (totalCollectes / 1000).toFixed(1) + ' t', delta: '+23 % vs s-1', up: true, color: GOLD },
    { icon: Banknote,      label: 'Revenus générés',    value: (totalRevenus / 1_000_000).toFixed(1) + 'M FCFA', delta: '+31 % vs s-1', up: true, color: GREEN },
    { icon: Leaf,          label: 'Cultures suivies',   value: '5',                         delta: 'stable', up: true,  color: PURPLE },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const }}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-white mb-1 flex items-center gap-2">
            <BarChart3 className="w-8 h-8" style={{ color: GOLD }} />
            Statistiques
          </h1>
          <p style={{ color: TEXT2 }}>Tableau de bord analytique · Saison 2026</p>
        </div>
        <div className="flex gap-2">
          {(['3m', '6m', '12m'] as const).map(p => (
            <button key={p} onClick={() => setPeriode(p)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={periode === p
                ? { background: GOLD, color: NAVY }
                : { background: CARD, border: BORD, color: TEXT2 }}>
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => <KpiCard key={k.label} {...k} i={i} />)}
      </div>

      {/* Collectes + Revenus AreaChart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.25 }}
        className="rounded-2xl p-6"
        style={{ background: CARD, border: BORD }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-lg">Collectes & Revenus</h2>
            <p className="text-sm" style={{ color: TEXT2 }}>Évolution mensuelle saison 2026</p>
          </div>
          <TrendingUp className="w-5 h-5" style={{ color: GOLD }} />
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradCollectes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={GOLD}  stopOpacity={0.22} />
                <stop offset="95%" stopColor={GOLD}  stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradRevenus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={CYAN}  stopOpacity={0.18} />
                <stop offset="95%" stopColor={CYAN}  stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="mois" tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left"  tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v: any) => v >= 1000 ? (v / 1000) + 'k' : v} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v: any) => (v / 1_000_000).toFixed(1) + 'M'} />
            <Tooltip contentStyle={TT_STYLE}
              formatter={(v: any, name: any) => name === 'collectes'
                ? [v.toLocaleString('fr') + ' kg', 'Collectes']
                : [(v / 1_000_000).toFixed(2) + 'M FCFA', 'Revenus']} />
            <Area yAxisId="left"  type="monotone" dataKey="collectes" stroke={GOLD} strokeWidth={2}
              fill="url(#gradCollectes)" dot={{ fill: GOLD, r: 4 }} />
            <Area yAxisId="right" type="monotone" dataKey="revenus"   stroke={CYAN} strokeWidth={2}
              fill="url(#gradRevenus)"   dot={{ fill: CYAN, r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Production par culture (Bar) + Répartition (Pie) */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* BarChart production par culture */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring' as const, delay: 0.32 }}
          className="rounded-2xl p-6"
          style={{ background: CARD, border: BORD }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Leaf className="w-5 h-5" style={{ color: GREEN }} />
            <h2 className="text-white font-bold">Production par culture</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PRODUCTION_PAR_CULTURE} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="culture" tick={{ fill: TEXT2, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TEXT2, fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v: any) => (v / 1000).toFixed(0) + 'k'} />
              <Tooltip contentStyle={TT_STYLE}
                formatter={(v: any) => [v.toLocaleString('fr') + ' kg', 'Production']} />
              <Bar dataKey="kg" radius={[6, 6, 0, 0]}>
                {PRODUCTION_PAR_CULTURE.map((e) => (
                  <Cell key={e.culture} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* PieChart répartition + légende */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring' as const, delay: 0.36 }}
          className="rounded-2xl p-6"
          style={{ background: CARD, border: BORD }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5" style={{ color: PURPLE }} />
            <h2 className="text-white font-bold">Répartition des cultures</h2>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={PRODUCTION_PAR_CULTURE} dataKey="kg" innerRadius={48} outerRadius={72}
                  paddingAngle={3} startAngle={90} endAngle={-270}>
                  {PRODUCTION_PAR_CULTURE.map((e) => (
                    <Cell key={e.culture} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TT_STYLE}
                  formatter={(v: any) => [v.toLocaleString('fr') + ' kg', 'Production']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {PRODUCTION_PAR_CULTURE.map(e => (
                <div key={e.culture}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} />
                      <span className="text-white font-medium">{e.culture}</span>
                    </div>
                    <span style={{ color: TEXT2 }}>{e.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${e.pct}%`, background: e.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Production par village (BarChart horizontal) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.42 }}
        className="rounded-2xl p-6"
        style={{ background: CARD, border: BORD }}
      >
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="w-5 h-5" style={{ color: CYAN }} />
          <h2 className="text-white font-bold">Production par village</h2>
          <span className="ml-auto text-xs" style={{ color: TEXT2 }}>6 villages · total 45 200 kg</span>
        </div>
        <div className="space-y-3">
          {PRODUCTION_PAR_VILLAGE.map((v, i) => {
            const max = PRODUCTION_PAR_VILLAGE[0].production
            const pct = (v.production / max) * 100
            return (
              <motion.div key={v.village}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 + i * 0.05 }}
              >
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center text-xs font-mono" style={{ color: TEXT2 }}>{i + 1}</span>
                    <span className="text-white font-medium">{v.village}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,188,212,0.1)', color: CYAN }}>
                      {v.membres} mbr
                    </span>
                  </div>
                  <span className="font-mono text-xs" style={{ color: GOLD }}>
                    {v.production.toLocaleString('fr')} kg
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: 'easeOut' }}
                    style={{
                      background: `linear-gradient(90deg, ${GOLD}, ${CYAN})`,
                      opacity: 1 - i * 0.1,
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Top 5 membres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.5 }}
        className="rounded-2xl p-6"
        style={{ background: CARD, border: BORD }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Award className="w-5 h-5" style={{ color: GOLD }} />
          <h2 className="text-white font-bold">Top producteurs</h2>
          <span className="ml-auto text-xs" style={{ color: TEXT2 }}>Saison 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['#', 'Membre', 'Village', 'Culture', 'Production'].map(h => (
                  <th key={h} className="text-left pb-3 font-semibold"
                    style={{ color: TEXT2, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_MEMBRES.map((m, i) => (
                <motion.tr key={m.nom}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 + i * 0.06 }}
                  className="transition-colors hover:bg-white/3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-3.5 pr-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                      style={{
                        background: i === 0 ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)',
                        color: i === 0 ? GOLD : TEXT2,
                        display: 'inline-flex',
                      }}>
                      {m.rang}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold text-white">{m.nom}</td>
                  <td className="py-3.5" style={{ color: TEXT2 }}>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {m.village}
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: PRODUCTION_PAR_CULTURE.find(c => c.culture === m.culture)?.color + '18' || 'rgba(255,255,255,0.08)',
                        color: PRODUCTION_PAR_CULTURE.find(c => c.culture === m.culture)?.color || TEXT2,
                      }}>
                      {m.culture}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-right" style={{ color: GOLD }}>
                    {m.kg.toLocaleString('fr')} kg
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  )
}
