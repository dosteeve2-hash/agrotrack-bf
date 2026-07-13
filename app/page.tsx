'use client'

import { motion } from 'framer-motion'
import { Users, Package, CreditCard, Wifi, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
}

const features = [
  {
    icon: Users,
    title: 'Gestion des membres',
    desc: 'Registre complet de vos coopérateurs, parcelles et surfaces cultivées.',
    color: '#00BCD4',
  },
  {
    icon: Package,
    title: 'Suivi des collectes',
    desc: 'Pesée, saisie et traçabilité de chaque collecte par produit.',
    color: '#D4AF37',
  },
  {
    icon: CreditCard,
    title: 'Paiements FCFA',
    desc: 'Calcul automatique et suivi des paiements aux producteurs.',
    color: '#4CAF50',
  },
  {
    icon: Wifi,
    title: 'Sync offline',
    desc: 'Fonctionne sans internet. Synchronisation automatique dès la connexion.',
    color: '#D4AF37',
  },
]

const stats = [
  { value: '2 000+', label: 'coopératives non digitalisées' },
  { value: '100%', label: 'offline-first' },
  { value: 'Auto', label: 'sync dès connexion' },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0A1628', color: 'white' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="font-bold text-lg" style={{ color: '#D4AF37' }}>AgroTrack BF</span>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-colors">
            Connexion
          </Link>
          <Link href="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium text-[#0A1628] transition-opacity hover:opacity-90" style={{ backgroundColor: '#D4AF37' }}>
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeInUp}>
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20" style={{ backgroundColor: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>
              🌾 AgroTrack BF — Gestion coopératives agricoles
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            La gestion coopérative<br />
            <span style={{ color: '#D4AF37' }}>pensée pour le terrain</span><br />
            burkinabè
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Offline-first. Simple. Puissant.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-[#0A1628] transition-opacity hover:opacity-90" style={{ backgroundColor: '#D4AF37' }}>
              Commencer gratuitement <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold border border-white/20 text-white hover:bg-white/5 transition-colors">
              Voir la démo
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeInUp}
              className="p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors"
              style={{ backgroundColor: '#0d1e35' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}20` }}>
                <f.icon size={24} style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="rounded-2xl p-10 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center" style={{ backgroundColor: '#0d1e35' }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-bold mb-2" style={{ color: '#D4AF37' }}>{s.value}</div>
              <div className="text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold mb-8">Pourquoi AgroTrack BF ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {['Fonctionne sans connexion internet','Données sécurisées localement','Synchronisation automatique','Interface simple en français','Adapté aux zones rurales BF','Gratuit pour les petites coopératives'].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <CheckCircle size={18} style={{ color: '#00BCD4' }} className="shrink-0" />
              <span className="text-white/80 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-white/40 text-sm">
        <p>© 2026 FORGE Afrika Ecosystem · AgroTrack BF · Tous droits réservés</p>
      </footer>
    </main>
  )
}
