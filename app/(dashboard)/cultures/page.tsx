'use client'

import { useState } from 'react'
import { Leaf, TrendingUp, CheckCircle, Clock, Search } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'

interface CycleCulture {
  id: string; culture: string; parcelle: string; superficie: number
  dateSemis: string; dateRecolteEstimee: string
  phaseActuelle: 'Semis'|'Levée'|'Croissance'|'Floraison'|'Maturation'|'Récolte'
  statut: 'En cours'|'Terminée'|'Abandonnée'
  rendementFinal?: number; notes: string
}

const PHASES = ['Semis','Levée','Croissance','Floraison','Maturation','Récolte'] as const
type Phase = typeof PHASES[number]

const PHASE_COLORS: Record<Phase,string> = {
  'Semis':'#6b7280','Levée':'#10b981','Croissance':'#00D4FF',
  'Floraison':'#D4AF37','Maturation':'#f97316','Récolte':'#a78bfa',
}

const CULTURE_COLORS: Record<string,string> = {
  Maïs:'#D4AF37', Sorgho:'#00D4FF', Coton:'#10b981', Mil:'#f97316', Arachide:'#a78bfa',
}

function sStyle(s: string) {
  const m: Record<string,{bg:string;color:string}> = {
    'En cours':   { bg:'#10b981',color:'white' },
    'Terminée':   { bg:'#D4AF37',color:'#0A1628' },
    'Abandonnée': { bg:'#ef4444',color:'white' },
  }
  return m[s]??{ bg:'#D4AF37',color:'white' }
}

const MOCK: CycleCulture[] = [
  { id:'CC01',culture:'Maïs',parcelle:'Parcelle Koubri A',superficie:2.5,
    dateSemis:'2026-05-15',dateRecolteEstimee:'2026-09-10',phaseActuelle:'Floraison',
    statut:'En cours',notes:'Excellente levée, densité optimale.' },
  { id:'CC02',culture:'Sorgho',parcelle:'Parcelle Saponé B',superficie:1.8,
    dateSemis:'2026-06-01',dateRecolteEstimee:'2026-10-15',phaseActuelle:'Croissance',
    statut:'En cours',notes:'Suivi hebdomadaire en place, développement régulier.' },
  { id:'CC03',culture:'Coton',parcelle:'Parcelle Kombissiri C',superficie:3.2,
    dateSemis:'2026-05-20',dateRecolteEstimee:'2026-11-01',phaseActuelle:'Floraison',
    statut:'En cours',notes:'Traitement insecticides semaine 28 prévu.' },
  { id:'CC04',culture:'Mil',parcelle:'Parcelle Manga D',superficie:1.5,
    dateSemis:'2026-06-10',dateRecolteEstimee:'2026-10-20',phaseActuelle:'Semis',
    statut:'En cours',notes:'Semis en cours, pluies favorables cette semaine.' },
  { id:'CC05',culture:'Sésame',parcelle:'Parcelle Pô E',superficie:2.0,
    dateSemis:'2026-05-25',dateRecolteEstimee:'2026-09-05',phaseActuelle:'Maturation',
    statut:'En cours',notes:'Maturité avancée, récolte imminente sous 2 semaines.' },
  { id:'CC06',culture:'Niébé',parcelle:'Parcelle Tenkodogo F',superficie:4.0,
    dateSemis:'2026-06-15',dateRecolteEstimee:'2026-09-30',phaseActuelle:'Croissance',
    statut:'En cours',notes:'Irrigation régulière, croissance conforme.' },
  { id:'CC07',culture:'Arachide',parcelle:'Parcelle Léo G',superficie:2.8,
    dateSemis:'2026-06-05',dateRecolteEstimee:'2026-09-25',phaseActuelle:'Floraison',
    statut:'En cours',notes:'Bonne nodulation racinaire, variété INERA.' },
  { id:'CC08',culture:'Sorgho',parcelle:'Parcelle Koubri H',superficie:1.2,
    dateSemis:'2025-10-01',dateRecolteEstimee:'2026-02-15',phaseActuelle:'Récolte',
    statut:'Terminée',rendementFinal:1350,notes:'Récolte complète, rendement satisfaisant.' },
]

const SAISONS_DATA = [
  { saison:'2024', Maïs:1600, Sorgho:1100, Coton:850, Mil:700, Arachide:950 },
  { saison:'2025', Maïs:1750, Sorgho:1250, Coton:880, Mil:780, Arachide:1050 },
  { saison:'2026', Maïs:1800, Sorgho:1300, Coton:900, Mil:800, Arachide:1100 },
]

