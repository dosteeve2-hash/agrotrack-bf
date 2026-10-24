const CONTACT_HREF = 'mailto:docompaore2@gmail.com?subject=AgroTrack%20-%20Coop%C3%A9rative%20pilote'

export const metadata = {
  title: 'Fonctionnement | AgroTrack',
  description: 'Où en est AgroTrack et comment préparer un échange autour d’un pilote.',
}

export default function FonctionnementPage() {
  return (
    <main className="atlas-main" id="contenu">
      <header className="atlas-page-hero">
        <p className="atlas-eyebrow">Où en est le produit</p>
        <h1>Un outil de terrain, en cours de construction.</h1>
        <p>
          AgroTrack travaille à réunir le suivi des membres, des parcelles et des collectes dans un même espace pour les coopératives agricoles.
        </p>
      </header>

      <div className="atlas-page-content">
        <section className="atlas-copy-section">
          <p className="atlas-eyebrow">Statut actuel</p>
          <h2>Le service n’est pas ouvert en production.</h2>
          <p>
            Le tableau de bord est fermé. Les aperçus du site sont des schémas de présentation, pas des captures de l’application. Ils ne montrent aucune donnée réelle, aucun membre et aucune coopérative cliente.
          </p>
        </section>

        <section className="atlas-copy-section">
          <p className="atlas-eyebrow">Les repères en développement</p>
          <h2>Trois ensembles d’informations à relier.</h2>
          <p>
            Le produit se construit autour du registre des membres, du suivi des parcelles et de l’enregistrement des collectes. La prise en compte des connexions irrégulières fait partie des besoins de conception ; elle n’est pas présentée ici comme une capacité disponible en production.
          </p>
        </section>

        <section className="atlas-copy-section">
          <p className="atlas-eyebrow">Échanger autour d’un pilote</p>
          <h2>La première étape est une conversation, pas une inscription.</h2>
          <p>
            Un échange sert à comprendre votre organisation, votre saison et les outils que vous utilisez déjà. Si le projet et le calendrier correspondent, le périmètre d’un pilote pourra ensuite être discuté. Aucun accès au tableau de bord n’est ouvert par ce formulaire de contact.
          </p>
          <div className="atlas-pilot-steps">
            <article className="atlas-pilot-step">
              <span>Échange</span>
              <h3>Présenter le contexte</h3>
              <p>Décrire la coopérative et la façon dont les informations sont suivies aujourd’hui.</p>
            </article>
            <article className="atlas-pilot-step">
              <span>Cadrage</span>
              <h3>Identifier les priorités</h3>
              <p>Préciser les besoins et les conditions nécessaires à un essai sur le terrain.</p>
            </article>
            <article className="atlas-pilot-step">
              <span>Suite à définir</span>
              <h3>Décider ensemble</h3>
              <p>Le périmètre et le calendrier d’un éventuel pilote restent à convenir.</p>
            </article>
          </div>
          <a className="atlas-button" href={CONTACT_HREF}>
            Devenir coopérative pilote
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
