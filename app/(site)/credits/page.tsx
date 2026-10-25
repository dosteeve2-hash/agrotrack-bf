import type { Metadata } from 'next'
import Image from 'next/image'
import photoCredits from '@/lib/credits-photos.json'

export const metadata: Metadata = {
  title: 'Crédits photos | AgroTrack',
  description: 'Auteurs, licences, sources et modifications des photographies utilisées sur AgroTrack.',
}

export default function CreditsPage() {
  return (
    <main className="atlas-main" id="contenu">
      <header className="atlas-page-hero">
        <p className="atlas-eyebrow">Sources et licences</p>
        <h1>Crédits des photographies.</h1>
        <p>
          Les photos présentes sur le site sont des images d’illustration issues de Commons. Elles ne représentent pas des clients ou des utilisateurs d’AgroTrack.
        </p>
      </header>

      <div className="atlas-page-content">
        <section aria-label="Photographies utilisées">
          <p className="atlas-eyebrow">Photographies utilisées sur le site</p>
          <ul className="atlas-credits-list">
            {photoCredits.map((photo) => (
              <li key={photo.slug} className="atlas-credit-item">
                <Image
                  className="atlas-credit-image"
                  src={photo.fichier}
                  alt=""
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 760px) 96px, 160px"
                  loading="lazy"
                />
                <div>
                  <h2>{photo.titre}</h2>
                  <p>Auteur : {photo.auteur}</p>
                  <p>
                    Licence : <a href={photo.licenceUrl} target="_blank" rel="noreferrer">{photo.licence}</a>
                  </p>
                  <p>
                    Source : <a href={photo.source} target="_blank" rel="noreferrer">Wikimedia Commons</a>
                  </p>
                  <p>Modifications : {photo.modifications}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