function PhaseTimeline({ phase }: { phase:Phase }) {
  const idx = PHASES.indexOf(phase)
  return (
    <div style={{ display:'flex',alignItems:'flex-start',marginTop:6 }}>
      {PHASES.map((p,i)=>(
        <div key={p} style={{ display:'flex',alignItems:'center',flex:1 }}>
          <div style={{ display:'flex',flexDirection:'column',alignItems:'center',flex:'0 0 auto' }}>
            <div style={{ width:10,height:10,borderRadius:'50%',
              background:i<=idx?PHASE_COLORS[p]:'rgba(255,255,255,0.1)',
              border:i===idx?'2px solid white':'2px solid transparent',
              boxShadow:i===idx?`0 0 8px ${PHASE_COLORS[p]}`:'none' }} />
            <span style={{ fontSize:8,color:i<=idx?PHASE_COLORS[p]:'rgba(255,255,255,0.2)',marginTop:3,whiteSpace:'nowrap' }}>{p}</span>
          </div>
          {i<PHASES.length-1&&<div style={{ height:1,flex:1,background:i<idx?PHASE_COLORS[p]:'rgba(255,255,255,0.08)',margin:'0 2px',marginBottom:14 }}/>}
        </div>
      ))}
    </div>
  )
}

function DetailModal({ c, onClose }: { c:CycleCulture; onClose:()=>void }) {
  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:16 }}
      onClick={onClose}>
      {/* Sans role/aria-modal, un lecteur d'écran n'annonce pas une boîte de
          dialogue — et rien ne permet de cibler le contenu du modal. */}
      <div role="dialog" aria-modal="true" aria-label={`Détail du cycle ${c.culture} · ${c.parcelle}`}
        style={{ background:'#0A1628',borderRadius:16,padding:28,width:'100%',maxWidth:520,border:'1px solid rgba(255,255,255,0.12)',maxHeight:'90vh',overflowY:'auto' }}
        onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:20 }}>
          <div>
            <h2 style={{ color:'white',fontSize:18,fontWeight:700,marginBottom:8 }}>{c.culture} · {c.parcelle}</h2>
            <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
              <span style={{ fontSize:11,fontWeight:600,padding:'2px 10px',borderRadius:20,background:sStyle(c.statut).bg,color:sStyle(c.statut).color }}>{c.statut}</span>
              <span style={{ fontSize:11,fontWeight:600,padding:'2px 10px',borderRadius:20,background:PHASE_COLORS[c.phaseActuelle]+'33',color:PHASE_COLORS[c.phaseActuelle] }}>Phase: {c.phaseActuelle}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ color:'rgba(255,255,255,0.5)',background:'none',border:'none',cursor:'pointer',fontSize:22 }}>✕</button>
        </div>
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:11,color:'rgba(255,255,255,0.4)',marginBottom:10 }}>Progression du cycle</p>
          <PhaseTimeline phase={c.phaseActuelle}/>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16 }}>
          {([
            ['Superficie',`${c.superficie} ha`],
            ['Date de semis',c.dateSemis],
            ['Récolte estimée',c.dateRecolteEstimee],
            ['Rendement final',c.rendementFinal?`${c.rendementFinal} kg/ha`:'—'],
          ] as [string,string][]).map(([k,v])=>(
            <div key={k} style={{ background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'10px 12px' }}>
              <p style={{ fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:3 }}>{k}</p>
              <p style={{ fontSize:13,color:'white',fontWeight:600 }}>{v}</p>
            </div>
          ))}
        </div>
        {c.notes&&(
          <div style={{ background:'rgba(212,175,55,0.08)',border:'1px solid rgba(212,175,55,0.2)',borderRadius:8,padding:12 }}>
            <p style={{ fontSize:11,color:'#D4AF37',marginBottom:4 }}>Notes</p>
            <p style={{ fontSize:13,color:'rgba(255,255,255,0.8)' }}>{c.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CulturesPage() {
  const [search, setSearch]           = useState('')
  const [filterStatut, setFilterStatut] = useState<'Tous'|'En cours'|'Terminée'|'Abandonnée'>('Tous')
  const [filterCulture, setFilterCulture] = useState('Toutes')
  const [selected, setSelected]       = useState<CycleCulture|null>(null)

  const cultures = [...new Set(MOCK.map(c=>c.culture))]

  const kpis = [
    { label:'Cycles actifs',      value:MOCK.filter(c=>c.statut==='En cours').length,                          icon:Leaf,         color:'#10b981' },
    { label:'Superficie totale',  value:`${MOCK.reduce((s,c)=>s+c.superficie,0).toFixed(1)} ha`,              icon:TrendingUp,   color:'#D4AF37' },
    { label:'Cultures distinctes',value:cultures.length,                                                        icon:CheckCircle,  color:'#00D4FF' },
    { label:'Cycles terminés',    value:MOCK.filter(c=>c.statut==='Terminée').length,                          icon:Clock,        color:'#a78bfa' },
  ]

  const filtered = MOCK.filter(c=>{
    const q=search.toLowerCase()
    return (c.culture.toLowerCase().includes(q)||c.parcelle.toLowerCase().includes(q))
      &&(filterStatut==='Tous'||c.statut===filterStatut)
      &&(filterCulture==='Toutes'||c.culture===filterCulture)
  })

  const card: React.CSSProperties = { background:'#0c1a34',borderRadius:12,padding:20,border:'1px solid rgba(255,255,255,0.08)' }
  const inp: React.CSSProperties = { background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,color:'white',padding:'8px 12px',fontSize:13,outline:'none',boxSizing:'border-box' }

  return (
    <div style={{ background:'#0A1628',minHeight:'100vh',padding:24,color:'white' }}>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22,fontWeight:800,color:'white',marginBottom:4 }}>Cycles culturaux</h1>
        <p style={{ fontSize:13,color:'rgba(255,255,255,0.5)' }}>{MOCK.length} cycles · Saison 2026</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24 }}>
        {kpis.map(k=>(
          <div key={k.label} style={card}>
            <k.icon size={18} style={{ color:k.color,marginBottom:10 }}/>
            <p style={{ fontSize:12,color:'rgba(255,255,255,0.5)',marginBottom:6 }}>{k.label}</p>
            <p style={{ fontSize:24,fontWeight:800,color:k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div style={{ ...card,marginBottom:24 }}>
        <h2 style={{ fontSize:13,fontWeight:600,color:'rgba(255,255,255,0.8)',marginBottom:16 }}>
          Évolution des rendements sur 3 saisons (kg/ha)
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={SAISONS_DATA} margin={{ top:4,right:16,left:-10,bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="saison" tick={{ fontSize:12,fill:'rgba(255,255,255,0.4)' }} />
            <YAxis tick={{ fontSize:12,fill:'rgba(255,255,255,0.4)' }} />
            <Tooltip contentStyle={{ background:'#0A1628',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'white',fontSize:12 }} />
            <Legend wrapperStyle={{ fontSize:12,color:'rgba(255,255,255,0.6)' }} />
            {Object.entries(CULTURE_COLORS).map(([culture,color])=>(
              <Line key={culture} type="monotone" dataKey={culture} stroke={color}
                strokeWidth={2} dot={{ fill:color,r:4 }} activeDot={{ r:6 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div style={{ display:'flex',gap:10,marginBottom:16,flexWrap:'wrap' }}>
        <div style={{ position:'relative',flex:1,minWidth:220 }}>
          <Search size={14} style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'rgba(255,255,255,0.3)' }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Rechercher cycle, parcelle…"
            style={{ ...inp,width:'100%',paddingLeft:32 }}/>
        </div>
        <select value={filterCulture} onChange={e=>setFilterCulture(e.target.value)} style={{ ...inp }}>
          <option value="Toutes">Toutes cultures</option>
          {cultures.map(c=><option key={c}>{c}</option>)}
        </select>
        {(['Tous','En cours','Terminée','Abandonnée'] as const).map(s=>{
          const active=filterStatut===s; const st=sStyle(s)
          return (
            <button key={s} onClick={()=>setFilterStatut(s)}
              style={{ padding:'7px 14px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',border:'none',
                background:active?(s==='Tous'?'#D4AF37':st.bg):'rgba(255,255,255,0.06)',
                color:active?st.color:'rgba(255,255,255,0.5)' }}>
              {s}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ background:'#0c1a34',borderRadius:12,border:'1px solid rgba(255,255,255,0.08)',overflow:'hidden' }}>
        <table style={{ width:'100%',borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              {['ID','Culture','Parcelle','Superficie','Semis','Récolte','Phase','Statut'].map(h=>(
                <th key={h} style={{ padding:'12px 14px',textAlign:'left',fontSize:10,color:'rgba(255,255,255,0.4)',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c,i)=>(
              <tr key={c.id} onClick={()=>setSelected(c)}
                style={{ borderBottom:'1px solid rgba(255,255,255,0.04)',cursor:'pointer',
                  background:i%2===0?'transparent':'rgba(255,255,255,0.02)' }}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(212,175,55,0.05)')}
                onMouseLeave={e=>(e.currentTarget.style.background=i%2===0?'transparent':'rgba(255,255,255,0.02)')}>
                <td style={{ padding:'12px 14px',fontSize:11,color:'rgba(255,255,255,0.35)' }}>{c.id}</td>
                <td style={{ padding:'12px 14px',fontSize:13,fontWeight:700,color:'#D4AF37' }}>{c.culture}</td>
                <td style={{ padding:'12px 14px',fontSize:12,color:'rgba(255,255,255,0.75)',maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.parcelle}</td>
                <td style={{ padding:'12px 14px',fontSize:12,color:'rgba(255,255,255,0.6)' }}>{c.superficie} ha</td>
                <td style={{ padding:'12px 14px',fontSize:11,color:'rgba(255,255,255,0.45)' }}>{c.dateSemis}</td>
                <td style={{ padding:'12px 14px',fontSize:11,color:'rgba(255,255,255,0.45)' }}>{c.dateRecolteEstimee}</td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{ fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:10,
                    background:PHASE_COLORS[c.phaseActuelle]+'33',color:PHASE_COLORS[c.phaseActuelle] }}>
                    {c.phaseActuelle}
                  </span>
                </td>
                <td style={{ padding:'12px 14px' }}>
                  <span style={{ fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:10,
                    background:sStyle(c.statut).bg,color:sStyle(c.statut).color }}>
                    {c.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected&&<DetailModal c={selected} onClose={()=>setSelected(null)}/>}
    </div>
  )
}
