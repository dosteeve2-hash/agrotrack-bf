import Image from 'next/image'

const PHOTOS = [
  {
    src: '/images/photos/agri-arrosage.webp',
    alt: 'Une personne arrose des rangs de jeunes cultures à la main.',
    width: 1600,
    height: 1200,
    label: 'Au rythme des parcelles',
    index: '01',
  },
  {
    src: '/images/photos/agri-donnees.webp',
    alt: 'Des producteurs observent la pesée d’une récolte de sorgho.',
    width: 1600,
    height: 1130,
    label: 'Du champ au registre',
    index: '02',
  },
  {
    src: '/images/photos/industrie-cereales.webp',
    alt: 'Des personnes trient des céréales étalées devant une maison.',
    width: 1600,
    height: 808,
    label: 'Une récolte à suivre',
    index: '03',
  },
]

export default function PhotoRibbon() {
  return (
    <div className="atlas-ribbon">
      {PHOTOS.map((photo) => (
        <figure key={photo.src} className="atlas-ribbon-figure">
          <Image
            className="atlas-ribbon-image"
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 760px) 100vw, 38vw"
            loading="lazy"
          />
          <figcaption className="atlas-ribbon-label">
            <span>{photo.label}</span>
            <span>{photo.index}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
