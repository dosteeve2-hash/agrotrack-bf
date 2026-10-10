'use client'

import { useState, useEffect } from 'react'
import { useParametresCompte } from '@/lib/compte/useParametresCompte'
import { coordonneesDuCompte, urlMeteoActuelle } from '@/lib/compte/meteo'

export default function NavAlertBadge() {
  const [hasCritique, setHasCritique] = useState(false)
  const coords = coordonneesDuCompte(useParametresCompte())
  const latitude = coords?.latitude
  const longitude = coords?.longitude

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return
    const controller = new AbortController()
    fetch(urlMeteoActuelle({ latitude, longitude }, 'temperature_2m,relative_humidity_2m'), { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        const c = data?.current
        if (!c) return
        const temp = Math.round(c.temperature_2m)
        const humidity = c.relative_humidity_2m
        if (temp > 38 || humidity < 30) setHasCritique(true)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [latitude, longitude])

  if (!coords || !hasCritique) return null

  return (
    <span
      className="ml-auto flex-shrink-0"
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#ef4444',
        boxShadow: '0 0 0 2px rgba(239,68,68,0.3)',
        animation: 'pulse 1.4s ease-in-out infinite',
      }}
    />
  )
}
