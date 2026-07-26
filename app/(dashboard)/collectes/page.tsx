import { Plus } from 'lucide-react'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

const COLLECTES = [
  { id: 'C001', membre: 'Ouédraogo Adama', produit: 'Coton grade A', quantite: '850 kg', prixUnit: '275 FCFA/kg', total: 233750, date: '2026-07-12', statut: 'Validée' },
  { id: 'C002', membre: 'Sawadogo Fatima', produit: 'Sésame blanc', quantite: '120 kg', prixUnit: '450 FCFA/kg', total: 54000, date: '2026-07-12', statut: 'En attente' },
  { id: 'C003', membre: 'Kaboré Ibrahim', produit: 'Coton grade A', quantite: '670 kg', prixUnit: '275 FCFA/kg', total: 184250, date: '2026-07-11', statut: 'Validée' },
  { id: 'C004', membre: 'Zongo Marie', produit: 'Karité brut', quantite: '200 kg', prixUnit: '380 FCFA/kg', total: 76000, date: '2026-07-11', statut: 'En attente' },
  { id: 'C005', membre: 'Traoré Seydou', produit: 'Maïs grain sec', quantite: '1 200 kg', prixUnit: '145 FCFA/kg', total: 174000, date: '2026-07-10', statut: 'Validée' },
]

const totalCA = COLLECTES.reduce((a, c) => a + c.total, 0)

export default function CollectesPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collectes</h1>
          <p className="text-gray-500 text-sm mt-0.5">CA total : <strong>{fmt(totalCA)}</strong></p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: '#00BCD4', color: '#0A1628' }}>
          <Plus className="w-4 h-4" /> Nouvelle collecte
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#0A1628' }}>
              {['Réf.', 'Membre', 'Produit', 'Quantité', 'Prix unit.', 'Total', 'Date', 'Statut'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {COLLECTES.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{c.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{c.membre}</td>
                <td className="px-4 py-3 text-gray-600">{c.produit}</td>
                <td className="px-4 py-3 text-gray-600">{c.quantite}</td>
                <td className="px-4 py-3 text-gray-600">{c.prixUnit}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{fmt(c.total)}</td>
                <td className="px-4 py-3 text-gray-500">{c.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium`}
                    style={{
                      background: c.statut === 'Validée' ? '#dcfce7' : '#fef9c3',
                      color: c.statut === 'Validée' ? '#15803d' : '#92400e',
                    }}>
                    {c.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
