// app/(dashboard)/membres/MembreModal.tsx
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FormState } from './membres.data'
import ChampListeLibre from '@/components/compte/ChampListeLibre'
import { CULTURES_SUGGEREES } from '@/lib/cultures'

interface Props {
  open: boolean
  form: FormState
  erreur?: string | null
  enCours?: boolean
  onClose: () => void
  onChange: (patch: Partial<FormState>) => void
  onSubmit: () => void
}

export function MembreModal({ open, form, erreur, enCours, onClose, onChange, onSubmit }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(10,22,40,0.6)' }}
          onClick={e => { if (e.target === e.currentTarget) onClose() }}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Nouveau membre</h2>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom complet *</label>
                <input type="text" value={form.nom}
                  onChange={e => onChange({ nom: e.target.value })}
                  placeholder="Prénom et nom"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Téléphone</label>
                <input type="tel" value={form.telephone}
                  onChange={e => onChange({ telephone: e.target.value })}
                  placeholder="Numéro, avec l’indicatif si besoin"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Village ou localité *</label>
                <input type="text" value={form.village}
                  onChange={e => onChange({ village: e.target.value })}
                  placeholder="Village, quartier ou localité"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
              </div>
              <ChampListeLibre label="Culture principale *" valeur={form.culture}
                onChange={culture => onChange({ culture })}
                suggestions={CULTURES_SUGGEREES} placeholderVide="Choisir une culture"
                labelClassName="block text-xs font-medium text-gray-600 mb-1"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Surface (ha)</label>
                <input type="number" step="0.1" min="0" value={form.surface}
                  onChange={e => onChange({ surface: e.target.value })}
                  placeholder="2.5"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
              </div>
              {erreur && (
                <p role="alert" className="text-sm rounded-lg px-3 py-2"
                  style={{ background: '#fef2f2', color: '#b91c1c' }}>{erreur}</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onClose}
                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button onClick={onSubmit} disabled={!form.nom.trim() || !form.village.trim() || !form.culture.trim() || enCours}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: '#D4AF37', color: '#0A1628' }}>
                {enCours ? 'Enregistrement…' : 'Ajouter'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
