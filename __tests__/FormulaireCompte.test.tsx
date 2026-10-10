/**
 * Choix du pays à l'onboarding : liste complète, recherche, devise proposée
 * (et modifiable), enregistrement local, coordonnées jamais à moitié.
 */
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import FormulaireCompte from '../components/compte/FormulaireCompte'
import { analyserParametres, lireBrut } from '../lib/compte/parametres'

beforeEach(() => window.localStorage.clear())
afterEach(cleanup)

const liste = () => screen.getByRole('listbox', { name: /Pays/ }) as HTMLSelectElement
const devise = () => screen.getByLabelText(/Devise du compte/) as HTMLSelectElement

describe('FormulaireCompte', () => {
  it('propose tous les pays, sans en privilégier un', () => {
    render(<FormulaireCompte />)
    expect(liste().options.length).toBeGreaterThan(240)
    expect(screen.queryByText(/Pays choisi/)).not.toBeInTheDocument()
  })

  it('la recherche filtre la liste sans tenir compte des accents', () => {
    render(<FormulaireCompte />)
    fireEvent.change(screen.getByLabelText('Rechercher votre pays'), { target: { value: 'turq' } })
    const noms = Array.from(liste().options).map(o => o.text)
    expect(noms).toContain('Turquie')
    expect(noms.length).toBeLessThan(5)
  })

  it('choisir un pays propose sa devise, que l’on peut changer', () => {
    render(<FormulaireCompte />)
    fireEvent.change(liste(), { target: { value: 'GH' } })
    expect(devise().value).toBe('GHS')
    fireEvent.change(devise(), { target: { value: 'USD' } })
    expect(devise().value).toBe('USD')
  })

  it('enregistre pays, devise et coordonnées sur l’appareil', () => {
    render(<FormulaireCompte />)
    fireEvent.change(liste(), { target: { value: 'FR' } })
    fireEvent.change(screen.getByLabelText('Latitude'), { target: { value: '10,5' } })
    fireEvent.change(screen.getByLabelText('Longitude'), { target: { value: '-3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    expect(analyserParametres(lireBrut())).toEqual({ paysCode: 'FR', deviseCode: 'EUR', latitude: 10.5, longitude: -3 })
    expect(screen.getByText(/enregistrés sur cet appareil/)).toBeInTheDocument()
  })

  it('les coordonnées sont facultatives', () => {
    render(<FormulaireCompte />)
    fireEvent.change(liste(), { target: { value: 'BF' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    expect(analyserParametres(lireBrut())).toEqual({ paysCode: 'BF', deviseCode: 'XOF', latitude: null, longitude: null })
  })

  it('refuse une latitude sans longitude et n’écrit rien', () => {
    render(<FormulaireCompte />)
    fireEvent.change(liste(), { target: { value: 'FR' } })
    fireEvent.change(screen.getByLabelText('Latitude'), { target: { value: '10' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    expect(screen.getByText(/Coordonnées invalides/)).toBeInTheDocument()
    expect(lireBrut()).toBeNull()
  })

  it('refuse l’enregistrement sans pays', () => {
    render(<FormulaireCompte />)
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))
    expect(screen.getByText('Choisissez un pays et une devise.')).toBeInTheDocument()
  })
})
