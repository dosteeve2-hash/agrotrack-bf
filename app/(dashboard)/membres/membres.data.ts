// app/(dashboard)/membres/membres.data.ts
//
// Constantes de presentation uniquement. Les membres viennent desormais de la
// base : `lib/data/membres.ts`. Les douze producteurs qui vivaient ici en dur
// sous le nom `MEMBRES_INIT` sont devenus des lignes, dans `supabase/seed.sql`.

export interface FormState {
  nom: string
  telephone: string
  village: string
  culture: string
  surface: string
}

export const AVATAR_COLORS = ['#00BCD4', '#D4AF37', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#0A1628']

export const DEFAULT_FORM: FormState = {
  nom: '', telephone: '', village: '', culture: '', surface: '',
}

export function initiales(nom: string): string {
  return nom.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}
