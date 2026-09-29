import { ArrowRight, CalendarDays, Megaphone, Sparkles, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import { newsService } from '../../services/news.service'

export default function DashboardNewsHighlight({ to }) {
  const news = useFetch(() => newsService.getAll(), [])
  const latest = news.data?.[0]

  if (news.isLoading) {
    return <div className="mb-5 mt-3 h-32 animate-pulse rounded-[26px] bg-slate-200/70" />
  }

  if (!latest) return null

  return (
    <NavLink
      to={to}
      className="group relative mb-5 mt-3 block overflow-hidden rounded-[26px] border border-cyan-200/70 bg-gradient-to-br from-[#083344] via-[#0F766E] to-[#14B8A6] p-4 text-white sm:p-5 shadow-[0_18px_45px_rgba(15,118,110,.20)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,118,110,.28)]"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 animate-pulse rounded-full bg-white/10 blur-xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />

      <div className="relative flex items-start gap-3">
        <div className="relative grid h-11 w-11 shrink-0 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
          <Megaphone size={22} />
          <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-amber-300 opacity-80" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-300" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[.14em] text-cyan-50">
              <Sparkles size={11} /> Yangi yangilik
            </span>
          </div>
          <h2 className="mt-2 line-clamp-2 text-base sm:line-clamp-1 sm:text-lg font-black tracking-tight">{latest.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-cyan-50/90">{latest.content}</p>

          <div className="mt-3 flex flex-wrap sm:mt-4 items-center gap-x-4 gap-y-2 text-[11px] font-semibold text-cyan-50/80">
            <span className="inline-flex items-center gap-1.5"><Users size={13}/>{latest.targetGroupName || 'Barcha sinflar'}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={13}/>{new Date(latest.createdAt).toLocaleDateString('uz-UZ')}</span>
          </div>
        </div>

        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 transition group-hover:translate-x-1">
          <ArrowRight size={17}/>
        </div>
      </div>
    </NavLink>
  )
}
