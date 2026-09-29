import { useMemo } from 'react'
import { User } from 'lucide-react'
import { useFetch } from '../../hooks/useFetch'
import { scheduleService } from '../../services/schedule.service'
import { groupService } from '../../services/group.service'
import { subjectService } from '../../services/subject.service'
import { getTodayDayKey } from '../../utils/date'
import Loader from '../ui/Loader'
import ErrorState from '../ui/ErrorState'

function TeacherProfileCard({ teacher }) {
  const schedule = useFetch(() => scheduleService.getAll(), [])
  const groups = useFetch(() => groupService.getAll(), [])
  const subjects = useFetch(() => subjectService.getAll(), [])

  const isLoading = schedule.isLoading || groups.isLoading || subjects.isLoading
  const error = schedule.error || groups.error || subjects.error

  const { subjectName, myGroups, todayLessons } = useMemo(() => {
    if (!schedule.data || !groups.data || !subjects.data) {
      return { subjectName: '—', myGroups: [], todayLessons: [] }
    }
    const groupsById = new Map(groups.data.map((g) => [g.id, g]))
    const subject = subjects.data.find((s) => s.id === teacher.subjectId)
    const mySchedule = schedule.data.filter((s) => s.teacherId === teacher.id)
    const uniqueGroups = [...new Set(mySchedule.map((s) => s.groupId))]
      .map((id) => groupsById.get(id)?.name)
      .filter(Boolean)

    const todayKey = getTodayDayKey()
    const today = mySchedule
      .filter((s) => s.dayOfWeek === todayKey)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .map((s) => ({
        id: s.id,
        time: s.startTime,
        group: groupsById.get(s.groupId)?.name ?? '—',
      }))

    return { subjectName: subject?.name ?? '—', myGroups: uniqueGroups, todayLessons: today }
  }, [schedule.data, groups.data, subjects.data, teacher])

  if (isLoading) return <Loader />
  if (error) return <ErrorState />

  return (
    <div className="max-w-lg rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={26} />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">
            {teacher.firstName} {teacher.lastName}
          </p>
          <p className="text-sm text-gray-500">{subjectName} o‘qituvchisi</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-1 text-sm font-medium text-gray-700">Guruhlar</p>
        {myGroups.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {myGroups.map((g) => (
              <li key={g} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                {g}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">Hali guruh biriktirilmagan.</p>
        )}
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-gray-700">Bugungi darslar</p>
        {todayLessons.length > 0 ? (
          <ul className="space-y-1">
            {todayLessons.map((l) => (
              <li key={l.id} className="text-sm text-gray-600">
                {l.time} — {l.group}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">Bugun darslar yo‘q.</p>
        )}
      </div>
    </div>
  )
}

export default TeacherProfileCard
