import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, ShoppingBasket, Package2, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react'
import WeatherWidget from '@/components/WeatherWidget'
import YieldChart from '@/components/YieldChart'
import AlertesAgro from '@/components/AlertesAgro'
import ExportCSVButton from '@/components/ExportCSVButton'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

const stats = [
  { label: 'Membres actifs', value: '127', icon: Users, color: '#00BCD4', delta: '+3 ce mois' },
  { label: 'Collectes (juillet)', value: '45 200 kg', icon: ShoppingBasket, color: '#D4AF37', delta: '+12 % vs juin' },
  { label: 'Valeur stocks', value: fmt(12016900), icon: Package2, color: '#10b981', delta: '4 produits' },
  { label: 'Paiements en attente', value: fmt(130000), icon: CreditCard, color: '#f59e0b', delta: '2 dossiers' },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isDemo = user?.email === 'demo@agrotrack-bf.com'

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Bannière démo */}
      {isDemo && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
          style={{ background: '#00BCD420', border: '1px solid #00BCD440', color: '#00BCD4' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Mode Démo actif — données fictives, rien n&apos;est sauvegardé</span>
          <Link href="/onboarding" className="ml-auto text-xs underline hover:no-underline">Voir le guide →</Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-0.5">Coopérative agricole — Koudougou, Burkina Faso</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportCSVButton />
          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#D4AF3720', color: '#92760A' }}>
            Août 2026
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">{s.label}</span>
              <div className="p-1.5 rounded-lg" style={{ background: s.color + '20' }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {s.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Alertes agronomiques */}
      <AlertesAgro />

      {/* Météo + Rendement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <WeatherWidget />
        <div className="lg:col-span-2">
          <YieldChart />
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/collectes', label: 'Saisir une collecte', desc: 'Enregistrer les apports du jour', color: '#D4AF37' },
          { href: '/paiements', label: 'Enregistrer un paiement', desc: 'Mobile Money, espèces ou virement', color: '#00BCD4' },
          { href: '/rapports', label: 'Voir les rapports', desc: 'Graphiques et exports CSV', color: '#10b981' },
        ].map((q) => (
          <Link key={q.href} href={q.href}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="w-2 h-2 rounded-full mb-3" style={{ background: q.color }} />
            <p className="font-semibold text-gray-900 text-sm">{q.label}</p>
            <p className="text-xs text-gray-400 mt-1">{q.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
