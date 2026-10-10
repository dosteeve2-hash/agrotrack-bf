'use client'

import { Cloud } from 'lucide-react'
import EtatVide from '@/components/EtatVide'
import { useParametresCompte } from '@/lib/compte/useParametresCompte'
import { coordonneesDuCompte, MESSAGE_METEO_A_VENIR } from '@/lib/compte/meteo'

/**
 * La météo détaillée (prévisions, historique, alertes par culture) est reportée.
 * Cet écran n'affiche donc aucune donnée : l'ancienne maquette montrait des
 * prévisions et des relevés inventés pour une région précise, ce qui est faux
 * pour tout autre pays. Les coordonnées viennent des paramètres du compte.
 */
export default function MeteoPage() {
  const coords = coordonneesDuCompte(useParametresCompte())

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Météo Agricole</h1>
        <p className="text-gray-600 text-sm mt-0.5">Prévisions et alertes pour vos parcelles</p>
      </div>

      <EtatVide
        icone={<Cloud size={36} />}
        titre={MESSAGE_METEO_A_VENIR}
        texte={coords
          ? 'Vos coordonnées sont enregistrées dans les paramètres du compte. Les prévisions et l’historique de ce lieu s’afficheront ici.'
          : 'Renseignez les coordonnées de votre exploitation dans les paramètres du compte : elles serviront à afficher la météo de votre lieu, et d’aucun autre.'}
        action={{ libelle: 'Ouvrir les paramètres du compte', href: '/parametres' }}
      />
    </div>
  )
}
