'use client'

import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, AlertTriangle, Plus } from 'lucide-react'
import { toast, Toaster } from 'sonner'

// ─── Types ───────────────────────────────────────────────────────────────────
type Condition = 'Ensoleillé' | 'Nuageux' | 'Pluvieux' | 'Orageux' | 'Brumeux'

interface JourMeteo {
  jour: string
  tMin: number
  tMax: number
  pluie: number
  humidity: number
  vent: number
  condition: Condition
}

interface AlerteMeteo {
  id: string
  type: 'Sécheresse' | 'Inondation' | 'Chaleur' | 'Vent' | 'Grêle'
  severity: 'Critique' | 'Élevée' | 'Modérée'
  message: string
  date: string
  cultures: string[]
}

// ─── Data ────────────────────────────────────────────────────────────────────
const PREVISIONS_7J: JourMeteo[] = [
  { jour: 'Lun 28',  tMin: 22, tMax: 34, pluie: 0,    humidity: 58, vent: 12, condition: 'Ensoleillé' },
  { jour: 'Mar 29',  tMin: 23, tMax: 36, pluie: 0,    humidity: 52, vent: 15, condition: 'Ensoleillé' },
  { jour: 'Mer 30',  tMin: 24, tMax: 37, pluie: 4.2,  humidity: 71, vent: 18, condition: 'Nuageux' },
  { jour: 'Jeu 31',  tMin: 21, tMax: 32, pluie: 18.5, humidity: 85, vent: 22, condition: 'Pluvieux' },
  { jour: 'Ven 01',  tMin: 20, tMax: 30, pluie: 28.1, humidity: 92, vent: 28, condition: 'Orageux' },
  { jour: 'Sam 02',  tMin: 22, tMax: 33, pluie: 6.3,  humidity: 74, vent: 16, condition: 'Nuageux' },
  { jour: 'Dim 03',  tMin: 23, tMax: 35, pluie: 0,    humidity: 60, vent: 10, condition: 'Ensoleillé' },
]

const HISTORIQUE_30J = Array.from({ length: 30 }, (_, i) => ({
  jour: `J-${30 - i}`,
  pluie: Math.round(Math.random() * 35),
  tMax: 28 + Math.round(Math.random() * 12),
}))

const ALERTES: AlerteMeteo[] = [
  { id: 'A001', type: 'Inondation', severity: 'Critique', message: 'Risque de crue dans les bas-fonds — déplacer les stocks de semences', date: '31 juil 2026', cultures: ['Riz', 'Maïs'] },
  { id: 'A002', type: 'Chaleur', severity: 'Élevée', message: 'Vague de chaleur 37°C+ — irriguer tôt matin et en soirée', date: '29 juil 2026', cultures: ['Coton', 'Sésame'] },
  { id: 'A003', type: 'Vent', severity: 'Modérée', message: 'Vents forts 28 km/h — retarder les traitements phytosanitaires', date: '31 juil 2026', cultures: ['Mil', 'Sorgho'] },
]

const CONSEILS_CULTURES = [
  { culture: 'Maïs', conseil: 'Prévoir drainage — risque excès eau J3-J4', action: 'Creuser canaux', urgence: 'Haute' },
  { culture: 'Coton', conseil: 'Stade floraison — irrigation critique si >35°C', action: 'Irriguer matin', urgence: 'Haute' },
  { culture: 'Sorgho', conseil: 'Conditions favorables pour semis tardif', action: 'Semer avant J4', urgence: 'Normale' },
  { culture: 'Sésame', conseil: 'Éviter irrigation les 3 prochains jours — pluies prévues', action: 'Attendre pluies', urgence: 'Basse' },
  { culture: 'Mil', conseil: 'Bonne humidité — surveiller maladies fongiques', action: 'Traitement préventif', urgence: 'Normale' },
]

const COND_ICON: Record<Condition, React.ReactNode> = {
  'Ensoleillé': <Sun size={24} style={{ color: '#D4AF37' }} />,
  'Nuageux':    <Cloud size={24} style={{ color: '#9ba8c4' }} />,
  'Pluvieux':   <CloudRain size={24} style={{ color: '#00D4FF' }} />,
  'Orageux':    <CloudRain size={24} style={{ color: '#ef4444' }} />,
  'Brumeux':    <Cloud size={24} style={{ color: '#6b7280' }} />,
}

