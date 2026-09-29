import { useRef, useState } from 'react'
import { Camera, CheckCircle2, Mail, Phone, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS } from '../../constants/roleLabels'
import api from '../../services/api'

const apiRoot = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/api\/?$/, '')
const imageUrl = (url) => !url ? '' : url.startsWith('http') ? url : `${apiRoot}${url}`

const roleCopy = {
  STUDENT: ['O‘quvchi', 'Bilim, natijalar va yangi marralar uchun shaxsiy makon.'],
  TEACHER: ['O‘qituvchi', 'Darslar, o‘quvchilar va ta’lim jarayonini boshqarish profili.'],
  PARENT: ['Ota-ona', 'Farzandingiz ta’lim jarayonini kuzatish uchun shaxsiy profil.'],
  ADMIN: ['Administrator', 'Platforma resurslari va foydalanuvchilarini boshqarish profili.'],
  DIRECTOR: ['Direktor', 'Ta’lim markazi boshqaruvi va nazorati uchun rahbar profili.'],
}

export default function ProfileOverview() {
  const { user, refreshUser } = useAuth()
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email?.split('@')[0] || 'Foydalanuvchi'
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'U'
  const [roleTitle, roleDescription] = roleCopy[user?.role] || [ROLE_LABELS[user?.role] || 'Foydalanuvchi', 'Shaxsiy profilingiz.']

  async function uploadAvatar(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Faqat rasm faylini tanlang.')
    if (file.size > 5 * 1024 * 1024) return setError('Rasm hajmi 5 MB dan kichik bo‘lishi kerak.')
    setUploading(true); setError('')
    try {
      const form = new FormData(); form.append('file', file)
      await api.post('/users/me/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      await refreshUser()
    } catch { setError('Rasmni yuklashda xatolik yuz berdi.') }
    finally { setUploading(false); event.target.value = '' }
  }

  return <div className="profile-page mx-auto max-w-5xl space-y-5">
    <section className="profile-hero relative overflow-hidden rounded-[32px] border border-white/70 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,.08)] sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--role-soft)] blur-3xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative w-fit">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[30px] border-4 border-white bg-[var(--role-soft)] text-3xl font-black text-[var(--role-accent)] shadow-xl sm:h-32 sm:w-32">
            {user?.avatarUrl ? <img src={imageUrl(user.avatarUrl)} alt={fullName} className="h-full w-full object-cover"/> : initials}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={uploadAvatar} className="hidden"/>
          <button onClick={()=>fileRef.current?.click()} disabled={uploading} className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white bg-[var(--role-accent)] text-white shadow-lg transition hover:scale-105 disabled:opacity-60" title="Profil rasmini o‘zgartirish"><Camera size={18}/></button>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[var(--role-soft)] px-3 py-1 text-[11px] font-black uppercase tracking-[.14em] text-[var(--role-accent)]">{roleTitle}</span><span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 size={14}/> Faol profil</span></div>
          <h1 className="truncate text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{fullName}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{roleDescription}</p>
          <button onClick={()=>fileRef.current?.click()} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5"><Camera size={15}/>{uploading ? 'Yuklanmoqda...' : 'Profil rasmini yangilash'}</button>
          {error && <p className="mt-2 text-xs font-bold text-rose-500">{error}</p>}
        </div>
      </div>
    </section>

    <div className="grid gap-4 md:grid-cols-3">
      <Info icon={Mail} label="Email manzil" value={user?.email || '—'}/>
      <Info icon={Phone} label="Telefon" value={user?.phone || 'Kiritilmagan'}/>
      <Info icon={ShieldCheck} label="Platformadagi rol" value={ROLE_LABELS[user?.role] || roleTitle}/>
    </div>

    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,.04)] sm:p-6">
      <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--role-soft)] text-[var(--role-accent)]"><Sparkles size={19}/></div><div><h2 className="font-black text-slate-900">Shaxsiy kabinet</h2><p className="mt-1 text-sm leading-6 text-slate-500">Bu profil aynan sizning {roleTitle.toLowerCase()} hisobingizga tegishli. Profil rasmi barcha qurilmalarda hisobingiz bilan birga ko‘rinadi.</p></div></div>
    </section>
  </div>
}

function Info({icon:Icon,label,value}) { return <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,.035)]"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--role-soft)] text-[var(--role-accent)]"><Icon size={18}/></div><p className="mt-4 text-[10px] font-black uppercase tracking-[.13em] text-slate-400">{label}</p><p className="mt-1 truncate text-sm font-extrabold text-slate-800">{value}</p></div> }
