import MembresClient from './MembresClient'

const MOCK_MEMBRES = [
  { id: '1', nom: 'Ouédraogo Adama', telephone: '+226 70 11 22 33', parcelles: 3, surfaceTotale: '4.2 ha', produits: ['Coton', 'Sésame'], statut: 'Actif', dateAdhesion: '2024-03-15' },
  { id: '2', nom: 'Sawadogo Fatima', telephone: '+226 76 44 55 66', parcelles: 2, surfaceTotale: '2.8 ha', produits: ['Sésame'], statut: 'Actif', dateAdhesion: '2024-05-20' },
  { id: '3', nom: 'Kaboré Ibrahim', telephone: '+226 65 77 88 99', parcelles: 5, surfaceTotale: '7.1 ha', produits: ['Coton', 'Karité'], statut: 'Actif', dateAdhesion: '2023-11-08' },
  { id: '4', nom: 'Zongo Marie', telephone: '+226 71 22 33 44', parcelles: 1, surfaceTotale: '1.5 ha', produits: ['Karité'], statut: 'Inactif', dateAdhesion: '2024-01-30' },
  { id: '5', nom: 'Traoré Salif', telephone: '+226 78 55 66 77', parcelles: 4, surfaceTotale: '5.9 ha', produits: ['Coton', 'Sésame', 'Karité'], statut: 'Actif', dateAdhesion: '2023-09-12' },
  { id: '6', nom: 'Compaoré Aïcha', telephone: '+226 68 33 44 55', parcelles: 2, surfaceTotale: '3.4 ha', produits: ['Sésame'], statut: 'Actif', dateAdhesion: '2024-07-01' },
]

export default function MembresPage() {
  return <MembresClient membres={MOCK_MEMBRES} />
}
