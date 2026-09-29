import { useMemo } from 'react'
import { Clock3 } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { scheduleService } from '../../services/schedule.service'
import { subjectService } from '../../services/subject.service'
import { groupService } from '../../services/group.service'
import { getTodayDayKey } from '../../utils/date'
import Loader from '../ui/Loader'

export default function CompactSchedule({ filterBy, limit=3 }){
  const schedule=useFetch(()=>scheduleService.getAll(),[]), subjects=useFetch(()=>subjectService.getAll(),[]), groups=useFetch(()=>groupService.getAll(),[])
  const rows=useMemo(()=>{if(!schedule.data||!subjects.data||!groups.data)return[];const sm=new Map(subjects.data.map(x=>[x.id,x.name])),gm=new Map(groups.data.map(x=>[x.id,x.name]));const key=filterBy.teacherId?'teacherId':'groupId',value=filterBy.teacherId??filterBy.groupId;return schedule.data.filter(x=>x[key]===value&&x.isActive&&x.dayOfWeek===getTodayDayKey()).sort((a,b)=>a.startTime.localeCompare(b.startTime)).slice(0,limit).map(x=>({...x,subject:sm.get(x.subjectId)||'Fan',group:gm.get(x.groupId)||'—'}))},[schedule.data,subjects.data,groups.data,filterBy,limit])
  if(schedule.isLoading||subjects.isLoading||groups.isLoading)return <Loader/>
  if(!rows.length)return <p className="py-6 text-center text-xs text-[#9296A9]">Bugun darslar yo‘q.</p>
  return <div className="divide-y divide-[#EEF0F5]">{rows.map(r=><div key={r.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0FDFA] text-[#0F766E]"><Clock3 size={16}/></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[#25283A]">{r.subject}</p><p className="mt-0.5 text-[11px] text-[#8C91A5]">{r.group}{r.room?` · ${r.room}`:''}</p></div><span className="text-xs font-bold text-[#0F766E]">{String(r.startTime).slice(0,5)}</span></div>)}</div>
}
