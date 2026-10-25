'use client'

import { useRef, useSyncExternalStore } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const subscribeToMotionPreference = (onChange: () => void) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

const getMotionPreference = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const getServerMotionPreference = () => false

export default function MapExperience() {
  const sceneRef = useRef<HTMLElement>(null)
  const reduceMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference,
  )
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start start', 'end end'],
  })
  const drawNorth = useTransform(scrollYProgress, [0.01, 0.62], [1, 0])
  const drawEast = useTransform(scrollYProgress, [0.11, 0.7], [1, 0])
  const drawSouth = useTransform(scrollYProgress, [0.2, 0.76], [1, 0])
  const drawWest = useTransform(scrollYProgress, [0.28, 0.81], [1, 0])
  const drawRoad = useTransform(scrollYProgress, [0.06, 0.72], [1, 0])
  const zoom = useTransform(scrollYProgress, [0, 0.82], [0.97, 1.055])
  const pinNorth = useTransform(scrollYProgress, [0.32, 0.47], [0, 1])
  const pinSouth = useTransform(scrollYProgress, [0.42, 0.57], [0, 1])
  const copyOpacity = useTransform(scrollYProgress, [0.35, 0.78], [1, 0.2])

  return (
    <section
      ref={sceneRef}
      className="atlas-scroll-scene"
      aria-labelledby="titre-accueil"
      data-reduced-motion={reduceMotion}
    >
      <div className="atlas-sticky-frame">
        <svg className="atlas-contours" viewBox="0 0 1500 850" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-100 180C140 85 230 250 420 183S680 84 830 180s300 147 435 20 205-82 310-52" />
          <path d="M-100 205C135 112 238 276 425 211S681 111 825 202s300 151 435 26 210-82 315-52" />
          <path d="M-100 232C133 140 244 300 432 237S684 139 820 225s298 156 437 34 212-80 315-52" />
          <path d="M-100 575C85 480 215 574 332 674s243 71 350-5 210-207 361-123 237 160 410 80 232-73 370 4" />
          <path d="M-100 605C80 510 212 604 328 704s246 71 356-4 210-207 361-121 238 158 408 80 232-73 370 4" />
          <path d="M-100 635C75 540 209 632 324 734s249 72 361-2 210-207 362-119 238 158 406 80 235-73 370 4" />
          <path d="M1050-70c-30 136 35 198 151 195s171-82 271-21 58 183-30 231-57 169 65 189 175 91 146 203" />
          <path d="M1082-70c-30 136 35 198 151 195s171-82 271-21 58 183-30 231-57 169 65 189 175 91 146 203" />
          <path d="M1114-70c-30 136 35 198 151 195s171-82 271-21 58 183-30 231-57 169 65 189 175 91 146 203" />
        </svg>

        <div className="atlas-hero-grid">
          <motion.div
            className="atlas-hero-copy"
            style={{ opacity: reduceMotion ? 1 : copyOpacity }}
          >
            <p className="atlas-eyebrow">Cartographier pour mieux suivre</p>
            <h1 className="atlas-hero-title" id="titre-accueil">
              Toutes vos parcelles,
              <span>sur une seule carte.</span>
            </h1>
            <p className="atlas-hero-description">
              AgroTrack prépare un espace de suivi des parcelles, des membres et des collectes, pensé pour le travail des coopératives.
            </p>
            <p className="atlas-hero-status">
              Produit en développement. Le tableau de bord est fermé en production.
            </p>
            <a
              className="atlas-button"
              href="mailto:docompaore2@gmail.com?subject=AgroTrack%20-%20Coop%C3%A9rative%20pilote"
            >
              Devenir coopérative pilote
              <span className="atlas-button-arrow" aria-hidden="true">
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
                  <path d="M3.5 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </motion.div>

          <div className="atlas-map-card">
            <div className="atlas-map-head">
              <span>Plan parcellaire</span>
              <span className="atlas-map-flag">Aperçu générique</span>
            </div>
            <motion.div className="atlas-map-visual" style={{ scale: reduceMotion ? 1 : zoom }}>
              <svg className="atlas-map-svg" viewBox="0 0 900 640" role="img" aria-labelledby="atlas-map-title atlas-map-description">
                <title id="atlas-map-title">Carte vectorielle schématique de parcelles</title>
                <desc id="atlas-map-description">Aperçu de démonstration composé de polygones génériques. Il ne représente aucune parcelle ni donnée réelle.</desc>
                <defs>
                  <pattern id="atlas-map-grain" width="18" height="18" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="3" r="0.6" fill="#7d806f" opacity=".16" />
                    <circle cx="13" cy="12" r="0.5" fill="#7d806f" opacity=".12" />
                  </pattern>
                </defs>
                <rect width="900" height="640" fill="#f0eddf" />
                <rect width="900" height="640" fill="url(#atlas-map-grain)" />
                <g fill="none" stroke="#bdb9ab" strokeWidth="1" opacity=".58">
                  <path d="M-25 150c90-64 176-58 263-1s166 74 250 24 146-47 217-4 132 76 223 17" />
                  <path d="M-25 169c90-64 176-58 263-1s166 74 250 24 146-47 217-4 132 76 223 17" />
                  <path d="M-25 188c90-64 176-58 263-1s166 74 250 24 146-47 217-4 132 76 223 17" />
                  <path d="M-20 495c90-63 177-56 262 3s166 75 251 25 146-46 217-2 132 78 222 20" />
                  <path d="M-20 514c90-63 177-56 262 3s166 75 251 25 146-46 217-2 132 78 222 20" />
                  <path d="M-20 533c90-63 177-56 262 3s166 75 251 25 146-46 217-2 132 78 222 20" />
                </g>
                <g fill="#e7e3d6" stroke="#9a9b8c" strokeWidth="1.4">
                  <path d="m152 214 150-37 92 62-36 113-161 17-70-63 25-92Z" />
                  <path d="m394 235 128-25 92 48-14 119-151 34-91-59 36-117Z" />
                  <path d="m208 380 154-18 88 57-34 104-160 19-78-67 30-95Z" />
                  <path d="m474 397 139-26 99 52-25 101-147 23-83-55 17-95Z" />
                </g>
                <g fill="none" stroke="#b7b3a6" strokeWidth="1" opacity=".72">
                  <path d="m178 237 102-25 66 43-22 80-112 11-52-45 18-64Z" />
                  <path d="m415 257 92-18 68 38-10 82-107 24-66-44 23-82Z" />
                  <path d="m231 403 107-13 65 41-24 72-111 13-57-49 20-64Z" />
                  <path d="m493 418 98-18 73 39-17 70-107 17-61-40 14-68Z" />
                </g>
                <motion.path
                  d="m152 214 150-37 92 62-36 113-161 17-70-63 25-92Z"
                  pathLength={1}
                  strokeDasharray="1"
                  style={{ strokeDashoffset: reduceMotion ? 0 : drawNorth }}
                  fill="none"
                  stroke="#687267"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <motion.path
                  d="m394 235 128-25 92 48-14 119-151 34-91-59 36-117Z"
                  pathLength={1}
                  strokeDasharray="1"
                  style={{ strokeDashoffset: reduceMotion ? 0 : drawEast }}
                  fill="none"
                  stroke="#687267"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <motion.path
                  d="m208 380 154-18 88 57-34 104-160 19-78-67 30-95Z"
                  pathLength={1}
                  strokeDasharray="1"
                  style={{ strokeDashoffset: reduceMotion ? 0 : drawSouth }}
                  fill="none"
                  stroke="#687267"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <motion.path
                  d="m474 397 139-26 99 52-25 101-147 23-83-55 17-95Z"
                  pathLength={1}
                  strokeDasharray="1"
                  style={{ strokeDashoffset: reduceMotion ? 0 : drawWest }}
                  fill="none"
                  stroke="#687267"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <motion.path
                  d="M105 430c92-109 157-123 242-102s130 10 197-41 132-54 233-9"
                  pathLength={1}
                  strokeDasharray="1"
                  style={{ strokeDashoffset: reduceMotion ? 0 : drawRoad }}
                  fill="none"
                  stroke="#a79f8e"
                  strokeWidth="2"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  opacity=".88"
                />
                <g className="atlas-map-label">
                  <text x="217" y="277">PARCELLE A</text>
                  <text x="439" y="304">PARCELLE B</text>
                  <text x="257" y="444">PARCELLE C</text>
                  <text x="512" y="458">PARCELLE D</text>
                  <text className="atlas-map-small-label" x="66" y="102">NORD</text>
                  <text className="atlas-map-small-label" x="777" y="552">SUD</text>
                </g>
                <motion.g style={{ opacity: reduceMotion ? 1 : pinNorth, scale: reduceMotion ? 1 : pinNorth }}>
                  <circle cx="302" cy="178" r="13" fill="#a9431e" opacity=".13" />
                  <circle cx="302" cy="178" r="5.5" fill="#a9431e" />
                  <circle cx="302" cy="178" r="2" fill="#fffaf1" />
                </motion.g>
                <motion.g style={{ opacity: reduceMotion ? 1 : pinSouth, scale: reduceMotion ? 1 : pinSouth }}>
                  <circle cx="610" cy="382" r="13" fill="#a9431e" opacity=".13" />
                  <circle cx="610" cy="382" r="5.5" fill="#a9431e" />
                  <circle cx="610" cy="382" r="2" fill="#fffaf1" />
                </motion.g>
                <g fill="none" stroke="#636d62" strokeWidth="1.3" opacity=".76">
                  <path d="M803 86v34m-7-27 7-7 7 7" />
                </g>
                <text x="800" y="135" className="atlas-map-label atlas-map-small-label">N</text>
              </svg>
            </motion.div>
            <div className="atlas-map-foot">
              <span className="atlas-mono">Repères illustratifs</span>
              <span>Tracés génériques · aucune donnée réelle</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
