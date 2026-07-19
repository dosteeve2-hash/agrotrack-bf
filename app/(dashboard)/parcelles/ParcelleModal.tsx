// app/(dashboard)/parcelles/ParcelleModal.tsx
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FormState, Culture } from './parcelles.data'
import { MEMBRES_LIST, REGIONS_BF } from './parcelles.data'

interface Props {
  open: boolean
  form: FormState
  onClose: () => void
  onChange: (patch: Partial<FormState>) => void
  onSubmit: () => void
}

export function ParcelleModal({ open, form, onClose, onChange, onSubmit }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
              <h2 className="text-lg font-bold text-gray-900">Nouvelle parcelle</h2>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Membre propriétaire *</label>
                <select value={form.membre} onChange={e => onChange({ membre: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
                  {MEMBRES_LIST.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Surface (ha) *</label>
                <input type="number" step="0.1" min="0.1" value={form.surface}
                  onChange={e => onChange({ surface: e.target.value })}
                  placeholder="2.5"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Culture principale</label>
                <select value={form.culture} onChange={e => onChange({ culture: e.target.value as Culture })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
                  {(['Mil', 'Sorgho', 'Maïs', 'Coton'] as Culture[]).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Région (13 régions BF)</label>
                <select value={form.region} onChange={e => onChange({ region: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50">
                  {REGIONS_BF.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Coordonnées GPS (texte libre)</label>
                <input type="text" value={form.gps}
                  onChange={e => onChange({ gps: e.target.value })}
                  placeholder="12.3647° N, 2.3634° O"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onClose}
                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button onClick={onSubmit} disabled={!form.surface || !form.membre}
                className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: '#D4AF37', color: '#0A1628' }}>
                Enregistrer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
