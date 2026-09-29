import { useMemo } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { gradeService } from '../../services/grade.service'
import { subjectService } from '../../services/subject.service'
import Table from '../ui/Table'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

/**
 * filterBy: { studentId } | { teacherId } — real data, filtered + joined
 * with subjects on the client (no dedicated joined endpoint yet).
 */
function GradesList({ filterBy }) {
  const grades = useFetch(() => gradeService.getAll(), [])
  const subjects = useFetch(() => subjectService.getAll(), [])

  const isLoading = grades.isLoading || subjects.isLoading
  const error = grades.error || subjects.error

  const rows = useMemo(() => {
    if (!grades.data || !subjects.data) return []
    const subjectsById = new Map(subjects.data.map((s) => [s.id, s]))
    const key = filterBy.studentId ? 'studentId' : 'teacherId'
    const value = filterBy.studentId ?? filterBy.teacherId

    return grades.data
      .filter((g) => g[key] === value)
      .map((g) => ({
        id: g.id,
        subject: subjectsById.get(g.subjectId)?.name ?? '—',
        value: g.value,
        date: g.date,
        studentId: g.studentId,
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [grades.data, subjects.data, filterBy])

  const columns = filterBy.studentId
    ? [
        { key: 'subject', label: 'Fan' },
        { key: 'value', label: 'Baho' },
        { key: 'date', label: 'Sana' },
      ]
    : [
        { key: 'studentId', label: 'O‘quvchi ID' },
        { key: 'subject', label: 'Fan' },
        { key: 'value', label: 'Baho' },
        { key: 'date', label: 'Sana' },
      ]

  if (isLoading) return <Loader />
  if (error) return <ErrorState />
  if (rows.length === 0) return <EmptyState message="Hali baholar mavjud emas." />

  return <Table columns={columns} rows={rows} />
}

export default GradesList
