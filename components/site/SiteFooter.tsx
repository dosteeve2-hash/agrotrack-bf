import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="atlas-footer">
      <div className="atlas-footer-inner">
        <p className="atlas-footer-note">
          AgroTrack · un outil en développement pour les coopératives agricoles.
        </p>
        <nav className="atlas-footer-nav" aria-label="Navigation de pied de page">
          <Link href="/fonctionnement">Fonctionnement</Link>
          <Link href="/tarifs">Tarifs</Link>
          <Link href="/credits">Crédits photos</Link>
          <a href="mailto:docompaore2@gmail.com">docompaore2@gmail.com</a>
        </nav>
      </div>
    </footer>
  )
}
