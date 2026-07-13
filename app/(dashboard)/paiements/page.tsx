import { Plus } from 'lucide-react'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

const PAIEMENTS = [
  { id: 'P001', membre: 'Ouédraogo Adama', montant: 233750, produit: 'Coton', date: '2026-07-12', methode: 'Mobile Money', telephone: '+226 70 11 22 33', statut: 'Payé', reference: 'MM-2026-001' },
  { id: 'P002', membre: 'Sawadogo Fatima', montant: 54000, produit: 'Sésame', date: '2026-07-12', methode: 'Espèces', telephone: '+226 76 44 55 66', statut: 'En attente', reference: '-' },
  { id: 'P003', membre: 'Kaboré Ibrahim', montant: 184250, produit: 'Coton', date: '2026-07-11', methode: 'Mobile Money', telephone: '+226 65 77 88 99', statut: 'Payé', reference: 'MM-2026-002' },
  { id: 'P004', membre: 'Zongo Marie', montant: 76000, produit: 'Karité', date: '2026-07-11', methode: 'Virement', telephone: '+226 71 22 33 44', statut: 'En attente', reference: '-' },
]

const totalPaye = PAIEMENTS.filter(p => p.statut === 'Payé').reduce((a, p) => a + p.montant, 0)
const totalAttente = PAIEMENTS.filter(p => p.statut === 'En attente').reduce((a, p) => a + p.montant, 0)
const tauxPaiement = Math.round((PAIEMENTS.filter(p => p.statut === 'Payé').length / PAIEMENTS.length) * 100)

export default function PaiementsPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
          <p className="text-gray-500 text-sm mt-0.5">Mobile Money · Espèces · Virements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: '#D4AF37', color: '#0A1628' }}>
          <Plus className="w-4 h-4" /> Enregistrer un paiement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Total payé</p>
          <p className="text-xl font-bold text-green-700">{fmt(totalPaye)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">En attente</p>
          <p className="text-xl font-bold text-amber-600">{fmt(totalAttente)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Taux de paiement</p>
          <div className="flex items-end gap-2">
            <p className="text-xl font-bold text-gray-900">{tauxPaiement}%</p>
            <div className="flex-1 mb-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${tauxPaiement}%`, background: '#10b981' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#0A1628' }}>
              {['Réf.', 'Membre', 'Produit', 'Montant', 'Date', 'Méthode', 'Téléphone', 'Référence', 'Statut'].map(h => (
                <th key={h} className="text-left px-3 py-3 text-xs font-medium text-white/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PAIEMENTS.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3 font-mono text-xs text-gray-400">{p.id}</td>
                <td className="px-3 py-3 font-medium text-gray-900">{p.membre}</td>
                <td className="px-3 py-3 text-gray-600">{p.produit}</td>
                <td className="px-3 py-3 font-bold text-gray-900">{fmt(p.montant)}</td>
                <td className="px-3 py-3 text-gray-500">{p.date}</td>
                <td className="px-3 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs"
                    style={{
                      background: p.methode === 'Mobile Money' ? '#e0f2fe' : p.methode === 'Espèces' ? '#f0fdf4' : '#f5f3ff',
                      color: p.methode === 'Mobile Money' ? '#0369a1' : p.methode === 'Espèces' ? '#15803d' : '#6d28d9',
                    }}>
                    {p.methode}
                  </span>
                </td>
                <td className="px-3 py-3 text-gray-500 text-xs">{p.telephone}</td>
                <td className="px-3 py-3 font-mono text-xs text-gray-400">{p.reference}</td>
                <td className="px-3 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      background: p.statut === 'Payé' ? '#dcfce7' : '#fef9c3',
                      color: p.statut === 'Payé' ? '#15803d' : '#92400e',
                    }}>
                    {p.statut}
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
