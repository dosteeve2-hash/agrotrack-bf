'use client'

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { toast } from 'sonner'
import { Wrench, CheckCircle, AlertTriangle, XCircle, Search, Plus, Eye, X, Package2 } from 'lucide-react'
import EtatVide from '@/components/EtatVide'
import { useFormatMontant } from '@/lib/compte/useParametresCompte'

/* ── Types ───────────────────────────────────────────────────────────────── */
type EtatEquip = 'Operationnel' | 'En maintenance' | 'Hors service' | 'En location'
type CatEquip  = 'Tracteur' | 'Irrigation' | 'Recolte' | 'Transport' | 'Outillage'

interface Equipement {
  id: string
  nom: string
  categorie: CatEquip
  marque: string
  annee: number
  etat: EtatEquip
  affecteA?: string
  derniereMaintenance: string
  prochaineMaintenance: string
  coutLocation?: number  // par jour, dans la devise du compte
  usure: number          // % 0-100
  notes?: string
}

/* ── Données ─────────────────────────────────────────────────────────────── */
// Aucune donnée d'exemple : les équipements viendront de la base quand ce module y sera raccordé.
const EQUIPEMENTS: Equipement[] = []

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function etatColor(e: EtatEquip) {
  if (e === 'Operationnel')   return '#22c55e'
  if (e === 'En location')    return '#00D4FF'
  if (e === 'En maintenance') return '#f59e0b'
  return '#ef4444'
}
function etatIcon(e: EtatEquip) {
  if (e === 'Operationnel')   return <CheckCircle size={11} />
  if (e === 'En location')    return <Package2 size={11} />
  if (e === 'En maintenance') return <Wrench size={11} />
  return <XCircle size={11} />
}
function usureColor(u: number) {
  if (u < 40) return '#22c55e'
  if (u < 70) return '#f59e0b'
  return '#ef4444'
}

const CAT_COLORS: Record<CatEquip, string> = {
  'Tracteur':  '#D4AF37',
  'Irrigation':'#00D4FF',
  'Recolte':   '#a78bfa',
  'Transport': '#f97316',
  'Outillage': '#22c55e',
}

function EtatBadge({ etat }: { etat: EtatEquip }) {
  const c = etatColor(etat)
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5,
      background:`${c}18`, color:c, borderRadius:6, padding:'3px 10px',
      fontSize:11, fontWeight:700, whiteSpace:'nowrap' as const }}>
      {etatIcon(etat)} {etat}
    </span>
  )
}

