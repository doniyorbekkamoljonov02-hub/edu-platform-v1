import { useMemo } from 'react'
import { Clock3, MapPin } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { scheduleService } from '../../services/schedule.service'
import { teacherService } from '../../services/teacher.service'
import { subjectService } from '../../services/subject.service'
import { groupService } from '../../services/group.service'
import { DAY_LABELS, DAY_ORDER } from '../../constants/dayOfWeek'
import { getTodayDayKey } from '../../utils/date'
import Loader from '../ui/Loader'
import ErrorState from '../ui/ErrorState'
import EmptyState from '../ui/EmptyState'

export default function MySchedule({ filterBy }) {
  const schedule = useFetch(() => scheduleService.getAll(), [])
  const teachers = useFetch(() => teacherService.getAll(), [])
  const subjects = useFetch(() => subjectService.getAll(), [])
  const groups = useFetch(() => groupService.getAll(), [])
  const loading = schedule.isLoading || teachers.isLoading || subjects.isLoading || groups.isLoading
  const error = schedule.error || teachers.error || subjects.error || groups.error

  const byDay = useMemo(() => {
    if (!schedule.data || !teachers.data || !subjects.data || !groups.data) return {}
    const tm = new Map(teachers.data.map((x) => [x.id, x]))
    const sm = new Map(subjects.data.map((x) => [x.id, x]))
    const gm = new Map(groups.data.map((x) => [x.id, x]))
    const key = filterBy.teacherId ? 'teacherId' : 'groupId'
    const value = filterBy.teacherId ?? filterBy.groupId
    const out = Object.fromEntries(DAY_ORDER.map((day) => [day, []]))
    schedule.data.filter((x) => x[key] === value && x.isActive).forEach((x) => {
      const teacher = tm.get(x.teacherId)
      out[x.dayOfWeek]?.push({ id: x.id, start: x.startTime, end: x.endTime, subject: sm.get(x.subjectId)?.name ?? 'Fan', group: gm.get(x.groupId)?.name ?? '—', teacher: teacher ? `${teacher.firstName} ${teacher.lastName}` : '—', room: x.room || '—' })
    })
    Object.values(out).forEach((list) => list.sort((a, b) => a.start.localeCompare(b.start)))
    return out
  }, [schedule.data, teachers.data, subjects.data, groups.data, filterBy])

  if (loading) return <Loader />
  if (error) return <ErrorState />
  if (!Object.values(byDay).some((list) => list.length)) return <EmptyState message="Hali dars jadvali biriktirilmagan." />

  const today = getTodayDayKey()
  return <div className="space-y-5">
    {today && <div><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-black text-[#26313D]">Bugungi darslar</h2><span className="rounded-full bg-[#E7F0F2] px-2.5 py-1 text-[10px] font-bold text-[#173B57]">{(byDay[today] || []).length} ta</span></div><div className="space-y-2">{(byDay[today] || []).length ? byDay[today].map((row) => <Lesson key={row.id} row={row}/>) : <p className="rounded-2xl bg-[#F5F7F9] p-4 text-sm text-[#7B8491]">Bugun dars yo‘q.</p>}</div></div>}
    <div><h2 className="mb-3 text-sm font-black text-[#26313D]">Haftalik jadval</h2><div className="space-y-3">{DAY_ORDER.map((day) => <section key={day} className="overflow-hidden rounded-2xl border border-[#E3E7EC] bg-white"><div className="flex items-center justify-between bg-[#F7F8FA] px-4 py-3"><b className="text-sm text-[#26313D]">{DAY_LABELS[day]}</b><span className="text-[11px] font-bold text-[#8A93A1]">{byDay[day]?.length || 0} dars</span></div>{byDay[day]?.length ? <div className="divide-y divide-[#EEF1F4]">{byDay[day].map((row) => <Lesson key={row.id} row={row} compact/>)}</div> : <p className="px-4 py-4 text-xs text-[#9AA2AE]">Darslar yo‘q</p>}</section>)}</div></div>
  </div>
}
function Lesson({ row, compact = false }) { return <div className={`flex items-center gap-3 ${compact ? 'px-4 py-3' : 'rounded-2xl border border-[#E3E7EC] bg-white p-4'}`}><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7F0F2] text-[#173B57]"><Clock3 size={17}/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2"><b className="text-sm text-[#26313D]">{row.subject}</b><span className="text-xs font-semibold text-[#6F7885]">{row.start}–{row.end}</span></div><p className="mt-0.5 truncate text-xs text-[#8A93A1]">{row.teacher} · {row.group}</p></div><div className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#6F7885]"><MapPin size={13}/>{row.room}</div></div> }
