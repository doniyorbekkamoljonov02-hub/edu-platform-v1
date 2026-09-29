import { useMemo } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { scheduleService } from '../../services/schedule.service'
import { teacherService } from '../../services/teacher.service'
import { subjectService } from '../../services/subject.service'
import { groupService } from '../../services/group.service'
import { DAY_LABELS, DAY_ORDER } from '../../constants/dayOfWeek'
import PageHeader from '../ui/PageHeader'
import Table from '../ui/Table'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

/**
 * The "Dushanba 09:00–10:20, 9-A, Kimyo, Palonchayev Paloncha, Xona 204"
 * view. Joins schedule rows against teachers/subjects/groups on the
 * client, since there is no dedicated joined endpoint yet.
 *
 * Adding/editing/deleting a lesson is not wired up yet — the form for
 * that (teacher/subject/group/day/time/room picker) will be built next.
 */
function ScheduleOverview() {
  const schedule = useFetch(() => scheduleService.getAll(), [])
  const teachers = useFetch(() => teacherService.getAll(), [])
  const subjects = useFetch(() => subjectService.getAll(), [])
  const groups = useFetch(() => groupService.getAll(), [])

  const isLoading =
    schedule.isLoading || teachers.isLoading || subjects.isLoading || groups.isLoading
  const error = schedule.error || teachers.error || subjects.error || groups.error

  const rows = useMemo(() => {
    if (!schedule.data || !teachers.data || !subjects.data || !groups.data) return []
    const teachersById = new Map(teachers.data.map((t) => [t.id, t]))
    const subjectsById = new Map(subjects.data.map((s) => [s.id, s]))
    const groupsById = new Map(groups.data.map((g) => [g.id, g]))

    return [...schedule.data]
      .sort((a, b) => {
        const dayDiff = DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
        if (dayDiff !== 0) return dayDiff
        return a.startTime.localeCompare(b.startTime)
      })
      .map((row) => {
        const teacher = teachersById.get(row.teacherId)
        const subject = subjectsById.get(row.subjectId)
        const group = groupsById.get(row.groupId)
        return {
          id: row.id,
          day: DAY_LABELS[row.dayOfWeek] ?? row.dayOfWeek,
          time: `${row.startTime}–${row.endTime}`,
          group: group?.name ?? '—',
          subject: subject?.name ?? '—',
          teacher: teacher ? `${teacher.firstName} ${teacher.lastName}` : '—',
          room: row.room ?? '—',
        }
      })
  }, [schedule.data, teachers.data, subjects.data, groups.data])

  const columns = [
    { key: 'day', label: 'Hafta kuni' },
    { key: 'time', label: 'Vaqt' },
    { key: 'group', label: 'Guruh' },
    { key: 'subject', label: 'Fan' },
    { key: 'teacher', label: 'O‘qituvchi' },
    { key: 'room', label: 'Xona' },
  ]

  return (
    <div>
      <PageHeader
        title="Dars jadvali"
        description="Barcha darslar — kun, vaqt, guruh, fan va o‘qituvchi bo‘yicha."
      />
      {isLoading && <Loader />}
      {!isLoading && error && <ErrorState />}
      {!isLoading && !error && rows.length === 0 && (
        <EmptyState message="Hali dars jadvali tuzilmagan." />
      )}
      {!isLoading && !error && rows.length > 0 && <Table columns={columns} rows={rows} />}
    </div>
  )
}

export default ScheduleOverview
