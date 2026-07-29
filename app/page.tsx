'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Leaf, Users, Package, BarChart2, Wifi, Shield } from 'lucide-react'
import { hoverScale } from '@/lib/animations'

const features = [
  { icon: Users, title: 'Gestion membres', desc: "Suivez vos coopérateurs, leurs parcelles et leur production" },
  { icon: Package, title: 'Stocks & entrepôts', desc: "Inventaire temps réel avec alertes de stock faible" },
  { icon: BarChart2, title: 'Rapports & analytics', desc: "Graphiques collectes, CA mensuel et exports CSV" },
  { icon: Wifi, title: 'Offline-first', desc: "Fonctionne sans internet — sync automatique à la reconnexion" },
  { icon: Shield, title: 'Paiements sécurisés', desc: "Mobile Money, espèces et virements en FCFA" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A1628' }}>
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Leaf className="w-7 h-7" style={{ color: '#D4AF37' }} />
          <span className="text-xl font-bold text-white">AgroTrack BF</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login"
            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
            Connexion
          </Link>
          <Link href="/auth/register"
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
            style={{ background: '#D4AF37', color: '#0A1628' }}>
            Créer un compte
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 80, damping: 20 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{ background: '#D4AF3720', color: '#D4AF37', border: '1px solid #D4AF3740' }}>
            🌾 FORGE Afrika Ecosystem
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Gérez votre coopérative<br />
            <span style={{ color: '#D4AF37' }}>agricole au Burkina</span>
          </h1>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Plateforme PWA offline-first pour les coopératives agricoles du Burkina Faso.
            Collectes, stocks, paiements — tout en FCFA, même sans internet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login?demo=true"
              className="px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105"
              style={{ background: '#D4AF37', color: '#0A1628' }}>
              🎯 Essayer en démo
            </Link>
            <Link href="/auth/register"
              className="px-8 py-3 rounded-xl font-semibold text-lg border border-white/20 text-white hover:border-white/40 transition-all">
              Créer un compte
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-20">
          {features.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, stiffness: 80, delay: i * 0.08 }}
              {...hoverScale}
              className="p-5 rounded-xl text-left cursor-default"
              style={{ background: '#112240', border: '1px solid rgba(255,255,255,0.08)' }}>
              <f.icon className="w-6 h-6 mb-3" style={{ color: '#00BCD4' }} />
              <h3 className="text-white font-semibold mb-1">{f.title}</h3>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-white/30 text-sm border-t border-white/10">
        © 2026 AgroTrack BF — FORGE Afrika · Burkina Faso
      </footer>
    </div>
  )
}
