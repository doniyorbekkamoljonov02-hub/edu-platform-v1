import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_HOME_PATH } from '../../constants/roleLabels'

export default function Login(){
 const {login,isAuthenticated,user}=useAuth(); const navigate=useNavigate(); const location=useLocation()
 const [form,setForm]=useState({email:'',password:''}); const [show,setShow]=useState(false); const [busy,setBusy]=useState(false); const [error,setError]=useState('')
 if(isAuthenticated&&user)return <Navigate to={ROLE_HOME_PATH[user.role]||'/'} replace/>
 async function submit(e){e.preventDefault();setBusy(true);setError('');try{const u=await login({email:form.email.trim(),password:form.password});navigate(location.state?.from?.pathname||ROLE_HOME_PATH[u.role]||'/',{replace:true})}catch(err){const m=err?.response?.data?.message;setError(Array.isArray(m)?m[0]:m||(err?.request?'Serverga ulanib bo‘lmadi. API manzilini tekshiring.':'Email yoki parol noto‘g‘ri.'))}finally{setBusy(false)}}
 return <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_15%,rgba(20,184,166,.14),transparent_30%),radial-gradient(circle_at_90%_85%,rgba(59,130,246,.10),transparent_28%),linear-gradient(145deg,#F8FAFC_0%,#F0FDFA_48%,#F8FAFC_100%)] lg:grid lg:grid-cols-[1.05fr_.95fr]">
   <section className="relative hidden overflow-hidden bg-[#0F172A] p-12 text-white lg:flex lg:flex-col lg:justify-between">
     <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[#14B8A6]/20 blur-3xl"/><div className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full bg-[#F59E0B]/10 blur-3xl"/>
     <div className="relative flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#14B8A6]"><GraduationCap size={24}/></div><div><p className="text-base font-black">EDU PLATFORM</p><p className="text-xs text-white/45">Maktab boshqaruvi, bir joyda</p></div></div>
     <div className="relative max-w-xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-[#5EEAD4]"><Sparkles size={14}/>Yangi avlod ta’lim platformasi</div><h1 className="text-5xl font-black leading-[1.08] tracking-tight">Maktab hayoti endi <span className="text-[#5EEAD4]">oddiyroq.</span></h1><p className="mt-6 max-w-lg text-base leading-7 text-white/55">O‘quvchi, ota-ona, o‘qituvchi va boshqaruv jamoasi uchun tez, tushunarli va telefon uchun yaratilgan yagona platforma.</p></div>
     <div className="relative flex items-center gap-2 text-xs text-white/40"><ShieldCheck size={15}/>Himoyalangan kirish · Rollarga asoslangan ruxsat</div>
   </section>
   <section className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-8"><div className="absolute left-[8%] top-[8%] h-28 w-28 rounded-full bg-[#5EEAD4]/20 blur-3xl lg:hidden"/><div className="absolute bottom-[8%] right-[5%] h-36 w-36 rounded-full bg-[#93C5FD]/20 blur-3xl lg:hidden"/><div className="relative w-full max-w-[430px] rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_30px_80px_rgba(15,23,42,.10)] backdrop-blur-xl sm:p-8 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
     <div className="mb-9 lg:hidden"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F172A] text-white"><GraduationCap size={23}/></div><p className="text-xs font-black uppercase tracking-[.18em] text-[#0F766E]">EDU PLATFORM</p></div>
     <p className="text-sm font-bold text-[#0F766E]">Xush kelibsiz</p><h1 className="mt-2 text-3xl font-black tracking-tight text-[#0F172A]">Hisobingizga kiring</h1><p className="mt-2 text-sm leading-6 text-[#64748B]">Platformadagi shaxsiy kabinetingizni ochish uchun login ma’lumotlaringizni kiriting.</p>
     <form onSubmit={submit} className="mt-8 space-y-5">
       <label className="block"><span className="mb-2 block text-xs font-extrabold text-[#334155]">Email</span><input type="email" required autoComplete="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="name@school.uz" className="h-14 w-full rounded-2xl border border-[#CBD5E1] bg-white px-4 text-sm font-semibold outline-none transition placeholder:text-[#94A3B8] focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10"/></label>
       <label className="block"><span className="mb-2 block text-xs font-extrabold text-[#334155]">Parol</span><div className="relative"><input type={show?'text':'password'} required autoComplete="current-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Parolingiz" className="h-14 w-full rounded-2xl border border-[#CBD5E1] bg-white px-4 pr-12 text-sm font-semibold outline-none transition focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10"/><button type="button" onClick={()=>setShow(!show)} className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-[#64748B]">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
       {error&&<div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold leading-5 text-red-700">{error}</div>}
       <button disabled={busy} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F172A] text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(15,23,42,.18)] transition hover:bg-[#1E293B] disabled:opacity-60">{busy?<Loader2 className="animate-spin" size={18}/>:<>Kirish<ArrowRight size={18}/></>}</button>
     </form>
     <p className="mt-7 text-center text-[11px] leading-5 text-[#94A3B8]">Kirish ma’lumotlarini maktab administratori beradi.</p>
   </div></section>
 </main>
}
