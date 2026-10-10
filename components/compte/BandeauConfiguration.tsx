'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe2 } from 'lucide-react'
import { useParametresCompte } from '@/lib/compte/useParametresCompte'

/** Rappelle de choisir pays et devise tant que le compte n'est pas configuré. */
export default function BandeauConfiguration() {
  const compte = useParametresCompte()
  const pathname = usePathname()
  if (compte || pathname === '/onboarding') return null
  return (
    <div role="status" className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm"
      style={{ background: '#fffbeb', borderBottom: '1px solid #fcd34d', color: '#78350f' }}>
      <Globe2 className="w-4 h-4 flex-shrink-0" />
      <span>Choisissez votre pays et votre devise pour que les montants s’affichent correctement.</span>
      <Link href="/onboarding" className="font-semibold underline ml-auto">Configurer mon compte</Link>
    </div>
  )
}
