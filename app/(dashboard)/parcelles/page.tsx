'use client'

import { useState } from 'react'
import { MapPin, Plus, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Culture = 'Mil' | 'Sorgho' | 'Maïs' | 'Coton'
type Statut = 'En culture' | 'Jachère' | 'Disponible'

interface Parcelle {
  id: string
  numero: string
  membre: string
  surface: number
  culture: Culture
  village: string
  statut: Statut
  derniereRecolte: string
  gps: string
}

const PARCELLES_INIT: Parcelle[] = [
  { id: 'P001', numero: 'PRC-001', membre: 'Ouédraogo Adama', surface: 3.2, culture: 'Coton', village: 'Koudougou', statut: 'En culture', derniereRecolte: '2025-11-20', gps: '12.3647° N, 2.3634° O' },
  { id: 'P002', numero: 'PRC-002', membre: 'Sawadogo Fatima', surface: 1.8, culture: 'Sorgho', village: 'Réo', statut: 'En culture', derniereRecolte: '2025-10-15', gps: '12.3200° N, 2.4600° O' },
  { id: 'P003', numero: 'PRC-003', membre: 'Kaboré Ibrahim', surface: 4.5, culture: 'Coton', village: 'Didyr', statut: 'En culture', derniereRecolte: '2025-11-30', gps: '12.0100° N, 2.5800° O' },
  { id: 'P004', numero: 'PRC-004', membre: 'Zongo Marie', surface: 2.1, culture: 'Mil', village: 'Koudougou', statut: 'Jachère', derniereRecolte: '2024-11-05', gps: '12.3700° N, 2.3600° O' },
  { id: 'P005', numero: 'PRC-005', membre: 'Traoré Seydou', surface: 6.0, culture: 'Maïs', village: 'Bobo-Dioulasso', statut: 'En culture', derniereRecolte: '2025-12-10', gps: '11.1770° N, 4.2970° O' },
  { id: 'P006', numero: 'PRC-006', membre: 'Diallo Aminata', surface: 2.8, culture: 'Coton', village: 'Banfora', statut: 'En culture', derniereRecolte: '2025-11-25', gps: '10.6300° N, 4.7680° O' },
  { id: 'P007', numero: 'PRC-007', membre: 'Compaoré Jean', surface: 5.3, culture: 'Sorgho', village: 'Dédougou', statut: 'Disponible', derniereRecolte: '2025-10-28', gps: '12.4610° N, 3.4600° O' },
  { id: 'P008', numero: 'PRC-008', membre: 'Yago Sylvie', surface: 1.5, culture: 'Mil', village: 'Bobo-Dioulasso', statut: 'Jachère', derniereRecolte: '2024-10-20', gps: '11.1900° N, 4.3000° O' },
  { id: 'P009', numero: 'PRC-009', membre: 'Sawadogo Moussa', surface: 3.8, culture: 'Mil', village: 'Ouahigouya', statut: 'En culture', derniereRecolte: '2025-11-15', gps: '13.5800° N, 2.4200° O' },
  { id: 'P010', numero: 'PRC-010', membre: 'Tapsoba Alimata', surface: 2.4, culture: 'Coton', village: 'Dédougou', statut: 'Disponible', derniereRecolte: '2025-10-05', gps: '12.4700° N, 3.4700° O' },
  { id: 'P011', numero: 'PRC-011', membre: 'Ouédraogo Rasmané', surface: 4.1, culture: 'Sorgho', village: 'Koudougou', statut: 'En culture', derniereRecolte: '2025-11-18', gps: '12.3600° N, 2.3700° O' },
  { id: 'P012', numero: 'PRC-012', membre: 'Koné Mariam', surface: 0.9, culture: 'Maïs', village: 'Banfora', statut: 'En culture', derniereRecolte: '2025-12-01', gps: '10.6250° N, 4.7700° O' },
]

const VILLAGES = ['Tous', 'Koudougou', 'Réo', 'Didyr', 'Bobo-Dioulasso', 'Banfora', 'Dédougou', 'Ouahigouya'] as const
const CULTURES: (Culture | 'Toutes')[] = ['Toutes', 'Mil', 'Sorgho', 'Maïs', 'Coton']
const STATUTS: (Statut | 'Tous')[] = ['Tous', 'En culture', 'Jachère', 'Disponible']

// 13 régions du Burkina Faso
const REGIONS_BF = [
  'Boucle du Mouhoun (Dédougou)',
  'Cascades (Banfora)',
  'Centre (Ouagadougou)',
  'Centre-Est (Tenkodogo)',
  'Centre-Nord (Kaya)',
  'Centre-Ouest (Koudougou)',
  'Centre-Sud (Manga)',
  'Est (Fada N\'Gourma)',
  'Hauts-Bassins (Bobo-Dioulasso)',
  'Nord (Ouahigouya)',
  'Plateau-Central (Ziniaré)',
  'Sahel (Dori)',
  'Sud-Ouest (Gaoua)',
]

const MEMBRES_LIST = [
  'Ouédraogo Adama', 'Sawadogo Fatima', 'Kaboré Ibrahim', 'Zongo Marie',
  'Traoré Seydou', 'Diallo Aminata', 'Compaoré Jean', 'Yago Sylvie',
  'Sawadogo Moussa', 'Tapsoba Alimata', 'Ouédraogo Rasmané', 'Koné Mariam',
]

const STATUT_STYLES: Record<Statut, { bg: string; color: string }> = {
  'En culture': { bg: '#dcfce7', color: '#15803d' },
  'Jachère':    { bg: '#fef3c7', color: '#92400e' },
  'Disponible': { bg: '#f1f5f9', color: '#475569' },
}

const CULTURE_COLORS: Record<Culture, string> = {
  Coton: '#00BCD4',
  Sorgho: '#ef4444',
  Maïs: '#f59e0b',
  Mil: '#8b5cf6',
}

interface FormState {
  membre: string
  surface: string
  culture: Culture
  region: string
  gps: string
}

export default function ParcellesPage() {
  const [parcelles, setParcelles] = useState<Parcelle[]>(PARCELLES_INIT)
  const [recherche, setRecherche] = useState('')
  const [filterVillage, setFilterVillage] = useState<typeof VILLAGES[number]>('Tous')
  const [filterCulture, setFilterCulture] = useState<Culture | 'Toutes'>('Toutes')
  const [filterStatut, setFilterStatut] = useState<Statut | 'Tous'>('Tous')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<FormState>({
    membre: MEMBRES_LIST[0],
    surface: '',
    culture: 'Coton',
    region: REGIONS_BF[0],
    gps: '',
  })

  const totalParcelles = parcelles.length
  const surfaceTotale = parcelles.reduce((acc, p) => acc + p.surface, 0)
  const enCulture = parcelles.filter(p => p.statut === 'En culture').length
  const rendementMoyen = 820 // kg/ha — valeur représentative BF

  const kpis = [
    { label: 'Total parcelles', value: totalParcelles.toString(), color: '#00BCD4' },
    { label: 'Surface totale', value: surfaceTotale.toFixed(1) + ' ha', color: '#D4AF37' },
    { label: 'En culture', value: enCulture.toString(), color: '#10b981' },
    { label: 'Rendement moyen', value: new Intl.NumberFormat('fr-FR').format(rendementMoyen) + ' kg/ha', color: '#8b5cf6' },
  ]

  const filtered = parcelles.filter(p => {
    const q = recherche.toLowerCase()
    const matchQ = p.membre.toLowerCase().includes(q) || p.numero.toLowerCase().includes(q)
    const matchV = filterVillage === 'Tous' || p.village === filterVillage
    const matchC = filterCulture === 'Toutes' || p.culture === filterCulture
    const matchS = filterStatut === 'Tous' || p.statut === filterStatut
    return matchQ && matchV && matchC && matchS
  })

  function handleAjouter() {
    if (!form.surface || !form.membre) return
    const newParcelle: Parcelle = {
      id: `P${String(parcelles.length + 1).padStart(3, '0')}`,
      numero: `PRC-${String(parcelles.length + 1).padStart(3, '0')}`,
      membre: form.membre,
      surface: parseFloat(form.surface) || 0,
      culture: form.culture,
      village: form.region.split('(')[1]?.replace(')', '') ?? form.region,
      statut: 'Disponible',
      derniereRecolte: '—',
      gps: form.gps || '—',
    }
    setParcelles(prev => [...prev, newParcelle])
    setForm({ membre: MEMBRES_LIST[0], surface: '', culture: 'Coton', region: REGIONS_BF[0], gps: '' })
    setShowModal(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parcelles</h1>
          <p className="text-gray-500 text-sm mt-0.5">{enCulture} en culture sur {totalParcelles} parcelles enregistrées</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#D4AF37', color: '#0A1628' }}>
          <Plus className="w-4 h-4" /> Ajouter une parcelle
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1.5">{k.label}</p>
            <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par membre ou numéro…"
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          />
        </div>
        <select value={filterVillage} onChange={e => setFilterVillage(e.target.value as typeof VILLAGES[number])}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
          {VILLAGES.map(v => <option key={v}>{v}</option>)}
        </select>
        <select value={filterCulture} onChange={e => setFilterCulture(e.target.value as Culture | 'Toutes')}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
          {CULTURES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value as Statut | 'Tous')}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
          {STATUTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#0A1628' }}>
              {['N° Parcelle', 'Membre propriétaire', 'Surface', 'Culture', 'Village', 'Statut', 'Dernière récolte'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/60">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-12 text-sm">Aucune parcelle trouvée</td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#00BCD4' }} />
                      <span className="font-mono text-xs font-semibold text-gray-700">{p.numero}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.membre}</td>
                  <td className="px-4 py-3 text-gray-700 font-semibold">{p.surface} ha</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: CULTURE_COLORS[p.culture] + '20', color: CULTURE_COLORS[p.culture] }}>
                      {p.culture}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.village}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={STATUT_STYLES[p.statut]}>
                      {p.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {p.derniereRecolte === '—' ? '—' : new Date(p.derniereRecolte).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-50 text-xs text-gray-400">
            {filtered.length} parcelle{filtered.length > 1 ? 's' : ''} — {filtered.reduce((a, p) => a + p.surface, 0).toFixed(1)} ha
          </div>
        )}
      </div>

      {/* Modal Ajouter Parcelle */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(10,22,40,0.6)' }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Nouvelle parcelle</h2>
                <button onClick={() => setShowModal(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Membre propriétaire *</label>
                  <select value={form.membre}
                    onChange={e => setForm(p => ({ ...p, membre: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
                    {MEMBRES_LIST.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Surface (ha) *</label>
                  <input type="number" step="0.1" min="0.1" value={form.surface}
                    onChange={e => setForm(p => ({ ...p, surface: e.target.value }))}
                    placeholder="2.5"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Culture principale</label>
                  <select value={form.culture}
                    onChange={e => setForm(p => ({ ...p, culture: e.target.value as Culture }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
                    {(['Mil', 'Sorgho', 'Maïs', 'Coton'] as Culture[]).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Région (13 régions BF)</label>
                  <select value={form.region}
                    onChange={e => setForm(p => ({ ...p, region: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
                    {REGIONS_BF.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Coordonnées GPS (texte libre)</label>
                  <input type="text" value={form.gps}
                    onChange={e => setForm(p => ({ ...p, gps: e.target.value }))}
                    placeholder="12.3647° N, 2.3634° O"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button onClick={handleAjouter}
                  disabled={!form.surface || !form.membre}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ background: '#D4AF37', color: '#0A1628' }}>
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
