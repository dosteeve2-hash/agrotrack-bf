'use client'

import { useMemo, useState, useTransition } from 'react'
import { UserPlus } from 'lucide-react'
import type { MembreVue } from '@/lib/data/membres'
import type { Culture, StatutMembre } from '@/lib/database.types'
import { LIBELLE_CULTURE } from '@/lib/database.types'
import { CULTURES_SAISISSABLES, DEFAULT_FORM, type FormState } from './membres.data'
import { MembresList } from './MembresList'
import { MembreModal } from './MembreModal'
import { ajouterMembre } from './actions'

interface Props {
  membres: MembreVue[]
  nomCooperative: string
}

export function MembresVue({ membres, nomCooperative }: Props) {
  const [recherche, setRecherche] = useState('')
  const [filterVillage, setFilterVillage] = useState('Tous')
  const [filterCulture, setFilterCulture] = useState<Culture | 'Toutes'>('Toutes')
  const [filterStatut, setFilterStatut] = useState<StatutMembre | 'Tous'>('Tous')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()

  // Les villages viennent des membres, pas d'une liste en dur : chaque
  // cooperative a les siens, et une liste figee excluait toutes les autres.
  const villages = useMemo(
    () => ['Tous', ...[...new Set(membres.map(m => m.village))].sort()],
    [membres],
  )

  const nbActifs = membres.filter(m => m.statut === 'actif').length
  const nbVillages = new Set(membres.map(m => m.village)).size
  const surfaceTotale = membres.reduce((acc, m) => acc + m.surfaceTotale, 0)

  const stats = [
    { label: 'Membres actifs',    value: nbActifs.toString(),          color: '#00BCD4' },
    { label: 'Villages couverts', value: nbVillages.toString(),        color: '#D4AF37' },
    { label: 'Surface totale',    value: surfaceTotale.toFixed(1) + ' ha', color: '#10b981' },
    { label: 'Parcelles suivies', value: membres.reduce((a, m) => a + m.cultures.length, 0).toString(), color: '#8b5cf6' },
  ]

  const filtered = membres.filter(m => {
    const q = recherche.toLowerCase()
    return (
      (m.nom.toLowerCase().includes(q) || m.village.toLowerCase().includes(q)) &&
      (filterVillage === 'Tous' || m.village === filterVillage) &&
      (filterCulture === 'Toutes' || m.cultures.includes(filterCulture)) &&
      (filterStatut === 'Tous' || m.statut === filterStatut)
    )
  })

  function handleAjouter() {
    setErreur(null)
    const donnees = new FormData()
    donnees.set('nom', form.nom)
    donnees.set('telephone', form.telephone)
    donnees.set('village', form.village)
    donnees.set('culture', form.culture)
    donnees.set('surface', form.surface)

    demarrer(async () => {
      const res = await ajouterMembre(donnees)
      if (!res.ok) {
        setErreur(res.message ?? 'Enregistrement impossible.')
        return
      }
      setForm(DEFAULT_FORM)
      setShowModal(false)
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Membres</h1>
          <p className="text-gray-500 text-sm mt-0.5 truncate">
            {nbActifs} actifs sur {membres.length} — {nomCooperative}
          </p>
        </div>
        <button onClick={() => { setErreur(null); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 flex-shrink-0"
          style={{ background: '#D4AF37', color: '#0A1628' }}>
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Ajouter un membre</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1.5">{s.label}</p>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <input type="text" placeholder="Rechercher un membre ou village…"
            aria-label="Rechercher un membre ou village"
            value={recherche} onChange={e => setRecherche(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
        </div>
        <select value={filterVillage} onChange={e => setFilterVillage(e.target.value)}
          aria-label="Filtrer par village"
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          {villages.map(v => <option key={v}>{v}</option>)}
        </select>
        <select value={filterCulture} onChange={e => setFilterCulture(e.target.value as Culture | 'Toutes')}
          aria-label="Filtrer par culture"
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          <option value="Toutes">Toutes</option>
          {CULTURES_SAISISSABLES.map(c => <option key={c} value={c}>{LIBELLE_CULTURE[c]}</option>)}
        </select>
        <select value={filterStatut} onChange={e => setFilterStatut(e.target.value as StatutMembre | 'Tous')}
          aria-label="Filtrer par statut"
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          <option value="Tous">Tous</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>

      <MembresList membres={filtered} />

      <MembreModal
        open={showModal}
        form={form}
        erreur={erreur}
        enCours={enCours}
        onClose={() => setShowModal(false)}
        onChange={(patch) => setForm(prev => ({ ...prev, ...patch }))}
        onSubmit={handleAjouter}
      />
    </div>
  )
}
