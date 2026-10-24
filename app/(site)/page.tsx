import Link from 'next/link'
import Image from 'next/image'
import MapExperience from '@/components/site/MapExperience'
import PhotoRibbon from '@/components/site/PhotoRibbon'
import Reveal from '@/components/site/Reveal'

const CONTACT_HREF = 'mailto:docompaore2@gmail.com?subject=AgroTrack%20-%20Coop%C3%A9rative%20pilote'

function ModulePreview({
  title,
  label,
  children,
  description,
}: {
  title: string
  label: string
  children: React.ReactNode
  description: string
}) {
  return (
    <article className="atlas-preview-card">
      <div className="atlas-preview-head">
        <h3>{title}</h3>
        <span className="atlas-preview-label">{label}</span>
      </div>
      <div className="atlas-preview-body">{children}</div>
      <p className="atlas-preview-caption">{description}</p>
    </article>
  )
}

export default function HomePage() {
  return (
    <main className="atlas-main" id="contenu">
      <MapExperience />

      <section className="atlas-section" aria-labelledby="terrain-titre">
        <Reveal className="atlas-field-note">
          <div className="atlas-field-note-copy">
            <p className="atlas-eyebrow">Du terrain au registre</p>
            <h2 id="terrain-titre">Une parcelle est un lieu, une saison et une histoire.</h2>
            <p>
              AgroTrack est pensé pour rapprocher les repères de terrain et le suivi de la coopérative. Le produit est encore en développement : cette page présente une direction et des aperçus, pas un service ouvert.
            </p>
            <p className="atlas-field-annotation">
              Les images illustrent le travail agricole. Elles ne montrent pas des coopératives clientes d’AgroTrack.
            </p>
          </div>
          <div>
            <div className="atlas-eyebrow">Des paysages, pas des chiffres inventés</div>
            <PhotoRibbon />
            <p className="atlas-photo-credit-note">
              Photographies d’illustration · <Link className="atlas-text-link" href="/credits">voir les crédits</Link>
            </p>
          </div>
        </Reveal>
      </section>

      <section className="atlas-section atlas-section-alt" id="modules" aria-labelledby="modules-titre">
        <div className="atlas-section-heading">
          <Reveal>
            <p className="atlas-eyebrow">Les outils en préparation</p>
            <h2 className="atlas-section-title" id="modules-titre">
              Les informations d’une coopérative, reliées entre elles.
            </h2>
          </Reveal>
          <Reveal>
            <p className="atlas-section-intro">
              Membres, parcelles et collectes sont les trois repères de l’outil. Les vues ci-dessous sont des aperçus schématiques, sans données réelles et sans accès au tableau de bord.
            </p>
          </Reveal>
        </div>

        <div className="atlas-preview-grid">
          <Reveal>
            <ModulePreview
              title="Membres"
              label="Aperçu"
              description="Structure indicative d’un registre. Aucun profil réel n’est affiché."
            >
              <div className="atlas-preview-table-head" aria-hidden="true">
                <span>Membre</span><span>Contact</span><span>Culture</span>
              </div>
              <div className="atlas-preview-row" aria-hidden="true">
                <span className="atlas-preview-line" /><span className="atlas-preview-line" /><span className="atlas-preview-line" />
              </div>
              <div className="atlas-preview-row" aria-hidden="true">
                <span className="atlas-preview-line" /><span className="atlas-preview-line" /><span className="atlas-preview-line" />
              </div>
              <div className="atlas-preview-row" aria-hidden="true">
                <span className="atlas-preview-line" /><span className="atlas-preview-line" /><span className="atlas-preview-line" />
              </div>
            </ModulePreview>
          </Reveal>

          <Reveal>
            <ModulePreview
              title="Parcelles"
              label="Aperçu"
              description="Formes génériques dessinées pour illustrer une vue parcellaire."
            >
              <div className="atlas-preview-map" aria-label="Schéma générique de parcelles">
                <svg className="atlas-preview-polygons" viewBox="0 0 220 130" fill="none" aria-hidden="true">
                  <path d="m24 26 59-12 31 24-13 36-61 7-25-23 9-32Z" fill="#e6e1d3" stroke="#747a6e" />
                  <path d="m123 39 48-11 26 21-8 37-55 12-32-23 21-36Z" fill="#ebe7dc" stroke="#747a6e" />
                  <path d="m39 87 58-6 31 23-14 21-61-1-22-19 8-18Z" fill="#e9e4d7" stroke="#747a6e" />
                  <circle cx="84" cy="37" r="3.5" fill="#a9431e" />
                  <circle cx="170" cy="86" r="3.5" fill="#a9431e" />
                </svg>
              </div>
            </ModulePreview>
          </Reveal>

          <Reveal>
            <ModulePreview
              title="Collectes"
              label="Aperçu"
              description="Champs de suivi présentés à titre de schéma, pas une capture produit."
            >
              <div className="atlas-preview-fields">
                <div className="atlas-preview-field"><strong>Campagne</strong><span className="atlas-preview-empty" aria-hidden="true" /></div>
                <div className="atlas-preview-field"><strong>Produit</strong><span className="atlas-preview-empty" aria-hidden="true" /></div>
                <div className="atlas-preview-field"><strong>Quantité</strong><span className="atlas-preview-empty" aria-hidden="true" /></div>
                <div className="atlas-preview-field"><strong>Reçu</strong><span className="atlas-preview-empty" aria-hidden="true" /></div>
              </div>
            </ModulePreview>
          </Reveal>
        </div>
      </section>

      <section className="atlas-section" aria-labelledby="conseiller-titre">
        <Reveal className="atlas-coming-card">
          <div className="atlas-coming-visual" aria-hidden="true">
            <Image
              className="atlas-coming-image"
              src="/images/photos/agri-arrosage.webp"
              alt=""
              width={1600}
              height={1200}
              sizes="(max-width: 760px) 100vw, 40vw"
              loading="lazy"
            />
            <span className="atlas-coming-tag">Photo agricole illustrative</span>
            <div className="atlas-coming-audio">
              <div className="atlas-coming-audio-copy">
                <strong>Réponse orale</strong>
                <span>Langue du paysan · à venir</span>
              </div>
              <span className="atlas-coming-wave" aria-hidden="true">
                <i /><i /><i /><i /><i /><i /><i /><i />
              </span>
            </div>
          </div>
          <div className="atlas-coming-copy">
            <span className="atlas-coming-pill">À venir</span>
            <h2 id="conseiller-titre">Conseiller de terrain</h2>
            <p>
              L’idée : partager une photo d’une plante et recevoir une réponse orale dans la langue de la personne au champ. Cette fonctionnalité est à venir ; aucune analyse de plante ni voix n’est disponible aujourd’hui.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="atlas-section atlas-section-alt" aria-labelledby="pilote-titre">
        <Reveal className="atlas-pilot-band">
          <div>
            <p className="atlas-eyebrow">Co-construire le terrain</p>
            <h2 id="pilote-titre">Votre coopérative peut aider à définir le bon outil.</h2>
            <p>
              Un échange permet de comprendre votre organisation et vos priorités. Un pilote ne donne pas encore accès au tableau de bord : son périmètre et son calendrier restent à définir.
            </p>
          </div>
          <a className="atlas-button" href={CONTACT_HREF}>
            Devenir coopérative pilote
            <span className="atlas-button-arrow" aria-hidden="true">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </Reveal>
      </section>
    </main>
  )
}
