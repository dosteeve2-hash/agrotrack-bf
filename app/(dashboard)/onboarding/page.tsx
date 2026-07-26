'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Users, ShoppingBasket, Package2, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react'

const ETAPES = [
  {
    num: 1,
    titre: 'Enregistrer vos membres',
    desc: 'Ajoutez les coopérateurs avec leurs coordonnées, village et surface cultivée. Chaque membre reçoit un identifiant unique.',
    icon: Users,
    href: '/membres',
    color: '#D4AF37',
    cta: 'Aller aux membres',
  },
  {
    num: 2,
    titre: 'Saisir les collectes',
    desc: 'Enregistrez les apports agricoles par membre : produit, quantité, prix unitaire. Le CA est calculé automatiquement.',
    icon: ShoppingBasket,
    href: '/collectes',
    color: '#00BCD4',
    cta: 'Aller aux collectes',
  },
  {
    num: 3,
    titre: 'Gérer les stocks',
    desc: "Suivez l'inventaire de vos entrepôts en temps réel. Des alertes vous préviennent en cas de stock faible.",
    icon: Package2,
    href: '/stocks',
    color: '#10b981',
    cta: 'Voir les stocks',
  },
  {
    num: 4,
    titre: 'Suivre les paiements',
    desc: 'Enregistrez les paiements en FCFA par Mobile Money, espèces ou virement. Suivez les dossiers en attente.',
    icon: CreditCard,
    href: '/paiements',
    color: '#f59e0b',
    cta: 'Voir les paiements',
  },
]

export default function OnboardingPage() {
  const [done, setDone] = useState<number[]>([])

  const toggle = (n: number) =>
    setDone(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n])

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Badge Mode Démo — sticky */}
      <div className="sticky top-4 z-10 flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold shadow-lg"
          style={{ background: '#00BCD4', color: '#0A1628' }}>
          🧪 Mode Démo — données non sauvegardées
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Guide de démarrage</h1>
        <p className="text-gray-500 text-sm">Suivez ces 4 étapes pour maîtriser AgroTrack BF</p>

        {/* Progress bar */}
        <div className="mt-5 flex items-center gap-2 max-w-sm mx-auto">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#D4AF37' }}
              animate={{ width: `${(done.length / ETAPES.length) * 100}%` }}
              transition={{ type: 'spring' as const, stiffness: 120, damping: 20 }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-500">{done.length}/{ETAPES.length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {ETAPES.map((e, i) => {
          const isDone = done.includes(e.num)
          return (
            <motion.div
              key={e.num}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, stiffness: 100, delay: i * 0.07 }}
              className="bg-white rounded-xl p-5 shadow-sm border transition-all"
              style={{ borderColor: isDone ? e.color + '60' : '#e5e7eb' }}>
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl flex-shrink-0"
                  style={{ background: e.color + '15' }}>
                  <e.icon className="w-5 h-5" style={{ color: e.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">Étape {e.num}</span>
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{e.titre}</h3>
                  <p className="text-sm text-gray-500 mb-4">{e.desc}</p>
                  <div className="flex items-center gap-3">
                    <Link href={e.href}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                      style={{ background: e.color, color: '#0A1628' }}>
                      {e.cta} <ArrowRight className="w-3 h-3" />
                    </Link>
                    <button
                      onClick={() => toggle(e.num)}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                      {isDone ? '↩ Marquer non fait' : '✓ Marquer comme fait'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {done.length === ETAPES.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring' as const, stiffness: 120 }}
          className="mt-6 text-center p-6 rounded-xl"
          style={{ background: '#D4AF3715', border: '2px solid #D4AF3740' }}>
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-bold text-gray-900">Félicitations !</p>
          <p className="text-sm text-gray-500 mt-1">Vous maîtrisez AgroTrack BF. Prêt à gérer votre coopérative !</p>
          <Link href="/dashboard"
            className="inline-block mt-4 px-5 py-2 rounded-lg text-sm font-semibold"
            style={{ background: '#D4AF37', color: '#0A1628' }}>
            Aller au tableau de bord
          </Link>
        </motion.div>
      )}
    </div>
  )
}
