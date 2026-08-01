'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Info, CheckCircle2, X, Bell, Droplets, Thermometer, CloudRain } from 'lucide-react'

type Niveau = 'critique' | 'attention' | 'info'

interface Alerte {
  id: string
  niveau: Niveau
  titre: string
  message: string
  heure: string
}

const ALERTES_STATIQUES: Alerte[] = [
  { id: 'a2', niveau: 'attention', titre: 'Stade critique mil', message: "Apport d'engrais azoté recommandé sous 3 jours pour maintenir le rendement estimé.", heure: 'Il y a 4h' },
  { id: 'a4', niveau: 'info', titre: 'Récolte sorgho Parcelle 3', message: 'Rendement estimé : 1,8 T/ha — soit +12 % vs prévisions. Planifier la logistique de collecte.', heure: 'Il y a 8h' },
]

const CONFIG: Record<Niveau, { icon: typeof AlertTriangle; bg: string; border: string; text: string; badge: string; badgeBg: string }> = {
  critique: { icon: AlertTriangle, bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.3)', text: '#ef4444', badge: 'Critique', badgeBg: 'rgba(239,68,68,0.12)' },
  attention: { icon: AlertTriangle, bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', badge: 'Attention', badgeBg: 'rgba(245,158,11,0.12)' },
  info: { icon: Info, bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.3)', text: '#22c55e', badge: 'Info', badgeBg: 'rgba(34,197,94,0.12)' },
}

function buildMeteoAlertes(temperature: number, humidity: number): Alerte[] {
  const alertes: Alerte[] = []
  if (humidity < 30) {
    alertes.push({ id: 'meteo-secheresse', niveau: 'critique', titre: 'Risque de sécheresse', message: `Humidité actuelle : ${humidity}% (seuil critique < 30%). Irrigation d'urgence recommandée sur les parcelles à faible réserve hydrique.`, heure: 'En direct' })
  }
  if (humidity > 80) {
    alertes.push({ id: 'meteo-pluie', niveau: 'attention', titre: 'Humidité excessive', message: `Humidité élevée : ${humidity}% (> 80%). Risque de maladies fongiques. Surveiller les cultures sensibles et aérer si possible.`, heure: 'En direct' })
  }
  if (temperature > 38) {
    alertes.push({ id: 'meteo-chaleur', niveau: 'critique', titre: 'Chaleur extrême', message: `Température actuelle : ${temperature}°C (> 38°C). Protection des cultures fragiles conseillée — couverture ou irrigation matinale avant 8h.`, heure: 'En direct' })
  }
  return alertes
}

export let alertesCritiquesCount = 0

export default function AlertesAgro() {
  const [alertes, setAlertes] = useState<Alerte[]>(ALERTES_STATIQUES)
  const [meteoLoaded, setMeteoLoaded] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('https://api.open-meteo.com/v1/forecast?latitude=12.37&longitude=-1.53&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Africa%2FAbidjan', { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        const c = data?.current
        if (!c) return
        const temperature = Math.round(c.temperature_2m)
        const humidity = c.relative_humidity_2m
        const meteoAlertes = buildMeteoAlertes(temperature, humidity)
        setAlertes(prev => {
          const existingIds = new Set(prev.map(a => a.id))
          const nouvelles = meteoAlertes.filter(a => !existingIds.has(a.id))
          return [...nouvelles, ...prev]
        })
      })
      .catch(() => {})
      .finally(() => setMeteoLoaded(true))
    return () => controller.abort()
  }, [])

  const marquerTraite = (id: string) => {
    setAlertes(prev => prev.filter(a => a.id !== id))
  }

  const nbCritiques = alertes.filter(a => a.niveau === 'critique').length
  alertesCritiquesCount = nbCritiques

  if (alertes.length === 0 && meteoLoaded) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4" style={{ color: '#D4AF37' }} />
          <h2 className="font-semibold text-gray-900 text-sm">Alertes agronomiques</h2>
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          Toutes les alertes ont été traitées
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: '#D4AF37' }} />
          <h2 className="font-semibold text-gray-900 text-sm">Alertes agronomiques</h2>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#D4AF3720', color: '#92760A' }}>
            {alertes.length} active{alertes.length > 1 ? 's' : ''}
          </span>
        </div>
        {nbCritiques > 0 && (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
            <AlertTriangle className="w-3 h-3" />
            {nbCritiques} critique{nbCritiques > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="divide-y divide-gray-50">
        <AnimatePresence initial={false}>
          {alertes.map((alerte) => {
            const cfg = CONFIG[alerte.niveau]
            const Icon = alerte.id.startsWith('meteo-secheresse') ? Droplets
              : alerte.id.startsWith('meteo-chaleur') ? Thermometer
              : alerte.id.startsWith('meteo-pluie') ? CloudRain
              : cfg.icon
            return (
              <motion.div
                key={alerte.id}
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="flex items-start gap-4 px-5 py-4"
                style={{ background: cfg.bg }}
              >
                <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: cfg.badgeBg }}>
                  <Icon className="w-4 h-4" style={{ color: cfg.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.badgeBg, color: cfg.text }}>{cfg.badge}</span>
                    <span className="text-xs text-gray-400">{alerte.heure}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{alerte.titre}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{alerte.message}</p>
                </div>
                <button onClick={() => marquerTraite(alerte.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-gray-100 border border-gray-200 text-gray-500 mt-0.5"
                  title="Marquer comme traité">
                  <X className="w-3 h-3" /> Traité
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
