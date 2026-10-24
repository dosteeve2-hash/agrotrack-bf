import type { ReactNode } from 'react'
import ScrollToTop from '@/components/ScrollToTop'
import MotionPreferences from '@/components/site/MotionPreferences'
import SiteFooter from '@/components/site/SiteFooter'
import SiteHeader from '@/components/site/SiteHeader'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="atlas-site">
      <a className="atlas-skip-link" href="#contenu">Aller au contenu</a>
      <MotionPreferences>
        <SiteHeader />
        {children}
        <SiteFooter />
        <ScrollToTop />
      </MotionPreferences>
    </div>
  )
}
