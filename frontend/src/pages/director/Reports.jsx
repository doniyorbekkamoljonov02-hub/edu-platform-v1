import { useEffect, useMemo, useState } from 'react'
import { BarChart3, CalendarDays, ClipboardCheck, FilePlus2, Gift, GraduationCap, TrendingUp, Users } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'
import Loader from '../../components/ui/Loader'
import { reportService } from '../../services/report.service'
import { studentService } from '../../services/student.service'
import { teacherService } from '../../services/teacher.service'
import { gradeService } from '../../services/grade.service'
import { attendanceService } from '../../services/attendance.service'
import { bonusService } from '../../services/bonus.service'
import { useAuth } from '../../context/AuthContext'

const today = () => new Date().toISOString().slice(0, 10)
const monthStart = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01` }
const typeLabel = { 'general-summary':'Umumiy hisobot', 'grades-summary':'Baholar hisoboti', 'attendance-summary':'Davomat hisoboti', 'bonuses-summary':'Bonuslar hisoboti' }

export default function Reports() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [reports, setReports] = useState([])
  const [type, setType] = useState('general-summary')
  const [periodStart, setPeriodStart] = useState(monthStart())
  const [periodEnd, setPeriodEnd] = useState(today())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setError('')
    try {
      const [students, teachers, grades, attendance, bonuses, saved] = await Promise.all([
        studentService.getAll(), teacherService.getAll(), gradeService.getAll(), attendanceService.getAll(), bonusService.getAll(), reportService.getAll(),
      ])
      setData({ students, teachers, grades, attendance, bonuses })
      setReports(saved || [])
    } catch (e) { setError(e?.response?.data?.message || 'Hisobot ma’lumotlarini yuklab bo‘lmadi.') }
  }
  useEffect(() => { load() }, [])

  const summary = useMemo(() => {
    if (!data) return null
    const values = data.grades.map(g => Number(g.value)).filter(Number.isFinite)
    const avg = values.length ? (values.reduce((a,b)=>a+b,0)/values.length).toFixed(1) : '—'
    const present = data.attendance.filter(a => ['PRESENT','present','KELDI','keldi'].includes(a.status)).length
    const attendanceRate = data.attendance.length ? Math.round(present / data.attendance.length * 100) : 0
    const bonusPoints = data.bonuses.reduce((sum,b)=>sum+Number(b.points||0),0)
    return { avg, attendanceRate, bonusPoints }
  }, [data])

  async function createReport() {
    if (!periodStart || !periodEnd || periodStart > periodEnd) { setError('Hisobot sanalarini to‘g‘ri kiriting.'); return }
    setBusy(true); setError('')
    try {
      await reportService.create({ type, generatedById: user?.userId ?? user?.id, periodStart, periodEnd })
      setReports(await reportService.getAll())
    } catch (e) { setError(e?.response?.data?.message || 'Hisobotni yaratib bo‘lmadi.') }
    finally { setBusy(false) }
  }

  if (!data) return <Loader />
  const cards = [
    ['O‘quvchilar', data.students.length, Users], ['O‘qituvchilar', data.teachers.length, GraduationCap],
    ['O‘rtacha baho', summary.avg, TrendingUp], ['Davomat', `${summary.attendanceRate}%`, ClipboardCheck],
    ['Bonus ballar', summary.bonusPoints, Gift], ['Hisobotlar', reports.length, BarChart3],
  ]

  return <div className="space-y-5">
    <PageHeader title="Hisobotlar" description="Maktab ko‘rsatkichlarini bir joyda kuzating va davr bo‘yicha hisobot yarating." />
    {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</div>}
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">{cards.map(([label,value,Icon]) => <article key={label} className="rounded-[22px] border border-[#E2E8F0] bg-white p-4 shadow-sm"><div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]"><Icon size={19}/></div><p className="text-2xl font-black tracking-tight">{value}</p><p className="mt-1 text-xs font-bold text-[#64748B]">{label}</p></article>)}</section>
    <section className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
      <div className="rounded-[26px] border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5"><div className="mb-5 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F172A] text-white"><FilePlus2 size={20}/></div><div><h2 className="font-black">Yangi hisobot</h2><p className="text-xs text-[#64748B]">Davr va hisobot turini tanlang</p></div></div><div className="space-y-4"><label className="block"><span className="mb-1.5 block text-xs font-bold text-[#475569]">Hisobot turi</span><select value={type} onChange={e=>setType(e.target.value)} className="h-12 w-full rounded-2xl border border-[#CBD5E1] bg-white px-3 text-sm font-bold outline-none focus:border-[#14B8A6]">{Object.entries(typeLabel).map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label><span className="mb-1.5 block text-xs font-bold text-[#475569]">Boshlanish</span><input type="date" value={periodStart} onChange={e=>setPeriodStart(e.target.value)} className="h-12 w-full rounded-2xl border border-[#CBD5E1] px-3 text-sm"/></label><label><span className="mb-1.5 block text-xs font-bold text-[#475569]">Tugash</span><input type="date" value={periodEnd} onChange={e=>setPeriodEnd(e.target.value)} className="h-12 w-full rounded-2xl border border-[#CBD5E1] px-3 text-sm"/></label></div><button disabled={busy} onClick={createReport} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0F172A] text-sm font-black text-white disabled:opacity-50"><FilePlus2 size={17}/>{busy?'Yaratilmoqda...':'Hisobot yaratish'}</button></div></div>
      <div className="rounded-[26px] border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5"><div className="mb-4 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]"><CalendarDays size={20}/></div><div><h2 className="font-black">So‘nggi hisobotlar</h2><p className="text-xs text-[#64748B]">Yaratilgan hisobotlar tarixi</p></div></div>{reports.length ? <div className="space-y-2">{[...reports].sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))).slice(0,8).map(r=><article key={r.id} className="flex items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#0F766E] shadow-sm"><BarChart3 size={17}/></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{typeLabel[r.type] || r.type}</p><p className="mt-0.5 text-[11px] text-[#64748B]">{r.periodStart} — {r.periodEnd}</p></div></article>)}</div> : <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] text-center"><BarChart3 size={30} className="text-[#94A3B8]"/><p className="mt-3 text-sm font-black">Hali hisobot yo‘q</p><p className="mt-1 max-w-xs text-xs text-[#94A3B8]">Chap tomondagi forma orqali birinchi hisobotni yarating.</p></div>}</div>
    </section>
  </div>
}
