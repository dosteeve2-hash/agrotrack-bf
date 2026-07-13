import { AlertTriangle, Package2 } from 'lucide-react'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

const STOCKS = [
  { id: '1', produit: 'Coton grade A', quantite: 28500, unite: 'kg', entrepot: 'Entrepôt central Koudougou', valeur: 8242500, dateEntree: '2026-07-10', alerte: false },
  { id: '2', produit: 'Sésame blanc', quantite: 4200, unite: 'kg', entrepot: 'Entrepôt central Koudougou', valeur: 1890000, dateEntree: '2026-07-11', alerte: false },
  { id: '3', produit: 'Karité brut', quantite: 380, unite: 'kg', entrepot: 'Entrepôt Dédougou', valeur: 144400, dateEntree: '2026-07-08', alerte: true },
  { id: '4', produit: 'Maïs grain sec', quantite: 12000, unite: 'kg', entrepot: 'Entrepôt Bobo', valeur: 1740000, dateEntree: '2026-07-09', alerte: false },
]

const totalValeur = STOCKS.reduce((a, s) => a + s.valeur, 0)
const alertes = STOCKS.filter(s => s.alerte).length

export default function StocksPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stocks</h1>
          <p className="text-gray-500 text-sm mt-0.5">Inventaire par entrepôt</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Valeur totale</p>
          <p className="text-xl font-bold text-gray-900">{fmt(totalValeur)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Produits en stock</p>
          <p className="text-xl font-bold text-gray-900">{STOCKS.length} produits</p>
        </div>
        <div className="rounded-xl p-5 shadow-sm border"
          style={{ background: alertes > 0 ? '#fff7ed' : 'white', borderColor: alertes > 0 ? '#fed7aa' : '#f3f4f6' }}>
          <p className="text-xs mb-1" style={{ color: alertes > 0 ? '#c2410c' : '#6b7280' }}>Alertes stock faible</p>
          <p className="text-xl font-bold" style={{ color: alertes > 0 ? '#c2410c' : '#111827' }}>
            {alertes} alerte{alertes !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#0A1628' }}>
              {['Produit', 'Quantité', 'Entrepôt', 'Valeur', 'Date entrée', 'État'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {STOCKS.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Package2 className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{s.produit}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {new Intl.NumberFormat('fr-FR').format(s.quantite)} {s.unite}
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{s.entrepot}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{fmt(s.valeur)}</td>
                <td className="px-4 py-3 text-gray-500">{s.dateEntree}</td>
                <td className="px-4 py-3">
                  {s.alerte ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-orange-700"
                      style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                      <AlertTriangle className="w-3 h-3" /> Stock faible
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium text-green-700"
                      style={{ background: '#dcfce7' }}>
                      Normal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
