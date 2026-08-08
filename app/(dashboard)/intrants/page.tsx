'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Sprout, FlaskConical, Package, AlertTriangle, Search, Plus, X } from 'lucide-react'
import { toast, Toaster } from 'sonner'

const NAVY = '#0A1628'
const GOLD = '#D4AF37'
const CYAN = '#00D4FF'
const BG2 = '#0c1a34'
const BORDER = 'rgba(255,255,255,0.08)'

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
const fmtN = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

type Categorie = 'Engrais' | 'Semence' | 'Pesticide' | 'Herbicide' | 'Fongicide' | 'Matériel'
type Culture = 'Maïs' | 'Sorgho' | 'Mil' | 'Coton' | 'Niébé' | 'Toutes'
type Unite = 'kg' | 'L' | 'Sac' | 'Bidon' | 'Unité'
type Statut = 'Disponible' | 'Stock faible' | 'Épuisé' | 'Expiré'

interface Intrant {
  id: string; nom: string; categorie: Categorie; culture: Culture; unite: Unite
  prixUnitaire: number; stockDisponible: number; seuilAlerte: number
  fournisseur: string; dateExpiration: string; statut: Statut
}

const DATA: Intrant[] = [
  { id:'1', nom:'Urée 46%', categorie:'Engrais', culture:'Maïs', unite:'kg', prixUnitaire:600, stockDisponible:2500, seuilAlerte:500, fournisseur:'SOFITEX', dateExpiration:'2027-03-15', statut:'Disponible' },
  { id:'2', nom:'NPK 15-15-15', categorie:'Engrais', culture:'Toutes', unite:'kg', prixUnitaire:650, stockDisponible:180, seuilAlerte:200, fournisseur:'SOFITEX', dateExpiration:'2026-12-31', statut:'Stock faible' },
  { id:'3', nom:'DAP', categorie:'Engrais', culture:'Coton', unite:'Sac', prixUnitaire:18000, stockDisponible:45, seuilAlerte:10, fournisseur:'OCP Burkina', dateExpiration:'2027-06-01', statut:'Disponible' },
  { id:'4', nom:'Semences maïs IRAT-200', categorie:'Semence', culture:'Maïs', unite:'kg', prixUnitaire:1200, stockDisponible:0, seuilAlerte:50, fournisseur:'INERA', dateExpiration:'2026-09-01', statut:'Épuisé' },
  { id:'5', nom:'Semences sorgho S35', categorie:'Semence', culture:'Sorgho', unite:'kg', prixUnitaire:900, stockDisponible:320, seuilAlerte:100, fournisseur:'INERA', dateExpiration:'2026-10-15', statut:'Disponible' },
  { id:'6', nom:'Semences niébé KVX', categorie:'Semence', culture:'Niébé', unite:'kg', prixUnitaire:1100, stockDisponible:85, seuilAlerte:100, fournisseur:'INERA', dateExpiration:'2026-08-20', statut:'Stock faible' },
  { id:'7', nom:'Glyphosate 360', categorie:'Herbicide', culture:'Toutes', unite:'L', prixUnitaire:3500, stockDisponible:0, seuilAlerte:20, fournisseur:'Agrimex BF', dateExpiration:'2027-08-30', statut:'Épuisé' },
  { id:'8', nom:'Atrazine 50%', categorie:'Herbicide', culture:'Maïs', unite:'kg', prixUnitaire:2800, stockDisponible:55, seuilAlerte:20, fournisseur:'Agrimex BF', dateExpiration:'2027-05-15', statut:'Disponible' },
  { id:'9', nom:'Lambda-cyhalothrine', categorie:'Pesticide', culture:'Coton', unite:'L', prixUnitaire:12000, stockDisponible:12, seuilAlerte:15, fournisseur:'SunChem', dateExpiration:'2027-02-28', statut:'Stock faible' },
  { id:'10', nom:'Mancozèbe', categorie:'Fongicide', culture:'Toutes', unite:'kg', prixUnitaire:4500, stockDisponible:38, seuilAlerte:20, fournisseur:'Agrimex BF', dateExpiration:'2027-01-10', statut:'Disponible' },
  { id:'11', nom:'Thirame', categorie:'Fongicide', culture:'Niébé', unite:'kg', prixUnitaire:3200, stockDisponible:0, seuilAlerte:10, fournisseur:'SunChem', dateExpiration:'2026-11-20', statut:'Épuisé' },
  { id:'12', nom:'Pulvérisateur 16L', categorie:'Matériel', culture:'Toutes', unite:'Unité', prixUnitaire:25000, stockDisponible:8, seuilAlerte:2, fournisseur:'Agri-Matériel BF', dateExpiration:'2030-01-01', statut:'Disponible' },
  { id:'13', nom:'Semoir manuel', categorie:'Matériel', culture:'Toutes', unite:'Unité', prixUnitaire:15000, stockDisponible:3, seuilAlerte:2, fournisseur:'Agri-Matériel BF', dateExpiration:'2030-01-01', statut:'Disponible' },
  { id:'14', nom:'Binette', categorie:'Matériel', culture:'Toutes', unite:'Unité', prixUnitaire:3500, stockDisponible:22, seuilAlerte:5, fournisseur:'Agri-Matériel BF', dateExpiration:'2030-01-01', statut:'Disponible' },
]