function KpiCard({ label, value, sub, color, icon: Icon }:
  { label:string; value:string|number; sub?:string; color:string; icon:React.ComponentType<{size?:number;color?:string}> }) {
  return (
    <div style={{ background:'#0c1a34', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'16px 20px',
      display:'flex', flexDirection:'column' as const, gap:6 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{label}</span>
        <div style={{ background:`${color}18`, borderRadius:8, padding:7, display:'flex' }}>
          <Icon size={14} color={color} />
        </div>
      </div>
      <div style={{ fontSize:24, fontWeight:700, color:'#f0f4ff', fontFamily:'monospace' }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{sub}</div>}
    </div>
  )
}

function ModalEquip({ eq, onClose }: { eq: Equipement; onClose: () => void }) {
  const fmt = useFormatMontant()
  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div style={{ position:'relative', background:'#0c1a34', border:'1px solid rgba(255,255,255,0.07)',
        borderRadius:18, padding:28, width:'100%', maxWidth:520, maxHeight:'90vh',
        overflowY:'auto' as const, margin:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'#f0f4ff' }}>{eq.nom}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginTop:3 }}>
              {eq.marque} · {eq.annee} · {eq.categorie}
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer' }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
          <EtatBadge etat={eq.etat} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          {([
            ['Marque', eq.marque],
            ['Annee', String(eq.annee)],
            ['Categorie', eq.categorie],
            ['Affecte a', eq.affecteA ?? 'Non affecte'],
            ['Derniere maintenance', eq.derniereMaintenance],
            ['Prochaine maintenance', eq.prochaineMaintenance],
          ] as [string,string][]).map(([k,v],i) => (
            <div key={i} style={{ background:'#0d1f3a', borderRadius:10, padding:'10px 14px' }}>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', textTransform:'uppercase' as const,
                letterSpacing:'0.05em', marginBottom:3 }}>{k}</div>
              <div style={{ fontSize:13, color:'#f0f4ff', fontWeight:500 }}>{v}</div>
            </div>
          ))}
        </div>
        {/* Usure */}
        <div style={{ background:'#0d1f3a', borderRadius:10, padding:'12px 16px', marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>Usure materielle</span>
            <span style={{ fontSize:12, fontWeight:700, color:usureColor(eq.usure) }}>{eq.usure}%</span>
          </div>
          <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:6, height:10 }}>
            <div style={{ width:`${eq.usure}%`, height:10, borderRadius:6, background:usureColor(eq.usure), transition:'width 0.3s' }} />
          </div>
        </div>
        {eq.coutLocation && (
          <div style={{ background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.2)',
            borderRadius:10, padding:'10px 14px', marginBottom:16, textAlign:'center' as const }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Tarif location</div>
            <div style={{ fontSize:20, fontWeight:800, color:'#D4AF37', fontFamily:'monospace' }}>
              {fmt(eq.coutLocation)}/jour
            </div>
          </div>
        )}
        {eq.notes && (
          <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)',
            borderRadius:10, padding:'10px 14px', marginBottom:16 }}>
            <div style={{ fontSize:11, color:'#f59e0b', fontWeight:600, marginBottom:4 }}>Notes</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>{eq.notes}</div>
          </div>
        )}
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={() => { toast.success(`Demande de maintenance enregistree pour ${eq.nom}`); onClose() }}
            style={{ background:'rgba(245,158,11,0.15)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)',
              borderRadius:8, padding:'8px 14px', fontSize:12, cursor:'pointer', fontWeight:600,
              display:'flex', alignItems:'center', gap:6 }}>
            <Wrench size={12}/> Maintenance
          </button>
          <button onClick={onClose}
            style={{ background:'#0d1f3a', border:'1px solid rgba(255,255,255,0.07)',
              color:'rgba(255,255,255,0.5)', borderRadius:8, padding:'8px 14px', fontSize:12, cursor:'pointer' }}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Graphique ───────────────────────────────────────────────────────────── */
