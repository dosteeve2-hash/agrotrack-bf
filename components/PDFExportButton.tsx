'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import type { CultureRow } from '@/app/(dashboard)/rapports/rapports.data'
import { formatMontant } from '@/lib/format'
import { libelleCulture } from '@/lib/cultures'
import { useParametresCompte } from '@/lib/compte/useParametresCompte'

interface KpiData {
  membresActifs: number
  recoltesTonnes: number
  revenusTotal: number
  incidents: number
}

interface Props {
  moisLabel: string
  annee: string
  kpi: KpiData
  cultures: CultureRow[]
}

/**
 * Les polices standard de jsPDF ne gèrent que le Latin-1 (et €) : les espaces fines
 * insécables d'Intl et certains symboles de devise s'y afficheraient mal. On
 * normalise les espaces et, si un symbole n'est pas imprimable, on écrit le code ISO.
 */
function montantPdf(montant: number, devise: string | null): string {
  const texte = formatMontant(montant, devise).replace(/[\u00a0\u202f]/g, ' ')
  if (!/[^\x20-\xff\u20ac]/.test(texte)) return texte
  return `${formatMontant(montant, null).replace(/[\u00a0\u202f]/g, ' ')} ${devise ?? ''}`.trim()
}

const nombrePdf = (n: number) => formatMontant(n, null).replace(/[\u00a0\u202f]/g, ' ')

export default function PDFExportButton({ moisLabel, annee, kpi, cultures }: Props) {
  const [loading, setLoading] = useState(false)
  const devise = useParametresCompte()?.deviseCode ?? null
  const fmt = (n: number) => montantPdf(n, devise)

  const handleExport = async () => {
    setLoading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const pageW = doc.internal.pageSize.getWidth()
      const margin = 20

      // ── En-tête ──────────────────────────────────────────────
      doc.setFillColor(10, 22, 40)          // #0A1628
      doc.rect(0, 0, pageW, 40, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('AgroTrack', margin, 16)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(180, 200, 220)
      doc.text('Rapport de la coopérative', margin, 24)
      doc.text(`Période : ${moisLabel} ${annee}`, margin, 31)

      // Date d'export (coin droit)
      doc.setTextColor(140, 160, 180)
      doc.setFontSize(8)
      const dateStr = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
      doc.text(`Généré le ${dateStr}`, pageW - margin, 31, { align: 'right' })

      // ── KPI Cards ─────────────────────────────────────────────
      let y = 52
      doc.setTextColor(30, 40, 60)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Indicateurs clés', margin, y)
      y += 6

      const kpis = [
        { label: 'Membres actifs',     value: kpi.membresActifs.toString(),      color: [0, 188, 212] as [number,number,number] },
        { label: 'Récoltes totales',   value: `${kpi.recoltesTonnes} t`,         color: [212, 175, 55] as [number,number,number] },
        { label: 'Revenus totaux',     value: fmt(kpi.revenusTotal),         color: [16, 185, 129] as [number,number,number] },
        { label: 'Incidents signalés', value: kpi.incidents.toString(),          color: [245, 158, 11] as [number,number,number] },
      ]

      const colW = (pageW - margin * 2 - 9) / 2
      kpis.forEach((k, i) => {
        const cx = margin + (i % 2) * (colW + 9)
        const cy = y + Math.floor(i / 2) * 24

        // Card border
        doc.setDrawColor(...k.color)
        doc.setLineWidth(0.5)
        doc.roundedRect(cx, cy, colW, 19, 3, 3, 'S')

        // Color accent stripe
        doc.setFillColor(...k.color)
        doc.roundedRect(cx, cy, 3, 19, 1.5, 1.5, 'F')

        doc.setTextColor(100, 120, 140)
        doc.setFontSize(7.5)
        doc.setFont('helvetica', 'normal')
        doc.text(k.label.toUpperCase(), cx + 7, cy + 7)

        doc.setTextColor(20, 30, 50)
        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.text(k.value, cx + 7, cy + 14)
      })

      y += 54

      // ── Séparateur ────────────────────────────────────────────
      doc.setDrawColor(220, 230, 245)
      doc.setLineWidth(0.4)
      doc.line(margin, y, pageW - margin, y)
      y += 10

      // ── Cultures / bilan ──────────────────────────────────────
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(30, 40, 60)
      doc.text('Bilan cultures principales', margin, y)
      y += 8

      // Table header
      doc.setFillColor(10, 22, 40)
      doc.rect(margin, y, pageW - margin * 2, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      const cols = [margin + 2, margin + 38, margin + 70, margin + 105, margin + 140]
      const headers = ['Culture', 'Surface (ha)', 'Production (kg)', 'Prix moy./kg', 'Revenus']
      headers.forEach((h, i) => doc.text(h, cols[i], y + 5.5))
      y += 10

      cultures.forEach((row, idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(245, 248, 252)
          doc.rect(margin, y - 1, pageW - margin * 2, 8, 'F')
        }
        doc.setTextColor(40, 60, 80)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        doc.text(libelleCulture(row.culture), cols[0], y + 5)
        doc.text(row.surface.toString(), cols[1], y + 5)
        doc.text(nombrePdf(row.production), cols[2], y + 5)
        doc.text(fmt(row.prixMoyenKg), cols[3], y + 5)
        doc.text(fmt(row.revenus), cols[4], y + 5)
        y += 9
      })

      y += 8

      // ── Footer ────────────────────────────────────────────────
      doc.setDrawColor(220, 230, 245)
      doc.line(margin, y, pageW - margin, y)
      y += 6
      doc.setFontSize(7.5)
      doc.setTextColor(150, 165, 185)
      doc.setFont('helvetica', 'italic')
      doc.text(
        'Ce rapport a été généré automatiquement par AgroTrack. Les données sont à titre indicatif.',
        margin, y
      )

      doc.save(`rapport-agrotrack-${annee}-${moisLabel.toLowerCase()}.pdf`)
    } catch (err) {
      console.error('Erreur export PDF:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 print:hidden"
      style={{ background: '#10b981', color: 'white' }}
    >
      <Download className="w-4 h-4" />
      {loading ? 'Génération…' : 'Télécharger PDF'}
    </button>
  )
}
