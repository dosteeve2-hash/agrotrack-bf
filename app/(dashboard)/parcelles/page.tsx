'use client'

// app/(dashboard)/parcelles/page.tsx
import { useState } from 'react'
import { Plus, MapPin as MapPinIcon } from 'lucide-react'
import {
  PARCELLES_INIT, VILLAGES, CULTURES, STATUTS, DEFAULT_FORM,
  CULTURE_COLORS, STATUT_STYLES,
  type Parcelle, type Culture, type Statut, type FormState,
} from './parcelles.data'
import { ParcelleTable } from './ParcelleTable'
import { ParcelleModal } from './ParcelleModal'

/* ─── Carte visuelle parcelles ──────────────────────────── */
function CarteParcelles({ parcelles }: { parcelles: Parcelle[] }) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPinIcon className="w-4 h-4" style={{ color: '#D4AF37' }} />
        <h2 className="font-semibold text-gray-900 text-sm">Carte des parcelles</h2>
        <span className="text-xs text-gray-400 ml-auto">{parcelles.length} parcelles</span>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-3 mb-4">
        {(Object.entries(CULTURE_COLORS) as [Culture, string][]).map(([culture, color]) => (
          <div key={culture} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: color }} />
            <span className="text-xs text-gray-500">{culture}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="w-3 h-3 rounded-sm border-2 border-dashed border-gray-300 flex-shrink-0" />
          <span className="text-xs text-gray-400">Vide</span>
        </div>
      </div>

      {/* Grille 4 × 5 = 20 cellules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
        {Array.from({ length: 20 }).map((_, i) => {
          const parcelle = parcelles[i]
          const isHov = hovered === parcelle?.id
          return (
            <div
              key={i}
              onMouseEnter={() => parcelle && setHovered(parcelle.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                aspectRatio: '1',
                borderRadius: 8,
                position: 'relative',
                cursor: parcelle ? 'pointer' : 'default',
                transition: 'transform 0.15s, box-shadow 0.15s',
                transform: isHov ? 'scale(1.06)' : 'scale(1)',
                boxShadow: isHov ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                background: parcelle
                  ? `${CULTURE_COLORS[parcelle.culture]}${parcelle.statut === 'Jachère' ? '55' : 'cc'}`
                  : '#f1f5f9',
                border: parcelle ? `2px solid ${CULTURE_COLORS[parcelle.culture]}` : '2px dashed #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
                overflow: 'hidden',
              }}
              title={parcelle ? `${parcelle.numero} — ${parcelle.culture} (${parcelle.surface} ha) — ${parcelle.statut}` : ''}
            >
              {parcelle ? (
                <>
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)', lineHeight: 1, textAlign: 'center' }}>
                    {parcelle.numero.replace('PRC-', 'P')}
                  </span>
                  <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.85)', marginTop: 2, textAlign: 'center', lineHeight: 1 }}>
                    {parcelle.surface}ha
                  </span>
                  {parcelle.statut === 'Jachère' && (
                    <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>jachère</span>
                  )}
                  {/* Tooltip au survol */}
                  {isHov && (
                    <div style={{
                      position: 'absolute', bottom: '110%', left: '50%', transform: 'translateX(-50%)',
                      background: '#0A1628', color: '#fff', borderRadius: 8, padding: '6px 10px',
                      fontSize: 11, whiteSpace: 'nowrap', zIndex: 10, pointerEvents: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}>
                      <p style={{ fontWeight: 700, marginBottom: 2 }}>{parcelle.numero}</p>
                      <p style={{ opacity: 0.8 }}>{parcelle.membre.split(' ')[0]}</p>
                      <p style={{ opacity: 0.7 }}>{parcelle.culture} · {parcelle.surface} ha</p>
                      <p style={{ fontSize: 10, marginTop: 3, padding: '2px 6px', borderRadius: 4, display: 'inline-block', background: STATUT_STYLES[parcelle.statut].bg, color: STATUT_STYLES[parcelle.statut].color }}>
                        {parcelle.statut}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <span style={{ fontSize: 16, color: '#e2e8f0' }}>+</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ParcellesPage() {
  const [parcelles, setParcelles] = useState<Parcelle[]>(PARCELLES_INIT)
  const [recherche, setRecherche]       = useState('')
  const [filterVillage, setFilterVillage] = useState<typeof VILLAGES[number]>('Tous')
  const [filterCulture, setFilterCulture] = useState<Culture | 'Toutes'>('Toutes')
  const [filterStatut,  setFilterStatut]  = useState<Statut | 'Tous'>('Tous')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState<FormState>(DEFAULT_FORM)

  const totalParcelles = parcelles.length
  const surfaceTotale  = parcelles.reduce((acc, p) => acc + p.surface, 0)
  const enCulture      = parcelles.filter(p => p.statut === 'En culture').length

  const kpis = [
    { label: 'Total parcelles',  value: totalParcelles.toString(),                                          color: '#00BCD4' },
    { label: 'Surface totale',   value: surfaceTotale.toFixed(1) + ' ha',                                   color: '#D4AF37' },
    { label: 'En culture',       value: enCulture.toString(),                                                color: '#10b981' },
    { label: 'Rendement moyen',  value: new Intl.NumberFormat('fr-FR').format(820) + ' kg/ha',              color: '#8b5cf6' },
  ]

  const filtered = parcelles.filter(p => {
    const q = recherche.toLowerCase()
    return (
      (p.membre.toLowerCase().includes(q) || p.numero.toLowerCase().includes(q)) &&
      (filterVillage === 'Tous'    || p.village  === filterVillage) &&
      (filterCulture === 'Toutes'  || p.culture  === filterCulture) &&
      (filterStatut  === 'Tous'    || p.statut   === filterStatut)
    )
  })

  function handleAjouter() {
    if (!form.surface || !form.membre) return
    const newParcelle: Parcelle = {
      id:              `P${String(parcelles.length + 1).padStart(3, '0')}`,
      numero:          `PRC-${String(parcelles.length + 1).padStart(3, '0')}`,
      membre:          form.membre,
      surface:         parseFloat(form.surface) || 0,
      culture:         form.culture,
      village:         form.region.split('(')[1]?.replace(')', '') ?? form.region,
      statut:          'Disponible',
      derniereRecolte: '—',
      gps:             form.gps || '—',
    }
    setParcelles(prev => [...prev, newParcelle])
    setForm(DEFAULT_FORM)
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
        <button onClick={() => setShowModal(true)}
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

      {/* Carte visuelle */}
      <CarteParcelles parcelles={parcelles} />

      {/* Filtres */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <input type="text" placeholder="Rechercher par membre ou numéro…"
            value={recherche} onChange={e => setRecherche(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
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

      <ParcelleTable parcelles={filtered} />

      <ParcelleModal
        open={showModal}
        form={form}
        onClose={() => setShowModal(false)}
        onChange={(patch) => setForm(prev => ({ ...prev, ...patch }))}
        onSubmit={handleAjouter}
      />
    </div>
  )
}
