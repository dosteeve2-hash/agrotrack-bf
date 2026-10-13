'use client'

import { usePathname } from 'next/navigation'
import { Info } from 'lucide-react'

const EXAMPLE_ROUTES = [
  '/collectes', '/cultures', '/equipements', '/finances', '/intrants',
  '/paiements', '/rapports', '/statistiques', '/stocks',
]

export default function ExampleDataBanner({ isDemoAccount }: { isDemoAccount: boolean }) {
  const pathname = usePathname()
  const hasExampleData = isDemoAccount || EXAMPLE_ROUTES.some((route) => pathname.startsWith(route))
  if (!hasExampleData) return null

  return (
    <div
      role="note"
      className="mx-4 mt-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-slate-700 md:mx-6"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <span>
        <strong className="text-slate-900">Données d&apos;exemple.</strong> Les membres, parcelles,
        pesées, paiements et montants affichés ici sont fictifs et servent à illustrer
        l&apos;application. Ils ne proviennent d&apos;aucune coopérative réelle.
      </span>
    </div>
  )
}
