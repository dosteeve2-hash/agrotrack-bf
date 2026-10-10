'use client'

import { Download } from 'lucide-react'
import type { ParcelleVue } from '@/lib/data/parcelles.model'
import { libelleCulture } from '@/lib/cultures'

/** Exporte les vraies parcelles du compte ; désactivé tant qu'il n'y en a aucune. */
export default function ExportCSVButton({ parcelles }: { parcelles: ParcelleVue[] }) {
  const handleExport = () => {
    const headers = ['Parcelle', 'Producteur', 'Culture', 'Superficie (ha)', 'Localité', 'Statut', 'Rendement estimé (kg/ha)']
    const rows = parcelles.map(p => [
      p.nom, p.membreNom, libelleCulture(p.culture), p.superficie.toFixed(2),
      p.village, p.statut, String(p.rendementEstime),
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
      disabled={parcelles.length === 0}
      title={parcelles.length === 0 ? 'Aucune parcelle à exporter' : undefined}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ background: '#10b98120', color: '#047857', border: '1px solid #10b98140' }}
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  )
}
