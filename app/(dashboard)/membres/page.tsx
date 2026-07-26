'use client'

// app/(dashboard)/membres/page.tsx
import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import {
  MEMBRES_INIT, VILLAGES, CULTURES, STATUTS, DEFAULT_FORM,
  type Membre, type Culture, type Statut, type FormState,
} from './membres.data'
import { MembresList } from './MembresList'
import { MembreModal } from './MembreModal'

export default function MembresPage() {
  const [membres, setMembres]             = useState<Membre[]>(MEMBRES_INIT)
  const [recherche, setRecherche]         = useState('')
  const [filterVillage, setFilterVillage] = useState<typeof VILLAGES[number]>('Tous')
  const [filterCulture, setFilterCulture] = useState<Culture | 'Toutes'>('Toutes')
  const [filterStatut,  setFilterStatut]  = useState<Statut | 'Tous'>('Tous')
  const [showModal, setShowModal]         = useState(false)
  const [form, setForm]                   = useState<FormState>(DEFAULT_FORM)

  const nbActifs      = membres.filter(m => m.statut === 'Actif').length
  const nbVillages    = new Set(membres.map(m => m.village)).size
  const surfaceTotale = membres.reduce((acc, m) => acc + m.surface, 0)

  const stats = [
    { label: 'Membres actifs',    value: nbActifs.toString(),                                                                 color: '#00BCD4' },
    { label: 'Villages couverts', value: nbVillages.toString(),                                                               color: '#D4AF37' },
    { label: 'Surface totale',    value: surfaceTotale.toFixed(1) + ' ha',                                                    color: '#10b981' },
    { label: 'Production saison', value: new Intl.NumberFormat('fr-FR').format(Math.round(surfaceTotale * 850)) + ' kg',     color: '#8b5cf6' },
  ]

  const filtered = membres.filter(m => {
    const q = recherche.toLowerCase()
    return (
      (m.nom.toLowerCase().includes(q) || m.village.toLowerCase().includes(q)) &&
      (filterVillage === 'Tous'    || m.village  === filterVillage) &&
      (filterCulture === 'Toutes'  || m.culture  === filterCulture) &&
      (filterStatut  === 'Tous'    || m.statut   === filterStatut)
    )
  })

  function handleAjouter() {
    if (!form.nom.trim()) return
    const newMembre: Membre = {
      id:           `M${String(membres.length + 1).padStart(3, '0')}`,
      nom:          form.nom.trim(),
      telephone:    form.telephone || '+226 00 00 00 00',
      village:      form.village,
      culture:      form.culture,
      surface:      parseFloat(form.surface) || 0,
      statut:       'Actif',
      dateAdhesion: new Date().toISOString().slice(0, 10),
    }
    setMembres(prev => [...prev, newMembre])
    setForm(DEFAULT_FORM)
    setShowModal(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membres</h1>
          <p className="text-gray-500 text-sm mt-0.5">{nbActifs} actifs sur {membres.length} membres</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: '#D4AF37', color: '#0A1628' }}>
          <UserPlus className="w-4 h-4" /> Ajouter un membre
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1.5">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <input type="text" placeholder="Rechercher un membre ou village…"
            value={recherche} onChange={e => setRecherche(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
        </div>
        <select value={filterVillage} onChange={e => setFilterVillage(e.target.value as typeof VILLAGES[number])}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          {VILLAGES.map(v => <option key={v}>{v}</option>)}
        </select>
        <select value={filterCulture} onChange={e => setFilterCulture(e.target.value as Culture | 'Toutes')}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          {CULTURES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value as Statut | 'Tous')}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          {STATUTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <MembresList membres={filtered} />

      <MembreModal
        open={showModal}
        form={form}
        onClose={() => setShowModal(false)}
        onChange={(patch) => setForm(prev => ({ ...prev, ...patch }))}
        onSubmit={handleAjouter}
      />
    </div>
  )
}