const SEVERITY_STYLE = {
  'Critique': { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' },
  'Élevée':   { bg: 'rgba(249,115,22,0.12)', color: '#f97316' },
  'Modérée':  { bg: 'rgba(212,175,55,0.12)', color: '#D4AF37' },
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MeteoPage() {
  const [tab, setTab] = useState<'previsions' | 'historique' | 'alertes'>('previsions')
  const aujourd = PREVISIONS_7J[0]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Toaster position="bottom-right" />
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Météo Agricole</h1>
          <p className="text-gray-500 text-sm mt-0.5">Prévisions et alertes pour vos parcelles</p>
        </div>
        <button onClick={() => toast.success('Alerte météo configurée')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: '#0A1628', color: '#fff' }}>
          <Plus size={15} /> Configurer alertes
        </button>
      </div>

      {/* Current weather card */}
      <div className="rounded-2xl p-6 mb-6 text-white"
        style={{ background: 'linear-gradient(135deg, #0A1628 0%, #163054 100%)', border: '1px solid #1e3a5f' }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/50 text-sm mb-1">Aujourd&apos;hui — Région Hauts-Bassins</p>
            <div className="flex items-center gap-4">
              {COND_ICON[aujourd.condition]}
              <div>
                <p style={{ fontSize: '3rem', fontWeight: 900, color: '#D4AF37', lineHeight: 1 }}>{aujourd.tMax}°C</p>
                <p className="text-white/60 text-sm">Min {aujourd.tMin}°C · {aujourd.condition}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: <Droplets size={18} style={{ color: '#00D4FF' }} />, label: 'Humidité', value: aujourd.humidity + '%' },
              { icon: <Wind size={18} style={{ color: '#9ba8c4' }} />, label: 'Vent', value: aujourd.vent + ' km/h' },
              { icon: <CloudRain size={18} style={{ color: '#00D4FF' }} />, label: 'Pluie', value: aujourd.pluie + ' mm' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="flex justify-center mb-1">{s.icon}</div>
                <p className="text-white/40 text-xs">{s.label}</p>
                <p className="text-white font-bold text-sm">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(['previsions', 'historique', 'alertes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
            style={{ background: tab === t ? '#0A1628' : '#f1f5f9', color: tab === t ? '#D4AF37' : '#64748b' }}>
            {t === 'previsions' ? 'Prévisions 7j' : t === 'historique' ? 'Historique 30j' : 'Alertes'}
            {t === 'alertes' && <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{ALERTES.filter(a => a.severity === 'Critique').length}</span>}
          </button>
        ))}
      </div>

      {/* Prévisions 7j */}
      {tab === 'previsions' && (
        <>
          <div className="grid grid-cols-7 gap-2 mb-6">
            {PREVISIONS_7J.map((j, i) => (
              <div key={j.jour} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100"
                style={{ borderTop: i === 0 ? '3px solid #D4AF37' : '3px solid transparent' }}>
                <p className="text-xs text-gray-500 font-medium mb-2">{j.jour}</p>
                <div className="flex justify-center mb-2">{COND_ICON[j.condition]}</div>
                <p className="font-bold text-gray-800 text-sm">{j.tMax}°</p>
                <p className="text-xs text-gray-400">{j.tMin}°</p>
                {j.pluie > 0 && <p className="text-xs mt-1" style={{ color: '#00D4FF' }}>{j.pluie}mm</p>}
              </div>
            ))}
          </div>

          {/* Conseils cultures */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Thermometer size={16} style={{ color: '#D4AF37' }} /> Conseils par culture
            </h2>
            <div className="flex flex-col gap-3">
              {CONSEILS_CULTURES.map(c => (
                <div key={c.culture} className="flex items-start justify-between gap-4 p-3 rounded-lg"
                  style={{ background: c.urgence === 'Haute' ? 'rgba(239,68,68,0.04)' : '#f8fafc', border: `1px solid ${c.urgence === 'Haute' ? 'rgba(239,68,68,0.15)' : '#e2e8f0'}` }}>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{c.culture}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.conseil}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: c.urgence === 'Haute' ? 'rgba(239,68,68,0.1)' : c.urgence === 'Normale' ? 'rgba(212,175,55,0.1)' : 'rgba(16,185,129,0.1)',
                        color: c.urgence === 'Haute' ? '#ef4444' : c.urgence === 'Normale' ? '#D4AF37' : '#10b981' }}>
                      {c.urgence}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{c.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Historique 30j */}
      {tab === 'historique' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Précipitations 30 jours (mm)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={HISTORIQUE_30J} barSize={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="jour" tick={{ fontSize: 9, fill: '#94a3b8' }} interval={4} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={28} />
                <Tooltip formatter={(v) => [(v as number) + ' mm', 'Pluie']} />
                <Bar dataKey="pluie" fill="#00D4FF" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Températures max 30 jours (°C)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={HISTORIQUE_30J}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="jour" tick={{ fontSize: 9, fill: '#94a3b8' }} interval={4} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[20, 45]} width={28} />
                <Tooltip formatter={(v) => [(v as number) + '°C', 'T° Max']} />
                <Line dataKey="tMax" stroke="#D4AF37" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Alertes */}
      {tab === 'alertes' && (
        <div className="flex flex-col gap-4 mb-6">
          {ALERTES.map(a => (
            <div key={a.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} style={{ color: SEVERITY_STYLE[a.severity].color, flexShrink: 0, marginTop: 2 }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-sm">{a.type}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: SEVERITY_STYLE[a.severity].bg, color: SEVERITY_STYLE[a.severity].color }}>{a.severity}</span>
                    <span className="text-xs text-gray-400 ml-auto">{a.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{a.message}</p>
                  <div className="flex gap-1.5 mt-2">
                    {a.cultures.map(c => (
                      <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {ALERTES.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Cloud size={40} className="mx-auto mb-3 opacity-30" />
              <p>Aucune alerte météo active</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
