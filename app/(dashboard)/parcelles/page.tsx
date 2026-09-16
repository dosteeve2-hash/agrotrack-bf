// app/(dashboard)/parcelles/page.tsx
import { listerParcelles } from '@/lib/data/parcelles'
import { listerMembres } from '@/lib/data/membres'
import { ParcellesVue } from './ParcellesVue'

function Message({ titre, corps }: { titre: string; corps: string }) {
  return (
    <div style={{ background: '#0A1628', minHeight: '100vh', padding: 24, color: 'white' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', background: '#0c1a34', borderRadius: 12,
        padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{titre}</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{corps}</p>
      </div>
    </div>
  )
}

export default async function ParcellesPage() {
  // Les deux requetes sont independantes : les lancer en serie ferait attendre
  // l'utilisateur deux fois pour rien, et le reseau est cher ici.
  const [resultat, resultatMembres] = await Promise.all([listerParcelles(), listerMembres()])

  if (resultat.etat === 'sans_cooperative') {
    return (
      <Message
        titre="Compte pas encore rattaché"
        corps="Ton compte existe, mais aucun gérant ne l’a encore rattaché à une coopérative.
               Tant que ce n’est pas fait, tu ne vois aucune parcelle — c’est voulu : les
               données d’une coopérative ne sortent jamais de la coopérative."
      />
    )
  }

  if (resultat.etat === 'erreur') {
    return <Message titre="Les parcelles n’ont pas pu être chargées" corps={resultat.message} />
  }

  const membres = resultatMembres.etat === 'ok'
    ? resultatMembres.membres.map(m => ({ id: m.id, nom: m.nom, village: m.village }))
    : []

  return <ParcellesVue parcelles={resultat.parcelles} membres={membres} />
}
