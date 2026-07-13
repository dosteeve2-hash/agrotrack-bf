import CollectesClient from './CollectesClient'

const MOCK_COLLECTES = [
  { id: '1', membre: 'Ouédraogo Adama', produit: 'Coton', quantite: 850, unite: 'kg', prixUnitaire: 275, total: 233750, date: '2026-07-12', statut: 'Pesé', pointCollecte: 'Centre Koudougou' },
  { id: '2', membre: 'Sawadogo Fatima', produit: 'Sésame', quantite: 120, unite: 'kg', prixUnitaire: 450, total: 54000, date: '2026-07-12', statut: 'Pesé', pointCollecte: 'Centre Koudougou' },
  { id: '3', membre: 'Kaboré Ibrahim', produit: 'Coton', quantite: 670, unite: 'kg', prixUnitaire: 275, total: 184250, date: '2026-07-11', statut: 'Payé', pointCollecte: 'Antenne Nord' },
  { id: '4', membre: 'Zongo Marie', produit: 'Karité', quantite: 200, unite: 'kg', prixUnitaire: 380, total: 76000, date: '2026-07-11', statut: 'Pesé', pointCollecte: 'Antenne Nord' },
  { id: '5', membre: 'Traoré Salif', produit: 'Sésame', quantite: 90, unite: 'kg', prixUnitaire: 450, total: 40500, date: '2026-07-10', statut: 'Payé', pointCollecte: 'Centre Koudougou' },
]

export default function CollectesPage() {
  return <CollectesClient collectes={MOCK_COLLECTES} />
}
