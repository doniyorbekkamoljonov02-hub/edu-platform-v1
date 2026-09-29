import { BookOpen, Sparkles } from 'lucide-react'
import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import GradesList from '../../components/common/GradesList'

export default function Grades(){
  const {student,isLoading}=useCurrentStudent()
  if(isLoading)return <Loader/>
  if(!student)return <EmptyState message="O‘quvchi profili topilmadi."/>
  return <div className="space-y-4">
    <header className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CCFBF1] text-[#0F766E]"><BookOpen size={21}/></div><div><h1 className="text-[24px] font-black tracking-tight">Baholarim</h1><p className="text-sm text-[#64748B]">Fanlar bo‘yicha baholaringiz</p></div></header>
    <section className="relative overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white p-3 shadow-[0_14px_38px_rgba(15,23,42,.05)] sm:p-5"><div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#CCFBF1]/50 blur-2xl"/><div className="relative"><div className="mb-3 flex items-center gap-2 px-1 text-xs font-bold text-[#64748B]"><Sparkles size={14} className="text-[#0F766E]"/>Eng yangi baholar yuqorida ko‘rsatiladi</div><GradesList filterBy={{studentId:student.id}}/></div></section>
  </div>
}