const catData = (['Tracteur','Irrigation','Recolte','Transport','Outillage'] as CatEquip[]).map(cat => ({
  cat, count: EQUIPEMENTS.filter(e => e.categorie === cat).length,
}))

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function EquipementsPage() {
  const [search,     setSearch]     = useState('')
  const [filterEtat, setFilterEtat] = useState('Tous')
  const [filterCat,  setFilterCat]  = useState('Toutes')
  const [selected,   setSelected]   = useState<Equipement | null>(null)
  const fmt = useFormatMontant()

  const ETATS = ['Tous','Operationnel','En maintenance','En location','Hors service']
  const CATS  = ['Toutes','Tracteur','Irrigation','Recolte','Transport','Outillage']

  const filtered = useMemo(() =>
    EQUIPEMENTS.filter(e =>
      (filterEtat === 'Tous' || e.etat === filterEtat) &&
      (filterCat === 'Toutes' || e.categorie === filterCat) &&
      (!search || e.nom.toLowerCase().includes(search.toLowerCase()) ||
                  e.marque.toLowerCase().includes(search.toLowerCase()))
    ),[filterEtat, filterCat, search])

  const operationnels = EQUIPEMENTS.filter(e => e.etat === 'Operationnel').length
  const enMaintenance = EQUIPEMENTS.filter(e => e.etat === 'En maintenance').length
  const enLocation    = EQUIPEMENTS.filter(e => e.etat === 'En location').length
  const horsService   = EQUIPEMENTS.filter(e => e.etat === 'Hors service').length

  const th: React.CSSProperties = {
    padding:'10px 16px', textAlign:'left', fontSize:11, color:'rgba(255,255,255,0.3)',
    fontWeight:600, borderBottom:'1px solid rgba(255,255,255,0.07)',
    background:'#0d1f3a', whiteSpace:'nowrap' as const,
  }
  const td: React.CSSProperties = {
    padding:'12px 16px', fontSize:13, color:'#f0f4ff',
    borderBottom:'1px solid rgba(255,255,255,0.06)', verticalAlign:'middle',
  }
  const fBtn = (a: boolean): React.CSSProperties => ({
    background:a ? 'rgba(212,175,55,0.15)' : 'transparent',
    color:a ? '#D4AF37' : 'rgba(255,255,255,0.5)',
    border:`1px solid ${a ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius:7, padding:'4px 11px', fontSize:11, cursor:'pointer', fontWeight:a?700:400,
  })

  if (EQUIPEMENTS.length === 0) {
    return (
      <div className="p-8" style={{ maxWidth:1200 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:'#111827', margin:0 }}>Équipements agricoles</h1>
        <p style={{ fontSize:13, color:'#4b5563', margin:'4px 0 24px' }}>Matériel, maintenance et location</p>
        <EtatVide
          titre="Aucun équipement : ajoutez le premier"
          texte="Votre matériel, son état et ses maintenances apparaîtront ici. L’ajout d’équipements n’est pas encore raccordé à la base dans cette version." />
      </div>
    )
  }

  return (
    <div className="p-8" style={{ display:'flex', flexDirection:'column' as const, gap:24, maxWidth:1200 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:'#f0f4ff', margin:0 }}>Equipements agricoles</h1>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', margin:'4px 0 0' }}>
            {EQUIPEMENTS.length} équipement{EQUIPEMENTS.length > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => toast.success('Ajout equipement — bientot disponible')}
          style={{ display:'flex', alignItems:'center', gap:7, background:'#D4AF37', color:'#0A1628',
            border:'none', borderRadius:10, padding:'10px 16px', fontWeight:700, fontSize:13, cursor:'pointer' }}>
          <Plus size={14}/> Ajouter
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        <KpiCard label='Operationnels'   value={operationnels} sub="prets a l'emploi"  color='#22c55e' icon={CheckCircle}  />
        <KpiCard label='En maintenance'  value={enMaintenance} sub='en atelier'         color='#f59e0b' icon={Wrench}       />
        <KpiCard label='En location'     value={enLocation}    sub='chez membres'       color='#00D4FF' icon={Package2}     />
        <KpiCard label='Hors service'    value={horsService}   sub='a reparer'          color='#ef4444' icon={XCircle}      />
      </div>

      {/* Chart */}
      <div style={{ background:'#0c1a34', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:24 }}>
        <h3 style={{ fontSize:13, fontWeight:600, color:'#f0f4ff', margin:'0 0 16px' }}>Equipements par categorie</h3>
        <ResponsiveContainer width='100%' height={160}>
          <BarChart data={catData} barSize={44} margin={{ top:0, right:0, bottom:0, left:-10 }}>
            <XAxis dataKey='cat' tick={{ fontSize:11, fill:'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:10, fill:'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background:'#0c1a34', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, fontSize:12 }}
              cursor={{ fill:'rgba(255,255,255,0.04)' }}
              formatter={(v) => [(v as number), 'Equipements']} />
            <Bar dataKey='count' radius={[6,6,0,0]}>
              {catData.map((e,i) => <Cell key={i} fill={CAT_COLORS[e.cat as CatEquip]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Alerte maintenance */}
      {EQUIPEMENTS.some(e => e.etat === 'Hors service') && (
        <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)',
          borderRadius:12, padding:'12px 18px', display:'flex', alignItems:'center', gap:10 }}>
          <AlertTriangle size={16} color='#ef4444' />
          <span style={{ fontSize:13, color:'#f87171' }}>
            {horsService} equipement{horsService>1?'s':''} hors service — action requise pour maintenir la capacite de production.
          </span>
        </div>
      )}

      {/* Filtres */}
      <div style={{ display:'flex', flexDirection:'column' as const, gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#0c1a34',
          border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'8px 14px', maxWidth:380 }}>
          <Search size={14} color='rgba(255,255,255,0.3)' />
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder='Nom ou marque...'
            style={{ background:'none', border:'none', outline:'none', color:'#f0f4ff', fontSize:13, width:'100%' }} />
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
          {ETATS.map(e=><button key={e} onClick={()=>setFilterEtat(e)} style={fBtn(filterEtat===e)}>{e}</button>)}
          <span style={{ color:'rgba(255,255,255,0.1)', margin:'0 6px' }}>|</span>
          {CATS.map(c=><button key={c} onClick={()=>setFilterCat(c)} style={fBtn(filterCat===c)}>{c}</button>)}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:'#0c1a34', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Equipement','Categorie','Annee','Affectation','Usure','Proch. maint.','Etat',''].map(h=>(
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 && (
                <tr><td colSpan={8} style={{ ...td, textAlign:'center', color:'rgba(255,255,255,0.25)', padding:48, border:'none' }}>
                  Aucun equipement
                </td></tr>
              )}
              {filtered.map((e,i)=>(
                <tr key={e.id} style={{ background:i%2===1?'rgba(13,31,58,0.6)':'transparent' }}>
                  <td style={td}>
                    <div style={{ fontWeight:600 }}>{e.nom}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{e.marque}</div>
                  </td>
                  <td style={td}>
                    <span style={{ background:`${CAT_COLORS[e.categorie]}18`, color:CAT_COLORS[e.categorie],
                      borderRadius:5, padding:'2px 8px', fontSize:11, fontWeight:600 }}>{e.categorie}</span>
                  </td>
                  <td style={{ ...td, color:'rgba(255,255,255,0.5)', fontFamily:'monospace' }}>{e.annee}</td>
                  <td style={{ ...td, fontSize:12, color:'rgba(255,255,255,0.6)', maxWidth:180 }}>
                    <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' as const }}>
                      {e.affecteA ?? <span style={{ color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>Non affecte</span>}
                    </div>
                  </td>
                  <td style={{ ...td, minWidth:120 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ flex:1, background:'rgba(255,255,255,0.08)', borderRadius:4, height:6 }}>
                        <div style={{ width:`${e.usure}%`, height:6, borderRadius:4, background:usureColor(e.usure) }} />
                      </div>
                      <span style={{ fontSize:11, color:usureColor(e.usure), fontWeight:700, minWidth:28 }}>{e.usure}%</span>
                    </div>
                  </td>
                  <td style={{ ...td, fontSize:12, color:'rgba(255,255,255,0.5)' }}>{e.prochaineMaintenance}</td>
                  <td style={td}><EtatBadge etat={e.etat} /></td>
                  <td style={td}>
                    <button onClick={()=>setSelected(e)}
                      style={{ display:'inline-flex', alignItems:'center', gap:5,
                        background:'rgba(0,212,255,0.1)', border:'none', color:'#00D4FF',
                        borderRadius:7, padding:'5px 11px', fontSize:11, cursor:'pointer', fontWeight:600 }}>
                      <Eye size={12}/> Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'10px 18px', borderTop:'1px solid rgba(255,255,255,0.07)',
          fontSize:11, color:'rgba(255,255,255,0.3)', display:'flex', justifyContent:'space-between' }}>
          <span>{filtered.length} equipement{filtered.length!==1?'s':''} affiche{filtered.length!==1?'s':''}</span>
          <span style={{ color:'#D4AF37', fontWeight:600 }}>
            Location: {fmt(EQUIPEMENTS.filter(e=>e.coutLocation).reduce((s,e)=>s+(e.coutLocation??0),0))}/j potentiel
          </span>
        </div>
      </div>

      {selected && <ModalEquip eq={selected} onClose={()=>setSelected(null)} />}
    </div>
  )
}
