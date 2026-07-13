import { UserPlus, Phone, MapPin } from 'lucide-react'

const MEMBRES = [
  { id: 'M001', nom: 'Ouédraogo Adama', telephone: '+226 70 11 22 33', village: 'Koudougou', surface: '3.2 ha', produit: 'Coton', statut: 'Actif' },
  { id: 'M002', nom: 'Sawadogo Fatima', telephone: '+226 76 44 55 66', village: 'Réo', surface: '1.8 ha', produit: 'Sésame', statut: 'Actif' },
  { id: 'M003', nom: 'Kaboré Ibrahim', telephone: '+226 65 77 88 99', village: 'Didyr', surface: '4.5 ha', produit: 'Coton', statut: 'Actif' },
  { id: 'M004', nom: 'Zongo Marie', telephone: '+226 71 22 33 44', village: 'Koudougou', surface: '2.1 ha', produit: 'Karité', statut: 'Inactif' },
  { id: 'M005', nom: 'Traoré Seydou', telephone: '+226 78 99 00 11', village: 'Bobo-Dioulasso', surface: '6.0 ha', produit: 'Maïs', statut: 'Actif' },
]

export default function MembresPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membres</h1>
          <p className="text-gray-500 text-sm mt-0.5">{MEMBRES.length} membres enregistrés</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#D4AF37', color: '#0A1628' }}>
          <UserPlus className="w-4 h-4" /> Ajouter un membre
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#0A1628' }}>
              {['ID', 'Nom', 'Téléphone', 'Village', 'Surface', 'Produit', 'Statut'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MEMBRES.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{m.id}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{m.nom}</td>
                <td className="px-4 py-3 text-gray-600">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{m.telephone}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{m.village}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{m.surface}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: '#D4AF3720', color: '#92760A' }}>{m.produit}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${m.statut === 'Actif' ? 'text-green-700' : 'text-gray-500'}`}
                    style={{ background: m.statut === 'Actif' ? '#dcfce7' : '#f3f4f6' }}>
                    {m.statut}
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
