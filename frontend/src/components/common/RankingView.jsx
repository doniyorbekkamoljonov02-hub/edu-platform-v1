import { useMemo } from 'react'
import { Trophy } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { rankingService } from '../../services/ranking.service'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

/**
 * Ranking rows are meant to be computed from grades + bonuses; that
 * calculation isn't implemented on the backend yet (see
 * backend/src/ranking), so this simply shows whatever rows already exist
 * for the student — often none, which is an honest empty state.
 */
function RankingView({ studentId }) {
  const { data, isLoading, error } = useFetch(() => rankingService.getAll(), [])

  const rows = useMemo(
    () => (data ?? []).filter((r) => r.studentId === studentId),
    [data, studentId],
  )

  if (isLoading) return <Loader />
  if (error) return <ErrorState />
  if (rows.length === 0) return <EmptyState message="Reyting ma’lumotlari hali hisoblanmagan." />

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.id} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Trophy size={20} />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{r.totalPoints} ball</p>
            <p className="text-sm text-gray-500">{r.period}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RankingView
