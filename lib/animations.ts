// ─── FORGE Afrika — Shared Animation System ───────────────────────────────────
// Framer Motion variants réutilisables dans tous les projets FORGE Afrika
import type { MotionProps, Variants } from "framer-motion";

// ── Variants pour usage avec variants= prop ──────────────────────────────────

export const fadeInUpVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } },
};

export const slideInLeftVariants: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
};

export const scaleInVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

// ── Props spread-ready ───────────────────────────────────────────────────────

export const fadeInUp: Partial<MotionProps> = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export const fadeIn: Partial<MotionProps> = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 },
};

export const slideInLeft: Partial<MotionProps> = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export const scaleIn: Partial<MotionProps> = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4 },
};

export const hoverScale: Partial<MotionProps> = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

// ── Scroll-reveal (whileInView) ──────────────────────────────────────────────

export const scrollFadeUp: Partial<MotionProps> = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export const scrollFadeIn: Partial<MotionProps> = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export const scrollStaggerItem: Partial<MotionProps> = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export const scrollStaggerContainer: Partial<MotionProps> = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.3, staggerChildren: 0.12 } as MotionProps["transition"],
};