const STATUT_STYLE: Record<Statut, { bg: string; text: string; border: string }> = {
  'Disponible':  { bg: '#052e16', text: '#4ade80', border: '#166534' },
  'Stock faible':{ bg: '#431407', text: '#fb923c', border: '#9a3412' },
  'Épuisé':      { bg: '#450a0a', text: '#f87171', border: '#991b1b' },
  'Expiré':      { bg: '#2e1065', text: '#c084fc', border: '#6b21a8' },
}

function Badge({ s }: { s: Statut }) {
  const c = STATUT_STYLE[s]
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {s}
    </span>
  )
}

function expiresSoon(d: string) {
  const diff = (new Date(d).getTime() - Date.now()) / 86400000
  return diff > 0 && diff < 30
}

const EMPTY_FORM = { nom: '', categorie: 'Engrais', culture: 'Toutes', unite: 'kg', prixUnitaire: '', stockDisponible: '', seuilAlerte: '', fournisseur: '' }

export default function IntrantsPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [search, setSearch]         = useState('')
  const [filterCat, setFilterCat]   = useState('Toutes')
  const [filterCul, setFilterCul]   = useState('Toutes')
  const [filterSt, setFilterSt]     = useState('Tous')
  const [selected, setSelected]     = useState<Intrant | null>(null)
  const [qte, setQte]               = useState(1)
  const [showNew, setShowNew]       = useState(false)
  const [form, setForm]             = useState(EMPTY_FORM)

  // KPIs
  const valeurTotale    = DATA.reduce((a, i) => a + i.prixUnitaire * i.stockDisponible, 0)
  const nbEpuisesExp    = DATA.filter(i => i.statut === 'Épuisé' || i.statut === 'Expiré').length
  const nbFaible        = DATA.filter(i => i.statut === 'Stock faible').length
  const nbCategories    = new Set(DATA.map(i => i.categorie)).size

  // Alerte bannière: épuisés, expirés, ou expiration < 30j
  const alerteItems = DATA.filter(i => i.statut === 'Épuisé' || i.statut === 'Expiré' || expiresSoon(i.dateExpiration))

  // BarChart: valeur par catégorie
  const chartData = (['Engrais','Semence','Pesticide','Herbicide','Fongicide','Matériel'] as Categorie[]).map(cat => ({
    cat,
    valeur: DATA.filter(i => i.categorie === cat).reduce((a, i) => a + i.prixUnitaire * i.stockDisponible, 0),
  }))

  // Filtre table
  const filtered = DATA.filter(i => {
    if (filterCat !== 'Toutes' && i.categorie !== filterCat) return false
    if (filterCul !== 'Toutes' && i.culture !== filterCul)   return false
    if (filterSt  !== 'Tous'   && i.statut  !== filterSt)    return false
    if (search && !i.nom.toLowerCase().includes(search.toLowerCase()) &&
        !i.fournisseur.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const inputCls = { background: '#ffffff0d', border: `1px solid ${BORDER}`, color: '#fff' }

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      <Toaster position="bottom-right" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: BG2 }}>
            <Sprout className="w-5 h-5" style={{ color: GOLD }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: NAVY }}>Intrants agricoles</h1>
            <p className="text-sm text-gray-500">Engrais, semences et produits phytosanitaires</p>
          </div>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: NAVY, color: '#fff' }}>
          <Plus className="w-4 h-4" /> Nouvel intrant
        </button>
      </div>

      {/* Bannière alerte */}
      {alerteItems.length > 0 && (
        <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl border"
          style={{ background: '#450a0a22', borderColor: '#991b1b' }}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
          <div>
            <p className="text-sm font-semibold text-red-400">{alerteItems.length} intrant(s) nécessitent une action</p>
            <p className="text-xs text-red-300/70 mt-0.5">{alerteItems.map(i => `${i.nom} (${i.statut})`).join(' · ')}</p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {([
          { label: 'Valeur stock totale', value: fmt(valeurTotale),         icon: Package,       color: CYAN },
          { label: 'Épuisés / Expirés',   value: `${nbEpuisesExp} intrants`, icon: AlertTriangle, color: '#f87171' },
          { label: 'Stock faible',         value: `${nbFaible} intrants`,    icon: AlertTriangle, color: '#fb923c' },
          { label: 'Catégories',           value: `${nbCategories} types`,   icon: FlaskConical,  color: GOLD },
        ] as const).map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl p-4 border" style={{ background: BG2, borderColor: BORDER }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color }} />
              <p className="text-xs text-white/50">{label}</p>
            </div>
            <p className="text-lg font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* BarChart */}
      {mounted && (
        <div className="rounded-xl p-5 border mb-6" style={{ background: BG2, borderColor: BORDER }}>
          <p className="text-sm font-semibold text-white/60 mb-4">Valeur du stock par catégorie</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="cat" tick={{ fill: '#ffffff60', fontSize: 11 }} />
              <YAxis tickFormatter={v => `${((v as number)/1000).toFixed(0)}k`} tick={{ fill: '#ffffff60', fontSize: 11 }} />
              <Tooltip formatter={(v) => [fmt(v as number), 'Valeur']}
                contentStyle={{ background: NAVY, border: `1px solid ${BORDER}`, borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Bar dataKey="valeur" fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filtres + Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: BG2, borderColor: BORDER }}>
        <div className="flex flex-wrap gap-3 p-4">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher intrant ou fournisseur…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none" style={inputCls} />
          </div>
          {([
            { label:'Catégorie', val:filterCat, set:setFilterCat, opts:['Toutes','Engrais','Semence','Pesticide','Herbicide','Fongicide','Matériel'] },
            { label:'Culture',   val:filterCul, set:setFilterCul, opts:['Toutes','Maïs','Sorgho','Mil','Coton','Niébé'] },
            { label:'Statut',    val:filterSt,  set:setFilterSt,  opts:['Tous','Disponible','Stock faible','Épuisé','Expiré'] },
          ]).map(({ label, val, set, opts }) => (
            <select key={label} value={val} onChange={e => set(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm outline-none cursor-pointer" style={inputCls}>
              {opts.map(o => <option key={o} value={o} style={{ background: NAVY }}>{o}</option>)}
            </select>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#ffffff08' }}>
                {['Intrant','Catégorie','Culture','Stock','Seuil alerte','Prix unit.','Expiration','Statut'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-white/40 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => {
                const pct = i.seuilAlerte > 0 ? Math.min(100, (i.stockDisponible / (i.seuilAlerte * 3)) * 100) : 100
                const barColor = pct < 33 ? '#f87171' : pct < 66 ? '#fb923c' : '#4ade80'
                return (
                  <tr key={i.id} onClick={() => { setSelected(i); setQte(1) }}
                    className="border-t cursor-pointer transition-colors hover:bg-white/5"
                    style={{ borderColor: BORDER }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Sprout className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                        <span className="font-medium text-white whitespace-nowrap">{i.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60">{i.categorie}</td>
                    <td className="px-4 py-3 text-white/60">{i.culture}</td>
                    <td className="px-4 py-3">
                      <span className="text-white font-semibold">{fmtN(i.stockDisponible)} {i.unite}</span>
                      <div className="mt-1 h-1.5 rounded-full w-20 overflow-hidden" style={{ background: '#ffffff15' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs">{fmtN(i.seuilAlerte)} {i.unite}</td>
                    <td className="px-4 py-3 text-white/80 whitespace-nowrap">{fmtN(i.prixUnitaire)} FCFA</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${expiresSoon(i.dateExpiration) ? 'text-orange-400 font-semibold' : 'text-white/50'}`}>
                        {i.dateExpiration}
                      </span>
                    </td>
                    <td className="px-4 py-3"><Badge s={i.statut} /></td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-white/30">Aucun intrant trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal détail + Commander */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 border" style={{ background: NAVY, borderColor: BORDER }}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-white">{selected.nom}</h2>
                <p className="text-sm text-white/50">{selected.categorie} · {selected.fournisseur}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2.5 text-sm mb-5">
              {([
                ['Culture cible', selected.culture],
                ['Unité', selected.unite],
                ['Prix unitaire', fmt(selected.prixUnitaire)],
                ['Stock disponible', `${fmtN(selected.stockDisponible)} ${selected.unite}`],
                ['Seuil alerte', `${fmtN(selected.seuilAlerte)} ${selected.unite}`],
                ['Expiration', selected.dateExpiration],
                ['Valeur totale en stock', fmt(selected.prixUnitaire * selected.stockDisponible)],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-white/50">{k}</span>
                  <span className="text-white font-medium text-right">{v}</span>
                </div>
              ))}
              <div className="pt-1"><Badge s={selected.statut} /></div>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: BORDER }}>
              <div className="flex items-center gap-1">
                <button onClick={() => setQte(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-colors font-bold">−</button>
                <span className="w-10 text-center text-white font-bold text-sm">{qte}</span>
                <button onClick={() => setQte(q => q + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-colors font-bold">+</button>
              </div>
              <button onClick={() => {
                toast.success(`Commande de ${qte} ${selected.unite} de "${selected.nom}" envoyée`)
                setSelected(null)
              }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                style={{ background: GOLD, color: NAVY }}>
                Commander {qte} {selected.unite}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvel intrant */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 border max-h-[90vh] overflow-y-auto" style={{ background: NAVY, borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Nouvel intrant</h2>
              <button onClick={() => setShowNew(false)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {([
                { label:'Nom',                   key:'nom',             type:'text',   ph:'ex: Urée 46%' },
                { label:'Fournisseur',            key:'fournisseur',     type:'text',   ph:'ex: SOFITEX' },
                { label:'Prix unitaire (FCFA)',   key:'prixUnitaire',    type:'number', ph:'0' },
                { label:'Stock disponible',       key:'stockDisponible', type:'number', ph:'0' },
                { label:'Seuil alerte',           key:'seuilAlerte',     type:'number', ph:'0' },
              ] as { label:string; key:string; type:string; ph:string }[]).map(({ label, key, type, ph }) => (
                <div key={key}>
                  <label className="text-xs text-white/50 block mb-1">{label}</label>
                  <input type={type} placeholder={ph}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ ...inputCls }} />
                </div>
              ))}
              {([
                { label:'Catégorie', key:'categorie', opts:['Engrais','Semence','Pesticide','Herbicide','Fongicide','Matériel'] },
                { label:'Culture',   key:'culture',   opts:['Toutes','Maïs','Sorgho','Mil','Coton','Niébé'] },
                { label:'Unité',     key:'unite',     opts:['kg','L','Sac','Bidon','Unité'] },
              ] as { label:string; key:string; opts:string[] }[]).map(({ label, key, opts }) => (
                <div key={key}>
                  <label className="text-xs text-white/50 block mb-1">{label}</label>
                  <select value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer" style={{ ...inputCls }}>
                    {opts.map(o => <option key={o} value={o} style={{ background: NAVY }}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button onClick={() => {
              if (!form.nom.trim()) { toast.error("Le nom de l'intrant est requis"); return }
              toast.success(`Intrant "${form.nom}" ajouté avec succès`)
              setShowNew(false)
              setForm(EMPTY_FORM)
            }}
              className="w-full mt-5 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
              style={{ background: GOLD, color: NAVY }}>
              Créer l'intrant
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
