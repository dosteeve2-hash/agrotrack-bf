'use client'

import { useEffect, useState } from 'react'
import { Thermometer, Droplets } from 'lucide-react'

interface WeatherData {
  temperature: number
  humidity: number
  weatherCode: number
}

function getWeatherInfo(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Ensoleillé', icon: '☀️' }
  if (code <= 3) return { label: code === 1 ? 'Dégagé' : code === 2 ? 'Partiellement nuageux' : 'Nuageux', icon: code === 1 ? '🌤️' : code === 2 ? '⛅' : '☁️' }
  if (code <= 48) return { label: 'Brumeux', icon: '🌫️' }
  if (code <= 67) return { label: 'Pluvieux', icon: '🌧️' }
  if (code <= 77) return { label: 'Neigeux', icon: '❄️' }
  if (code <= 82) return { label: 'Averses', icon: '🌦️' }
  return { label: 'Orageux', icon: '⛈️' }
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=12.37&longitude=-1.53&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Africa%2FAbidjan',
      { signal: controller.signal }
    )
      .then(r => r.json())
      .then(data => {
        const c = data?.current
        if (!c) throw new Error('no data')
        setWeather({
          temperature: Math.round(c.temperature_2m),
          humidity: c.relative_humidity_2m,
          weatherCode: c.weather_code,
        })
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  const info = weather ? getWeatherInfo(weather.weatherCode) : null

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500">Météo — Ouagadougou</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: '#00BCD420', color: '#00BCD4' }}>
          En direct
        </span>
      </div>

      {loading && (
        <div className="animate-pulse space-y-2">
          <div className="h-8 w-24 rounded bg-gray-100" />
          <div className="h-4 w-32 rounded bg-gray-100" />
          <div className="h-3 w-20 rounded bg-gray-100" />
        </div>
      )}

      {error && !loading && (
        <p className="text-sm text-gray-400">Données indisponibles</p>
      )}

      {weather && info && (
        <div>
          {/* Température + icône */}
          <div className="flex items-end gap-3 mb-3">
            <span className="text-3xl" aria-label={info.label}>{info.icon}</span>
            <div>
              <p className="text-3xl font-bold text-gray-900 leading-none">
                {weather.temperature}°C
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{info.label}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-gray-500 font-medium">{weather.humidity}% humidité</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-gray-500 font-medium">Ressenti +2°C</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
