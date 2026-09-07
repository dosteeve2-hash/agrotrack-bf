'use client'

import { useState, useTransition } from 'react'
import { Map, Sprout, TrendingUp, Droplets, Plus, Search } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import type { Culture, StatutParcelle, TypeSol } from '@/lib/database.types'
import {
  LIBELLE_CULTURE, LIBELLE_STATUT_PARCELLE, LIBELLE_TYPE_SOL,
} from '@/lib/database.types'
import type { ParcelleVue } from '@/lib/data/parcelles.model'
import { rendementMoyen } from '@/lib/data/parcelles.model'
import { creerParcelle } from './actions'

type Parcelle = ParcelleVue

const STATUTS: readonly StatutParcelle[] = ['active', 'en_repos', 'en_preparation', 'recoltee']

const CULTURES_SAISISSABLES: readonly Culture[] =
  ['mais', 'sorgho', 'mil', 'coton', 'sesame', 'niebe', 'arachide', 'karite']

const SOLS_SAISISSABLES: readonly TypeSol[] =
  ['lateritique', 'argilo_sableux', 'sablonneux', 'limoneux']

function sStyle(s: StatutParcelle | 'Tous') {
  const m: Record<string, { bg: string; color: string }> = {
    active:         { bg:'#10b981', color:'white' },
    en_repos:       { bg:'#4A90D9', color:'white' },
    en_preparation: { bg:'#f97316', color:'white' },
    recoltee:       { bg:'#D4AF37', color:'#0A1628' },
  }
  return m[s] ?? { bg:'#D4AF37', color:'white' }
}

/** Le libelle affiche d'un statut, y compris le pseudo-statut « Tous ». */
function libStatut(s: StatutParcelle | 'Tous') {
  return s === 'Tous' ? 'Tous' : LIBELLE_STATUT_PARCELLE[s]
}

const PIE_COLORS: Record<string, string> = {
  'Active':'#10b981','En repos':'#4A90D9','En préparation':'#f97316','Récoltée':'#D4AF37',
}

function buildBarData(ps: Parcelle[]) {
  const m: Record<string, { total:number; n:number }> = {}
  for (const p of ps) {
    const cle = LIBELLE_CULTURE[p.culture]
    if (!m[cle]) m[cle] = { total:0, n:0 }
    m[cle].total += p.rendementEstime
    m[cle].n += 1
  }
  return Object.entries(m).map(([culture, v]) => ({ culture, rendement:Math.round(v.total/v.n) }))
}

function buildPieData(ps: Parcelle[]) {
  const m: Record<string, number> = {}
  for (const p of ps) {
    const cle = LIBELLE_STATUT_PARCELLE[p.statut]
    m[cle] = (m[cle] || 0) + 1
  }
  return Object.entries(m).map(([name, value]) => ({ name, value }))
}

