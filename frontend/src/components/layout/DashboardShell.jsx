import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS } from '../../constants/roleLabels'
import RealtimeMessageToast from '../common/RealtimeMessageToast'
import { useUnreadChat } from '../../hooks/useUnreadChat'

const roleTheme = {
  STUDENT: { accent:'#2563EB', soft:'#DBEAFE', deep:'#0B1220', glow:'rgba(37,99,235,.22)' },
  TEACHER: { accent:'#0F766E', soft:'#CCFBF1', deep:'#0B1F22', glow:'rgba(15,118,110,.22)' },
  PARENT: { accent:'#7C3AED', soft:'#EDE9FE', deep:'#171126', glow:'rgba(124,58,237,.20)' },
  ADMIN: { accent:'#C2410C', soft:'#FFEDD5', deep:'#21130D', glow:'rgba(194,65,12,.20)' },
  DIRECTOR: { accent:'#B0892F', soft:'#FEF3C7', deep:'#17150F', glow:'rgba(176,137,47,.20)' },
}
const apiRoot = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '')
const avatarSrc = (url) => !url ? '' : url.startsWith('http') ? url : `${apiRoot}${url}`

export default function DashboardShell({ navItems }) {
  const { user, logout } = useAuth(); const navigate=useNavigate(); const location=useLocation(); const [more,setMore]=useState(false); const { unreadCount }=useUnreadChat()
  const main=navItems.slice(0,4), rest=navItems.slice(4); const theme=roleTheme[user?.role]||roleTheme.STUDENT
  const isChat = /\/chat\/?$/.test(location.pathname)
  const name=user?.firstName?`${user.firstName} ${user.lastName||''}`.trim():user?.email?.split('@')[0]||'Foydalanuvchi'; const role=ROLE_LABELS[user?.role]||'Foydalanuvchi'; const initials=`${user?.firstName?.[0]||''}${user?.lastName?.[0]||''}`.toUpperCase()||'U'
  const signOut=()=>{logout();navigate('/login',{replace:true})}
  const vars={ '--role-accent':theme.accent,'--role-soft':theme.soft,'--role-deep':theme.deep,'--role-glow':theme.glow }
  const avatar=<div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--role-soft)] text-xs font-black text-[var(--role-accent)]">{user?.avatarUrl?<img src={avatarSrc(user.avatarUrl)} alt="" className="h-full w-full object-cover"/>:initials}</div>

  return <div style={vars} className="min-h-screen bg-[#F6F7F9] text-slate-950">
    <RealtimeMessageToast/>
    {!isChat && <aside className="fixed inset-y-0 left-0 z-40 hidden w-[268px] border-r border-white/10 bg-[var(--role-deep)] xl:flex xl:flex-col">
      <div className="px-5 pb-5 pt-6"><div className="flex items-center gap-3 text-white"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--role-accent)] shadow-[0_10px_30px_var(--role-glow)]"><GraduationCap size={21}/></div><div><p className="text-sm font-black tracking-tight">EDU PLATFORM</p><p className="mt-0.5 text-[10px] font-semibold text-white/40">{role} paneli</p></div></div></div>
      <div className="mx-4 mb-4 flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/[.055] p-3">{avatar}<div className="min-w-0"><p className="truncate text-xs font-extrabold text-white">{name}</p><p className="mt-0.5 text-[10px] font-semibold text-white/40">{role}</p></div></div>
      <nav className="flex-1 overflow-y-auto px-3 py-1">{navItems.map(({to,label,icon:Icon})=><NavLink key={to} to={to} className={({isActive})=>`group mb-1 flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[13px] font-bold transition-all duration-300 ${isActive?'bg-white shadow-[0_12px_30px_rgba(0,0,0,.16)]':'hover:bg-white/[.08]'}`} style={({isActive})=>({color:isActive?'#0F172A':'rgba(255,255,255,.78)'})}><div className="relative"><Icon size={18}/>{label==='Xabarlar'&&unreadCount>0&&<Badge n={unreadCount}/>}</div><span>{label}</span></NavLink>)}</nav>
      <div className="border-t border-white/10 p-3"><p className="mb-2 px-3 text-[9px] font-bold tracking-[.16em] text-white/30">EDU PLATFORM · v1.0</p><button onClick={signOut} className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold text-white/50 transition hover:bg-white/[.07] hover:text-white"><LogOut size={18}/>Chiqish</button></div>
    </aside>}

    <div className={`min-h-screen ${isChat?'':'xl:pl-[268px]'}`}><main className={isChat?'min-h-screen p-0':'mx-auto max-w-[1480px] px-4 py-5 pb-28 sm:px-6 sm:py-7 xl:pb-9'}><Outlet/>{!isChat&&<p className="mt-10 pb-2 text-center text-[10px] font-bold tracking-[.14em] text-slate-400 xl:hidden">EDU PLATFORM · v1.0</p>}</main></div>

    {!isChat && <nav className="fixed bottom-3 left-3 right-3 z-40 pb-[env(safe-area-inset-bottom)] xl:hidden"><div className="ios-glass-nav mx-auto flex h-[68px] max-w-xl items-center rounded-[25px] border border-white/65 bg-white/70 px-1.5 shadow-[0_18px_55px_rgba(15,23,42,.18)] backdrop-blur-2xl">{main.map(({to,label,icon:Icon})=><NavLink key={to} to={to} className="flex h-full flex-1 flex-col items-center justify-center gap-1">{({isActive})=><><div className={`relative flex h-9 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${isActive?'translate-y-[-2px] bg-[var(--role-soft)] text-[var(--role-accent)] shadow-sm':'text-slate-400'}`}><Icon size={19} strokeWidth={isActive?2.5:2}/>{label==='Xabarlar'&&unreadCount>0&&<Badge n={unreadCount}/>}</div><span className={`max-w-[68px] truncate text-[9px] font-extrabold ${isActive?'text-[var(--role-accent)]':'text-slate-400'}`}>{label}</span></>}</NavLink>)}<button onClick={()=>setMore(true)} className="flex h-full flex-1 flex-col items-center justify-center gap-1 text-slate-400"><div className="flex h-9 w-12 items-center justify-center rounded-2xl"><Menu size={20}/></div><span className="text-[9px] font-extrabold">Menyu</span></button></div></nav>}

    {!isChat && more&&<div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 backdrop-blur-[5px] xl:hidden" onMouseDown={()=>setMore(false)}><div onMouseDown={e=>e.stopPropagation()} className="w-full max-w-xl rounded-t-[32px] border-t border-white/70 bg-white/90 p-4 pb-[calc(18px+env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-2xl [animation:sheetUp_.22s_ease-out]"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-3">{avatar}<div><p className="text-sm font-extrabold">{name}</p><p className="text-xs text-slate-500">{role}</p></div></div><button onClick={()=>setMore(false)} className="rounded-2xl bg-slate-100 p-2.5 text-slate-600"><X size={18}/></button></div><div className="max-h-[52vh] overflow-y-auto rounded-[22px] border border-slate-200 bg-white/75">{rest.map(({to,label,icon:Icon})=><NavLink onClick={()=>setMore(false)} key={to} to={to} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 last:border-0"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--role-soft)] text-[var(--role-accent)]"><Icon size={18}/></div><span className="flex-1 text-sm font-bold">{label}</span><ChevronRight size={17} className="text-slate-300"/></NavLink>)}</div><button onClick={signOut} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--role-deep)] py-3.5 text-sm font-bold text-white"><LogOut size={17}/>Hisobdan chiqish</button></div></div>}
  </div>
}
function Badge({n}){return <span className="absolute -right-2.5 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-black leading-none text-white ring-2 ring-white">{n>99?'99+':n}</span>}
