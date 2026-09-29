import { useCurrentStudent } from '../../hooks/useCurrentStudent'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'
import RankingView from '../../components/common/RankingView'
import { Trophy } from 'lucide-react'
export default function Ranking(){const {student,isLoading}=useCurrentStudent();if(isLoading)return <Loader/>;if(!student)return <EmptyState message="O‘quvchi profili topilmadi."/>;return <div className="space-y-4"><header className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#CCFBF1] text-[#0F766E]"><Trophy size={20}/></div><div><h1 className="text-xl font-black">Reytingim</h1><p className="text-xs text-[#64748B]">Sinfdagi natijangiz</p></div></header><section className="rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-5"><RankingView studentId={student.id}/></section></div>}