function DetailModal({ p, onClose }: { p:Parcelle; onClose:()=>void }) {
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:16 }}
      onClick={onClose}>
      {/* Sans role/aria-modal, un lecteur d'écran n'annonce pas une boîte de
          dialogue — et rien ne permet de cibler le contenu du modal. */}
      <div role="dialog" aria-modal="true" aria-label={`Détail de ${p.nom}`}
        style={{ background:'#0A1628',borderRadius:16,padding:28,width:'100%',maxWidth:500,border:'1px solid rgba(255,255,255,0.12)' }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:20 }}>
          <div>
            <h2 style={{ color:'white',fontSize:18,fontWeight:700,marginBottom:6 }}>{p.nom}</h2>
            <span style={{ fontSize:11,fontWeight:600,padding:'2px 10px',borderRadius:20,background:sStyle(p.statut).bg,color:sStyle(p.statut).color }}>
              {LIBELLE_STATUT_PARCELLE[p.statut]}
            </span>
          </div>
          <button onClick={onClose} style={{ color:'rgba(255,255,255,0.5)',background:'none',border:'none',cursor:'pointer',fontSize:22,lineHeight:1 }}>✕</button>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16 }}>
          {([
            ['Producteur',p.membreNom],['Village',p.village],
            ['Superficie',`${p.superficie} ha`],['Culture',LIBELLE_CULTURE[p.culture]],
            ['Type de sol',p.typeSol ? LIBELLE_TYPE_SOL[p.typeSol] : '—'],
            ['Plantation',p.datePlantation ?? '—'],['Récolte estimée',p.dateRecolteEstimee ?? '—'],
            ['Rendement estimé',`${p.rendementEstime} kg/ha`],['Irrigation',p.irrigation?'✓ Oui':'✗ Non'],
          ] as [string,string][]).map(([k,v])=>(
            <div key={k} style={{ background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'10px 12px' }}>
              <p style={{ fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:3 }}>{k}</p>
              <p style={{ fontSize:13,color:'white',fontWeight:600 }}>{v}</p>
            </div>
          ))}
        </div>
        {p.notes && (
          <div style={{ background:'rgba(212,175,55,0.08)',border:'1px solid rgba(212,175,55,0.2)',borderRadius:8,padding:12 }}>
            <p style={{ fontSize:11,color:'#D4AF37',marginBottom:4 }}>Notes</p>
            <p style={{ fontSize:13,color:'rgba(255,255,255,0.8)' }}>{p.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function NewModal({ membres, onClose, onCree }: {
  membres: OptionMembre[]
  onClose: () => void
  onCree: () => void
}) {
  const [f, setF] = useState({ nom:'',superficie:'',membreId:membres[0]?.id ?? '',
    typeSol:'lateritique' as TypeSol, culture:'mais' as Culture,
    datePlantation:'',dateRecolteEstimee:'',
    statut:'active' as StatutParcelle,rendementEstime:'',irrigation:false,notes:'' })
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()
  const upd = (k:string,v:unknown) => setF(prev=>({ ...prev,[k]:v }))
  const inp: React.CSSProperties = { background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',
    borderRadius:8,color:'white',padding:'8px 12px',fontSize:13,width:'100%',outline:'none',boxSizing:'border-box' }
  const lbl: React.CSSProperties = { fontSize:11,color:'rgba(255,255,255,0.5)',marginBottom:4,display:'block' }
  function submit() {
    if (!f.nom || !f.superficie) return
    setErreur(null)
    const donnees = new FormData()
    donnees.set('nom', f.nom)
    donnees.set('superficie', f.superficie)
    donnees.set('membre_id', f.membreId)
    donnees.set('culture', f.culture)
    donnees.set('type_sol', f.typeSol)
    donnees.set('statut', f.statut)
    donnees.set('date_plantation', f.datePlantation)
    donnees.set('date_recolte_estimee', f.dateRecolteEstimee)
    donnees.set('rendement_estime', f.rendementEstime)
    donnees.set('irrigation', String(f.irrigation))
    donnees.set('notes', f.notes)

    demarrer(async () => {
      const res = await creerParcelle(donnees)
      if (!res.ok) { setErreur(res.message ?? 'Enregistrement impossible.'); return }
      onCree()
    })
  }
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:16 }}
      onClick={onClose}>
      <div style={{ background:'#0A1628',borderRadius:16,padding:28,width:'100%',maxWidth:540,border:'1px solid rgba(255,255,255,0.12)',maxHeight:'90vh',overflowY:'auto' }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
          <h2 style={{ color:'white',fontSize:18,fontWeight:700 }}>Nouvelle parcelle</h2>
          <button onClick={onClose} style={{ color:'rgba(255,255,255,0.5)',background:'none',border:'none',cursor:'pointer',fontSize:22 }}>✕</button>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
          <div style={{ gridColumn:'1/-1' }}>
            <label style={lbl}>Nom *</label>
            <input value={f.nom} onChange={e=>upd('nom',e.target.value)} style={inp} placeholder="Parcelle Nord A" />
          </div>
          <div><label style={lbl}>Superficie (ha) *</label>
            <input type="number" value={f.superficie} onChange={e=>upd('superficie',e.target.value)} style={inp} placeholder="2.5" /></div>
          <div><label style={lbl}>Producteur *</label>
            <select value={f.membreId} onChange={e=>upd('membreId',e.target.value)} style={{ ...inp }}>
              {membres.map(m=><option key={m.id} value={m.id}>{m.nom} — {m.village}</option>)}
            </select></div>
          <div><label style={lbl}>Culture</label>
            <select value={f.culture} onChange={e=>upd('culture',e.target.value as Culture)} style={{ ...inp }}>
              {CULTURES_SAISISSABLES.map(c=><option key={c} value={c}>{LIBELLE_CULTURE[c]}</option>)}
            </select></div>
          <div><label style={lbl}>Type de sol</label>
            <select value={f.typeSol} onChange={e=>upd('typeSol',e.target.value as TypeSol)} style={{ ...inp }}>
              {SOLS_SAISISSABLES.map(t=><option key={t} value={t}>{LIBELLE_TYPE_SOL[t]}</option>)}
            </select></div>
          <div><label style={lbl}>Statut</label>
            <select value={f.statut} onChange={e=>upd('statut',e.target.value as StatutParcelle)} style={{ ...inp }}>
              {STATUTS.map(s=><option key={s} value={s}>{LIBELLE_STATUT_PARCELLE[s]}</option>)}
            </select></div>
          <div><label style={lbl}>Rendement estimé (kg/ha)</label>
            <input type="number" value={f.rendementEstime} onChange={e=>upd('rendementEstime',e.target.value)} style={inp} placeholder="1200" /></div>
          <div><label style={lbl}>Date plantation</label>
            <input type="date" value={f.datePlantation} onChange={e=>upd('datePlantation',e.target.value)} style={inp} /></div>
          <div><label style={lbl}>Récolte estimée</label>
            <input type="date" value={f.dateRecolteEstimee} onChange={e=>upd('dateRecolteEstimee',e.target.value)} style={inp} /></div>
          <div style={{ display:'flex',alignItems:'center',gap:8,paddingTop:12 }}>
            <input type="checkbox" id="irr" checked={f.irrigation} onChange={e=>upd('irrigation',e.target.checked)} />
            <label htmlFor="irr" style={{ color:'rgba(255,255,255,0.7)',fontSize:13,cursor:'pointer' }}>Irrigation disponible</label>
          </div>
          <div style={{ gridColumn:'1/-1' }}><label style={lbl}>Notes</label>
            <textarea value={f.notes} onChange={e=>upd('notes',e.target.value)}
              style={{ ...inp,height:64,resize:'none' } as React.CSSProperties} placeholder="Observations..." />
          </div>
        </div>
        {erreur && (
          <p role="alert" style={{ marginTop:16,padding:'8px 12px',borderRadius:8,fontSize:13,
            background:'rgba(239,68,68,0.12)',color:'#fca5a5' }}>{erreur}</p>
        )}
        <div style={{ display:'flex',gap:10,marginTop:20 }}>
          <button onClick={onClose} style={{ flex:1,padding:'10px',borderRadius:8,border:'1px solid rgba(255,255,255,0.12)',background:'transparent',color:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:13 }}>Annuler</button>
          <button onClick={submit} disabled={enCours} style={{ flex:1,padding:'10px',borderRadius:8,border:'none',background:'#D4AF37',color:'#0A1628',cursor:enCours?'wait':'pointer',fontSize:13,fontWeight:700,opacity:enCours?0.5:1 }}>
            {enCours ? 'Enregistrement…' : 'Créer la parcelle'}
          </button>
        </div>
      </div>
    </div>
  )
}

export interface OptionMembre { id: string; nom: string; village: string }

export function ParcellesVue({ parcelles, membres }: {
  parcelles: Parcelle[]
  membres: OptionMembre[]
}) {
  const [search, setSearch]       = useState('')
  const [filterStatut, setFilterStatut] = useState<StatutParcelle|'Tous'>('Tous')
  const [selected, setSelected]   = useState<Parcelle|null>(null)
  const [showNew, setShowNew]     = useState(false)

  const surfaceTotale = parcelles.reduce((s,p)=>s+p.superficie,0)
  const actives       = parcelles.filter(p=>p.statut==='active').length
  // Une cooperative qui vient de s'inscrire n'a aucune parcelle. La maquette
  // divisait quand meme par leur nombre et affichait « NaN kg/ha ».
  const rendMoyen     = rendementMoyen(parcelles)
  const prevues       = parcelles.filter(p=>p.statut==='active'||p.statut==='en_preparation').length
  const kpis = [
    { label:'Surface totale',   value:`${surfaceTotale.toFixed(1)} ha`,                  icon:Map,       color:'#00D4FF' },
    { label:'Parcelles actives',value:`${actives}`,                                       icon:Sprout,    color:'#10b981' },
    { label:'Rendement moyen',  value:`${rendMoyen.toLocaleString('fr-FR')} kg/ha`,      icon:TrendingUp, color:'#D4AF37' },
    { label:'Récoltes prévues', value:`${prevues}`,                                       icon:Droplets,  color:'#f97316' },
  ]
  const barData = buildBarData(parcelles)
  const pieData = buildPieData(parcelles)

  const filtered = parcelles.filter(p=>{
    const q=search.toLowerCase()
    return (p.nom.toLowerCase().includes(q)
        || p.village.toLowerCase().includes(q)
        || p.membreNom.toLowerCase().includes(q)
        || LIBELLE_CULTURE[p.culture].toLowerCase().includes(q))
      && (filterStatut==='Tous'||p.statut===filterStatut)
  })

  const card: React.CSSProperties = { background:'#0c1a34',borderRadius:12,padding:18,border:'1px solid rgba(255,255,255,0.08)' }

  return (
    <div style={{ background:'#0A1628',minHeight:'100vh',padding:24,color:'white' }}>

      {/* Header */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22,fontWeight:800,color:'white',marginBottom:4 }}>Parcelles agricoles</h1>
          <p style={{ fontSize:13,color:'rgba(255,255,255,0.5)' }}>{parcelles.length} parcelles · Saison 2026</p>
        </div>
        <button onClick={()=>setShowNew(true)}
          style={{ display:'flex',alignItems:'center',gap:6,padding:'9px 16px',borderRadius:8,background:'#D4AF37',color:'#0A1628',border:'none',cursor:'pointer',fontSize:13,fontWeight:700 }}>
          <Plus size={15}/> Nouvelle parcelle
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24 }}>
        {kpis.map(k=>(
          <div key={k.label} style={card}>
            <k.icon size={18} style={{ color:k.color,marginBottom:10 }} />
            <p style={{ fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:6 }}>{k.label}</p>
            <p style={{ fontSize:22,fontWeight:800,color:'white' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:24 }}>
        <div style={card}>
          <h2 style={{ fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.8)',marginBottom:14 }}>Rendement estimé par culture (kg/ha)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top:4,right:8,left:-10,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="culture" tick={{ fontSize:11,fill:'rgba(255,255,255,0.4)' }} />
              <YAxis tick={{ fontSize:11,fill:'rgba(255,255,255,0.4)' }} />
              <Tooltip contentStyle={{ background:'#0A1628',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'white',fontSize:12 }} />
              <Bar dataKey="rendement" fill="#D4AF37" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <h2 style={{ fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.8)',marginBottom:14 }}>Répartition par statut</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={72} dataKey="value"
                label={({ name, percent }) => `${name} ${Math.round((percent as number)*100)}%`}
                labelLine={false} style={{ fontSize:10 }}>
                {pieData.map(e=><Cell key={e.name} fill={PIE_COLORS[e.name]??'#ccc'} />)}
              </Pie>
              <Tooltip contentStyle={{ background:'#0A1628',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'white',fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ display:'flex',gap:10,marginBottom:18,flexWrap:'wrap' }}>
        <div style={{ position:'relative',flex:1,minWidth:220 }}>
          <Search size={14} style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Rechercher parcelle, village, culture…"
            style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,
              color:'white',padding:'8px 12px 8px 32px',fontSize:13,width:'100%',outline:'none',boxSizing:'border-box' }} />
        </div>
        {(['Tous',...STATUTS] as const).map(s=>{
          const active = filterStatut===s
          const st = sStyle(s)
          return (
            <button key={s} onClick={()=>setFilterStatut(s)}
              style={{ padding:'7px 14px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',border:'none',
                background:active?(s==='Tous'?'#D4AF37':st.bg):'rgba(255,255,255,0.06)',
                color:active?st.color:'rgba(255,255,255,0.5)' }}>
              {libStatut(s)}
            </button>
          )
        })}
      </div>

      {/* Grid de cartes */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14 }}>
        {filtered.map(p=>(
          <div key={p.id} onClick={()=>setSelected(p)}
            style={{ background:'#0c1a34',borderRadius:12,padding:16,border:'1px solid rgba(255,255,255,0.08)',
              cursor:'pointer',transition:'border-color .2s' }}
            onMouseEnter={e=>(e.currentTarget.style.borderColor='#D4AF37')}
            onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,0.08)')}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8 }}>
              <span style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.35)' }}>{p.membreNom}</span>
              <span style={{ fontSize:10,fontWeight:600,padding:'2px 8px',borderRadius:12,background:sStyle(p.statut).bg,color:sStyle(p.statut).color }}>{LIBELLE_STATUT_PARCELLE[p.statut]}</span>
            </div>
            <p style={{ fontSize:13,fontWeight:700,color:'white',marginBottom:3,lineHeight:1.3 }}>{p.nom}</p>
            <p style={{ fontSize:12,color:'rgba(255,255,255,0.45)',marginBottom:12 }}>{p.village}</p>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:6 }}>
              <div style={{ background:'rgba(255,255,255,0.04)',borderRadius:6,padding:'6px 9px' }}>
                <p style={{ fontSize:9,color:'rgba(255,255,255,0.38)',marginBottom:2 }}>Culture</p>
                <p style={{ fontSize:12,fontWeight:600,color:'#00D4FF' }}>{LIBELLE_CULTURE[p.culture]}</p>
              </div>
              <div style={{ background:'rgba(255,255,255,0.04)',borderRadius:6,padding:'6px 9px' }}>
                <p style={{ fontSize:9,color:'rgba(255,255,255,0.38)',marginBottom:2 }}>Superficie</p>
                <p style={{ fontSize:12,fontWeight:600,color:'#D4AF37' }}>{p.superficie} ha</p>
              </div>
              <div style={{ background:'rgba(255,255,255,0.04)',borderRadius:6,padding:'6px 9px',gridColumn:'1/-1' }}>
                <p style={{ fontSize:9,color:'rgba(255,255,255,0.38)',marginBottom:2 }}>Rendement estimé</p>
                <p style={{ fontSize:12,fontWeight:600,color:'white' }}>{p.rendementEstime.toLocaleString('fr-FR')} kg/ha</p>
              </div>
            </div>
            {p.irrigation&&<div style={{ marginTop:8,display:'flex',alignItems:'center',gap:4 }}>
              <Droplets size={12} color="#00D4FF"/><span style={{ fontSize:10,color:'#00D4FF' }}>Irrigation</span>
            </div>}
          </div>
        ))}
      </div>

      {selected&&<DetailModal p={selected} onClose={()=>setSelected(null)}/>}
      {showNew&&<NewModal membres={membres} onClose={()=>setShowNew(false)} onCree={()=>setShowNew(false)}/>}
    </div>
  )
}
