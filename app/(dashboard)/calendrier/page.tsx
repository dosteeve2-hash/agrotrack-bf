'use client'

import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = 'Semis' | 'Récolte' | 'Traitement' | 'Irrigation'

interface AgriEvent {
  id: string
  date: string // YYYY-MM-DD
  type: EventType
  parcelle: string
  description: string
  notes?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_COLORS: Record<EventType, { dot: string; bg: string }> = {
  Semis:      { dot: '#10b981', bg: '#10b98120' },
  Récolte:    { dot: '#D4AF37', bg: '#D4AF3720' },
  Traitement: { dot: '#ef4444', bg: '#ef444420' },
  Irrigation: { dot: '#00D4FF', bg: '#00D4FF20' },
}

const JOURS     = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MOIS      = ['Janvier','Février','Mars','Avril','Mai','Juin',
                   'Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const PARCELLES = ['Parcelle A','Parcelle B','Parcelle C','Parcelle D','Parcelle E']
const TYPES: EventType[] = ['Semis','Récolte','Traitement','Irrigation']

// ─── Initial events (Août 2026) ───────────────────────────────────────────────

const INIT_EVENTS: AgriEvent[] = [
  { id:'1', date:'2026-08-03', type:'Semis',      parcelle:'Parcelle A', description:'Semis maïs variété locale',        notes:'Après la 1ère pluie' },
  { id:'2', date:'2026-08-07', type:'Irrigation', parcelle:'Parcelle B', description:'Irrigation sorgho',                notes:'Pompe solaire, 3h' },
  { id:'3', date:'2026-08-12', type:'Traitement', parcelle:'Parcelle A', description:'Fertilisation NPK parcelle A',     notes:'50 kg/ha' },
  { id:'4', date:'2026-08-15', type:'Traitement', parcelle:'Parcelle C', description:'Traitement phytosanitaire coton',  notes:'Fongicide + insecticide' },
  { id:'5', date:'2026-08-19', type:'Récolte',    parcelle:'Parcelle D', description:'Récolte sésame – 2ème coupe',      notes:'Rendement estimé 600 kg/ha' },
  { id:'6', date:'2026-08-21', type:'Semis',      parcelle:'Parcelle B', description:'Semis mil tardif',                 notes:'Densité 1,2 m × 0,8 m' },
  { id:'7', date:'2026-08-25', type:'Irrigation', parcelle:'Parcelle E', description:'Irrigation coton – phase floraison', notes:'Besoin hydrique critique' },
  { id:'8', date:'2026-08-28', type:'Récolte',    parcelle:'Parcelle C', description:'Récolte sorgho',                   notes:'Rendement estimé 1,5 t/ha' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }

function firstWeekday(y: number, m: number) {
  const d = new Date(y, m, 1).getDay()
  return d === 0 ? 6 : d - 1 // Mon=0 … Sun=6
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendrierPage() {
  const today = new Date()
  const [yr,  setYr]  = useState(today.getFullYear())
  const [mo,  setMo]  = useState(today.getMonth())
  const [events, setEvents] = useState<AgriEvent[]>(INIT_EVENTS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    date: '', type: 'Semis' as EventType,
    parcelle: 'Parcelle A', description: '', notes: '',
  })

  // Calendar grid
  const totalDays = daysInMonth(yr, mo)
  const pad       = firstWeekday(yr, mo)
  const cells: (number | null)[] = [...Array(pad).fill(null), ...Array.from({ length: totalDays }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  function eventsForDay(day: number) {
    const ds = `${yr}-${String(mo + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return events.filter(e => e.date === ds)
  }

  function navMonth(dir: 1 | -1) {
    const next = mo + dir
    if (next > 11) { setMo(0);  setYr(y => y + 1) }
    else if (next < 0) { setMo(11); setYr(y => y - 1) }
    else setMo(next)
  }

  function handleAdd() {
    if (!form.date || !form.description) return
    setEvents(prev => [...prev, { id: String(Date.now()), ...form }])
    setShowModal(false)
    setForm({ date:'', type:'Semis', parcelle:'Parcelle A', description:'', notes:'' })
  }

  // Upcoming 14 days
  const t0 = today.toISOString().split('T')[0]
  const t14 = new Date(today); t14.setDate(today.getDate() + 14)
  const t14s = t14.toISOString().split('T')[0]
  const upcoming = events.filter(e => e.date >= t0 && e.date <= t14s)
    .sort((a,b) => a.date.localeCompare(b.date))

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendrier agricole</h1>
          <p className="text-gray-500 text-sm mt-0.5">{events.length} événements planifiés</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
          style={{ background:'#D4AF37', color:'#0A1628' }}>
          <Plus className="w-4 h-4" /> Ajouter un événement
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Calendrier ── */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">

          {/* Navigation mois */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navMonth(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <h2 className="text-base font-semibold text-gray-900">{MOIS[mo]} {yr}</h2>
            <button onClick={() => navMonth(1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* En-têtes jours */}
          <div className="grid grid-cols-7 mb-1">
            {JOURS.map(j => (
              <div key={j} className="text-center text-xs font-medium text-gray-400 py-1">{j}</div>
            ))}
          </div>

          {/* Grille */}
          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
            {cells.map((day, i) => {
              const isToday = day !== null && yr === today.getFullYear() && mo === today.getMonth() && day === today.getDate()
              const dayEvs  = day ? eventsForDay(day) : []
              return (
                <div key={i} className={`bg-white min-h-[80px] p-1.5 ${day === null ? 'bg-gray-50/60' : ''}`}>
                  {day !== null && (
                    <>
                      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full mb-1"
                        style={isToday ? { background:'#0A1628', color:'#fff' } : { color:'#374151' }}>
                        {day}
                      </span>
                      <div className="space-y-0.5">
                        {dayEvs.slice(0,2).map(ev => (
                          <div key={ev.id} title={ev.description}
                            className="text-xs px-1 py-0.5 rounded truncate"
                            style={{ background: EVENT_COLORS[ev.type].bg, color: EVENT_COLORS[ev.type].dot,
                                     borderLeft: `2px solid ${EVENT_COLORS[ev.type].dot}` }}>
                            {ev.description}
                          </div>
                        ))}
                        {dayEvs.length > 2 && (
                          <div className="text-xs text-gray-400">+{dayEvs.length - 2}</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Légende */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            {TYPES.map(t => (
              <div key={t} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full" style={{ background: EVENT_COLORS[t].dot }} />
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ── Prochains 14 jours ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color:'#D4AF37' }} />
            Prochains 14 jours
          </h3>
          {upcoming.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Aucun événement à venir</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map(ev => {
                const d = new Date(ev.date + 'T00:00:00')
                return (
                  <div key={ev.id} className="flex gap-3">
                    <div className="flex-shrink-0 w-10 text-center">
                      <div className="text-xs text-gray-400 uppercase">
                        {d.toLocaleDateString('fr-FR',{weekday:'short'})}
                      </div>
                      <div className="text-lg font-bold leading-tight" style={{ color:'#0A1628' }}>
                        {d.getDate()}
                      </div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-2.5">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: EVENT_COLORS[ev.type].dot }} />
                        <span className="text-xs font-semibold" style={{ color: EVENT_COLORS[ev.type].dot }}>{ev.type}</span>
                        <span className="text-xs text-gray-400">· {ev.parcelle}</span>
                      </div>
                      <p className="text-sm text-gray-700">{ev.description}</p>
                      {ev.notes && <p className="text-xs text-gray-400 mt-0.5">{ev.notes}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal ajout ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Ajouter un événement</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date *</label>
                <input type="date" value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as EventType }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Parcelle</label>
                <select value={form.parcelle} onChange={e => setForm(f => ({ ...f, parcelle: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
                  {PARCELLES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
                <input type="text" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Ex : Semis mil variété locale"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optionnel)</label>
                <textarea value={form.notes} rows={2}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                  Annuler
                </button>
                <button onClick={handleAdd}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg hover:opacity-90"
                  style={{ background:'#D4AF37', color:'#0A1628' }}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
