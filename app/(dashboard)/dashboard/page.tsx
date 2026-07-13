import DashboardClient from './DashboardClient'

const MOCK_STATS = {
  totalMembres: 247,
  collectesAujourdhui: 12,
  tonnesCollectees: 18.4,
  paiementsEnAttente: 3240000,
}

const MOCK_COLLECTES_RECENTES = [
  { id: '1', membre: 'Ouédraogo Adama', produit: 'Coton', quantite: '850 kg', date: '2026-07-12', statut: 'Pesé' },
  { id: '2', membre: 'Sawadogo Fatima', produit: 'Sésame', quantite: '120 kg', date: '2026-07-12', statut: 'Pesé' },
  { id: '3', membre: 'Kaboré Ibrahim', produit: 'Coton', quantite: '670 kg', date: '2026-07-11', statut: 'Payé' },
  { id: '4', membre: 'Zongo Marie', produit: 'Karité', quantite: '200 kg', date: '2026-07-11', statut: 'Pesé' },
  { id: '5', membre: 'Traoré Salif', produit: 'Sésame', quantite: '90 kg', date: '2026-07-10', statut: 'Payé' },
]

export default function DashboardPage() {
  return <DashboardClient stats={MOCK_STATS} collectes={MOCK_COLLECTES_RECENTES} />
}
