import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, MapPin, Ruler, TrendingUp, AlertTriangle } from 'lucide-react'
import WeatherWidget from '@/components/WeatherWidget'
import YieldChart from '@/components/YieldChart'
import AlertesAgro from '@/components/AlertesAgro'
import ExportCSVButton from '@/components/ExportCSVButton'
import EtatVide from '@/components/EtatVide'
import { listerMembres } from '@/lib/data/membres'
import { listerParcelles, rendementMoyen } from '@/lib/data/parcelles'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isDemo = user?.email === 'demo@agrotrack-bf.com'

  const [membres, parcelles] = await Promise.all([listerMembres(), listerParcelles()])
  const donneesPretes = membres.etat === 'ok' && parcelles.etat === 'ok'
  const nbMembres = membres.etat === 'ok' ? membres.membres.length : 0
  const listeParcelles = parcelles.etat === 'ok' ? parcelles.parcelles : []
  const surface = listeParcelles.reduce((s, p) => s + p.superficie, 0)
  const mois = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  const stats = [
    { label: 'Membres', value: String(nbMembres), icon: Users, color: '#00BCD4' },
    { label: 'Parcelles', value: String(listeParcelles.length), icon: MapPin, color: '#D4AF37' },
    { label: 'Surface totale', value: `${surface.toFixed(1)} ha`, icon: Ruler, color: '#10b981' },
    { label: 'Rendement estimé moyen', value: `${rendementMoyen(listeParcelles).toLocaleString('fr-FR')} kg/ha`, icon: TrendingUp, color: '#f59e0b' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {isDemo && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
          style={{ background: '#00BCD420', border: '1px solid #00BCD440', color: '#0e7490' }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Compte de démonstration partagé — ne saisissez pas de données réelles</span>
          <Link href="/onboarding" className="ml-auto text-xs underline hover:no-underline">Voir le guide →</Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            {membres.etat === 'ok' ? membres.nomCooperative : 'Votre coopérative ou exploitation'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportCSVButton parcelles={listeParcelles} />
          <span className="text-xs px-2 py-1 rounded-full font-medium capitalize" style={{ background: '#D4AF3720', color: '#78600a' }}>
            {mois}
          </span>
        </div>
      </div>

      {donneesPretes && nbMembres === 0 ? (
        <div className="mb-8">
          <EtatVide titre="Aucun membre : ajoutez le premier"
            texte="Le tableau de bord se remplit au fur et à mesure que vous enregistrez vos membres et vos parcelles."
            action={{ libelle: 'Ajouter un membre', href: '/membres' }} />
        </div>
      ) : donneesPretes ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-600">{s.label}</span>
                <div className="p-1.5 rounded-lg" style={{ background: s.color + '20' }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-8">
          <EtatVide titre="Les chiffres ne peuvent pas être affichés pour l’instant"
            texte={membres.etat === 'sans_cooperative'
              ? 'Votre compte n’est pas encore rattaché à une coopérative.'
              : 'Les données n’ont pas pu être chargées. Réessayez plus tard.'} />
        </div>
      )}

      <AlertesAgro />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <WeatherWidget />
        <div className="lg:col-span-2">
          <YieldChart />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/collectes', label: 'Saisir une collecte', desc: 'Enregistrer les apports du jour', color: '#D4AF37' },
          { href: '/paiements', label: 'Enregistrer un paiement', desc: 'Espèces, virement, mobile money ou autre', color: '#00BCD4' },
          { href: '/rapports', label: 'Voir les rapports', desc: 'Graphiques et exports CSV', color: '#10b981' },
        ].map((q) => (
          <Link key={q.href} href={q.href}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="w-2 h-2 rounded-full mb-3" style={{ background: q.color }} />
            <p className="font-semibold text-gray-900 text-sm">{q.label}</p>
            <p className="text-xs text-gray-600 mt-1">{q.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
