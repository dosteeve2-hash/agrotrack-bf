'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAVIGATION = [
  { href: '/#modules', label: 'Le produit' },
  { href: '/fonctionnement', label: 'Fonctionnement' },
  { href: '/tarifs', label: 'Tarifs' },
]

function Brand() {
  return (
    <Link className="atlas-brand" href="/" aria-label="AgroTrack, accueil">
      <span className="atlas-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 26 26" width="22" height="22" fill="none">
          <path d="M3.5 5.5 12 3l10.5 4.2-1 12.1-8.8 3.4-9.7-5.1.5-12.1Z" stroke="currentColor" strokeWidth="1.25" />
          <path d="m4 11 8.2-3.3 9.8 3.7M12.2 7.7l.5 15" stroke="currentColor" strokeWidth="1" opacity=".62" />
          <circle cx="18.8" cy="15.2" r="2.1" fill="#a9431e" />
        </svg>
      </span>
      <span className="atlas-brand-name">AgroTrack</span>
    </Link>
  )
}

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="atlas-header">
      <div className="atlas-header-inner">
        <Brand />
        <nav className="atlas-nav" aria-label="Navigation principale">
          {NAVIGATION.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
          <span className="atlas-nav-status">
            <span className="atlas-status-dot" aria-hidden="true" />
            En développement
          </span>
        </nav>
        <div className="atlas-mobile-menu">
          <button
            type="button"
            className="atlas-mobile-trigger"
            aria-expanded={menuOpen}
            aria-controls="navigation-mobile"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Fermer' : 'Menu'}
            <span aria-hidden="true" className={menuOpen ? 'atlas-menu-chevron is-open' : 'atlas-menu-chevron'} />
          </button>
          <nav
            id="navigation-mobile"
            className="atlas-mobile-nav"
            aria-label="Navigation mobile"
            hidden={!menuOpen}
          >
            {NAVIGATION.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <span className="atlas-nav-status">
              <span className="atlas-status-dot" aria-hidden="true" />
              En développement
            </span>
          </nav>
        </div>
      </div>
    </header>
  )
}
