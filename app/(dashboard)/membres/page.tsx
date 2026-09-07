// app/(dashboard)/membres/page.tsx
import { listerMembres } from '@/lib/data/membres'
import { MembresVue } from './MembresVue'

function Message({ titre, corps }: { titre: string; corps: string }) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-lg font-bold text-gray-900 mb-2">{titre}</h1>
        <p className="text-sm text-gray-500 leading-relaxed">{corps}</p>
      </div>
    </div>
  )
}

export default async function MembresPage() {
  const resultat = await listerMembres()

  // Un compte non rattache voit un ecran vide sans savoir pourquoi. On le dit.
  if (resultat.etat === 'sans_cooperative') {
    return (
      <Message
        titre="Compte pas encore rattaché"
        corps="Ton compte existe, mais aucun gérant ne l’a encore rattaché à une coopérative.
               Tant que ce n’est pas fait, tu ne vois aucun membre — c’est voulu : les données
               d’une coopérative ne sortent jamais de la coopérative. Demande à ton gérant."
      />
    )
  }

  if (resultat.etat === 'erreur') {
    return (
      <Message
        titre="Les membres n’ont pas pu être chargés"
        corps={resultat.message}
      />
    )
  }

  return <MembresVue membres={resultat.membres} nomCooperative={resultat.nomCooperative} />
}
