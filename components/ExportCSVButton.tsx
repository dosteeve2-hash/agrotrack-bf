'use client'

import { Download } from 'lucide-react'
import { PARCELLES_INIT } from '@/app/(dashboard)/parcelles/parcelles.data'

const RENDEMENT_MAP: Record<string, number> = {
  Coton: 820,
  Sorgho: 750,
  'Maïs': 1100,
  Mil: 680,
}

export default function ExportCSVButton() {
  const handleExport = () => {
    const headers = ['Numéro parcelle', 'Membre', 'Culture', 'Surface (ha)', 'Village', 'Statut', 'Rendement estimé (kg/ha)', 'Dernière récolte']
    const rows = PARCELLES_INIT.map(p => [
      p.numero,
      p.membre,
      p.culture,
      p.surface.toFixed(1),
      p.village,
      p.statut,
      (RENDEMENT_MAP[p.culture] ?? 700).toString(),
      p.derniereRecolte,
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport-cultures-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
      style={{ background: '#10b98120', color: '#10b981', border: '1px solid #10b98140' }}
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  )
}
