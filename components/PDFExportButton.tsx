'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

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
}

const fmtFCFA = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'

export default function PDFExportButton({ moisLabel, annee, kpi }: Props) {
  const [loading, setLoading] = useState(false)

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
      doc.text('AgroTrack BF', margin, 16)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(180, 200, 220)
      doc.text('Rapport Coopérative — Koudougou, Burkina Faso', margin, 24)
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
        { label: 'Revenus totaux',     value: fmtFCFA(kpi.revenusTotal),         color: [16, 185, 129] as [number,number,number] },
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

      const CULTURES = [
        { culture: 'Mil',      surface: 42, production: 18900, revenus: 5103000  },
        { culture: 'Sorgho',   surface: 35, production: 15750, revenus: 4252500  },
        { culture: 'Maïs',     surface: 28, production: 16800, revenus: 5544000  },
        { culture: 'Arachide', surface: 18, production:  7200, revenus: 5184000  },
        { culture: 'Sésame',   surface:  9, production:  1350, revenus: 2835000  },
      ]

      // Table header
      doc.setFillColor(10, 22, 40)
      doc.rect(margin, y, pageW - margin * 2, 8, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      const cols = [margin + 2, margin + 38, margin + 70, margin + 105, margin + 140]
      const headers = ['Culture', 'Surface (ha)', 'Production (kg)', 'Prix moy. FCFA/kg', 'Revenus FCFA']
      headers.forEach((h, i) => doc.text(h, cols[i], y + 5.5))
      y += 10

      CULTURES.forEach((row, idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(245, 248, 252)
          doc.rect(margin, y - 1, pageW - margin * 2, 8, 'F')
        }
        doc.setTextColor(40, 60, 80)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8.5)
        const prixMoy = Math.round(row.revenus / row.production)
        doc.text(row.culture, cols[0], y + 5)
        doc.text(row.surface.toString(), cols[1], y + 5)
        doc.text(new Intl.NumberFormat('fr-FR').format(row.production), cols[2], y + 5)
        doc.text(new Intl.NumberFormat('fr-FR').format(prixMoy), cols[3], y + 5)
        doc.text(new Intl.NumberFormat('fr-FR').format(row.revenus), cols[4], y + 5)
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
        'Ce rapport a été généré automatiquement par AgroTrack BF. Les données sont à titre indicatif.',
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
