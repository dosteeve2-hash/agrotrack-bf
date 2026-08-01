'use client'

import { useState, useEffect } from 'react'

export default function NavAlertBadge() {
  const [hasCritique, setHasCritique] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('https://api.open-meteo.com/v1/forecast?latitude=12.37&longitude=-1.53&current=temperature_2m,relative_humidity_2m&timezone=Africa%2FAbidjan', { signal: controller.signal })
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
  }, [])

  if (!hasCritique) return null

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
