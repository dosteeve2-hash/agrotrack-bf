/**
 * Page Météo : reportée. Elle n'affiche aucune donnée inventée, aucun lieu
 * imposé, et dit clairement que la météo locale arrive.
 */
import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import MeteoPage from '../app/(dashboard)/meteo/page'
import { enregistrerParametres } from '../lib/compte/parametres'

beforeEach(() => window.localStorage.clear())
afterEach(cleanup)

describe('MeteoPage', () => {
  it('affiche le titre et le sous-titre', () => {
    render(<MeteoPage />)
    expect(screen.getByText('Météo Agricole')).toBeInTheDocument()
    expect(screen.getByText('Prévisions et alertes pour vos parcelles')).toBeInTheDocument()
  })

  it('annonce que la météo locale arrive, sans aucune donnée', () => {
    render(<MeteoPage />)
    expect(screen.getByText('Météo locale : bientôt disponible (à venir)')).toBeInTheDocument()
    expect(screen.queryByText(/°C/)).not.toBeInTheDocument()
    expect(screen.queryByText(/mm$/)).not.toBeInTheDocument()
  })

  it('n’impose aucune région', () => {
    const { container } = render(<MeteoPage />)
    expect(container.textContent).not.toMatch(/Hauts-Bassins|Ouagadougou|Burkina|Sahel/)
  })

  it('propose d’ouvrir les paramètres du compte pour renseigner le lieu', () => {
    render(<MeteoPage />)
    const lien = screen.getByRole('link', { name: /paramètres du compte/i })
    expect(lien).toHaveAttribute('href', '/parametres')
  })

  it('avec des coordonnées enregistrées, le texte le reconnaît', () => {
    enregistrerParametres({ paysCode: 'FR', deviseCode: 'EUR', latitude: 10, longitude: 10 })
    render(<MeteoPage />)
    expect(screen.getByText(/coordonnées sont enregistrées/i)).toBeInTheDocument()
  })
})
