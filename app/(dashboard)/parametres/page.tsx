'use client'

import { useState, type ElementType } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Building2, Bell, Check } from 'lucide-react'

type TabId = 'profil' | 'cooperative' | 'alertes'
type CultureKey = 'Coton' | 'Sorgho' | 'Maïs' | 'Mil' | 'Sésame' | 'Karité'

const TABS: { id: TabId; label: string; icon: ElementType }[] = [
  { id: 'profil', label: 'Profil', icon: User },
  { id: 'cooperative', label: 'Coopérative', icon: Building2 },
  { id: 'alertes', label: 'Alertes', icon: Bell },
]

const REGIONS = ['Centre', 'Centre-Ouest', 'Hauts-Bassins', 'Cascades', 'Nord', 'Sahel', 'Est', 'Sud-Ouest']
const CULTURES_LIST: CultureKey[] = ['Coton', 'Sorgho', 'Maïs', 'Mil', 'Sésame', 'Karité']

interface ProfilState { nom: string; telephone: string; zone: string }
interface CoopState {
  nom: string; region: string; nbMembersCible: string
  cultures: Record<CultureKey, boolean>
}
interface AlertesState {
  seuilEau: string
  alerteSecheresse: boolean
  alertePrix: boolean
  rapportMensuel: boolean
}

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profil')
  const [showToast, setShowToast] = useState(false)

  const [profil, setProfil] = useState<ProfilState>({
    nom: 'Koné Dramane',
    telephone: '+226 70 12 34 56',
    zone: 'Région du Centre-Ouest',
  })

  const [coop, setCoop] = useState<CoopState>({
    nom: 'Coopérative Agricole du Centre-Ouest',
    region: 'Centre-Ouest',
    nbMembersCible: '200',
    cultures: { Coton: true, Sorgho: true, Maïs: true, Mil: false, Sésame: true, Karité: false },
  })

  const [alertes, setAlertes] = useState<AlertesState>({
    seuilEau: '25',
    alerteSecheresse: true,
    alertePrix: true,
    rapportMensuel: false,
  })

  function handleSave() {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const boolAlerteKeys: { key: keyof AlertesState & ('alerteSecheresse'|'alertePrix'|'rapportMensuel'); label: string; desc: string }[] = [
    { key: 'alerteSecheresse', label: 'Alerte sécheresse', desc: 'Notification si risque de sécheresse détecté' },
    { key: 'alertePrix', label: 'Alerte prix marché', desc: 'Notification si variation de prix > 10 %' },
    { key: 'rapportMensuel', label: 'Rapport mensuel auto', desc: 'Envoi par email le 1er de chaque mois' },
  ]

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 text-sm mt-0.5">Configuration de votre compte et de la coopérative</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium relative transition-colors"
            style={{ color: activeTab === tab.id ? '#0A1628' : '#6b7280' }}>
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-bg"
                className="absolute inset-0 rounded-lg bg-white shadow-sm"
                transition={{ type: 'spring' as const, stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Contenu onglet */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}>

            {activeTab === 'profil' && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Informations agent</h2>
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                    style={{ background: '#0A1628' }}>
                    {profil.nom.split(' ').map(p => p[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{profil.nom}</p>
                    <button className="text-xs mt-0.5 hover:underline" style={{ color: '#00BCD4' }}>
                      Changer la photo
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nom complet</label>
                  <input type="text" value={profil.nom}
                    onChange={e => setProfil(p => ({ ...p, nom: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Téléphone</label>
                  <input type="tel" value={profil.telephone}
                    onChange={e => setProfil(p => ({ ...p, telephone: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{"Zone d'intervention"}</label>
                  <input type="text" value={profil.zone}
                    onChange={e => setProfil(p => ({ ...p, zone: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                </div>
              </div>
            )}

            {activeTab === 'cooperative' && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Informations coopérative</h2>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nom de la coopérative</label>
                  <input type="text" value={coop.nom}
                    onChange={e => setCoop(p => ({ ...p, nom: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Région</label>
                  <select value={coop.region}
                    onChange={e => setCoop(p => ({ ...p, region: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
                    {REGIONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nombre de membres cible</label>
                  <input type="number" value={coop.nbMembersCible}
                    onChange={e => setCoop(p => ({ ...p, nbMembersCible: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Cultures suivies</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CULTURES_LIST.map(c => (
                      <label key={c} className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={coop.cultures[c]}
                          onChange={e => setCoop(p => ({
                            ...p,
                            cultures: { ...p.cultures, [c]: e.target.checked },
                          }))}
                          className="rounded" style={{ accentColor: '#00BCD4' }} />
                        <span className="text-sm text-gray-700">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'alertes' && (
              <div className="space-y-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Configuration des alertes</h2>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Seuil pluviométrie (mm)</label>
                  <input type="number" value={alertes.seuilEau}
                    onChange={e => setAlertes(p => ({ ...p, seuilEau: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
                  <p className="text-xs text-gray-400 mt-1">Alerte déclenchée si cumul mensuel sous ce seuil</p>
                </div>
                <div className="space-y-1">
                  {boolAlerteKeys.map(item => (
                    <div key={item.key}
                      className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setAlertes(p => ({ ...p, [item.key]: !p[item.key] }))}
                        className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4"
                        style={{ background: alertes[item.key] ? '#00BCD4' : '#e5e7eb' }}
                        aria-checked={alertes[item.key]}
                        role="switch">
                        <motion.span
                          animate={{ x: alertes[item.key] ? 22 : 2 }}
                          transition={{ type: 'spring' as const, stiffness: 500, damping: 35 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm block"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bouton sauvegarder */}
      <div className="flex justify-end mt-6">
        <button onClick={handleSave}
          className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-all hover:opacity-90"
          style={{ background: '#0A1628', color: 'white' }}>
          Sauvegarder
        </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium z-50"
            style={{ background: '#0A1628', color: 'white' }}>
            <Check className="w-4 h-4" style={{ color: '#10b981' }} />
            Paramètres sauvegardés
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
