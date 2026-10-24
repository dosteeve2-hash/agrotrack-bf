const CONTACT_HREF = 'mailto:docompaore2@gmail.com?subject=AgroTrack%20-%20Informations%20sur%20un%20pilote'

export const metadata = {
  title: 'Tarifs | AgroTrack',
  description: 'Les conditions d’un pilote AgroTrack seront discutées avec les coopératives intéressées.',
}

export default function TarifsPage() {
  return (
    <main className="atlas-main" id="contenu">
      <header className="atlas-page-hero">
        <p className="atlas-eyebrow">Tarifs et pilote</p>
        <h1>Un cadre à définir avec les coopératives.</h1>
        <p>
          AgroTrack est encore en développement. Aucun tarif public ni offre commerciale n’est annoncé pour le moment.
        </p>
        <a className="atlas-button" href={CONTACT_HREF}>
          Échanger sur un pilote
          <span className="atlas-button-arrow" aria-hidden="true">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
              <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </header>

      <div className="atlas-page-content">
        <section className="atlas-copy-section">
          <p className="atlas-eyebrow">Ce qui est connu aujourd’hui</p>
          <h2>Le tableau de bord reste fermé en production.</h2>
          <p>
            Cette page ne propose ni abonnement, ni essai en libre-service, ni accès immédiat au produit. Les conditions d’un éventuel pilote seront discutées directement avec les coopératives intéressées, une fois son périmètre défini.
          </p>
        </section>

        <section className="atlas-copy-section">
          <p className="atlas-eyebrow">Une première conversation</p>
          <h2>Parlons d’abord de votre réalité de terrain.</h2>
          <p>
            Vous pouvez nous écrire pour présenter votre coopérative, vos façons de suivre les membres, les parcelles et les collectes, ainsi que les contraintes de connexion. Cet échange ne constitue ni un devis ni un engagement de mise à disposition.
          </p>
          <a className="atlas-button" href={CONTACT_HREF}>
            Nous écrire
            <span className="atlas-button-arrow" aria-hidden="true">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </section>
      </div>
    </main>
  )
}
