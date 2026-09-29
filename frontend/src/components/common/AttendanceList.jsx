import { useMemo } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { attendanceService } from '../../services/attendance.service'
import { subjectService } from '../../services/subject.service'
import Table from '../ui/Table'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

const STATUS_LABELS = {
  PRESENT: 'Keldi',
  ABSENT: 'Kelmadi',
  LATE: 'Kechikdi',
  EXCUSED: 'Sababli',
}

function AttendanceList({ filterBy }) {
  const attendance = useFetch(() => attendanceService.getAll(), [])
  const subjects = useFetch(() => subjectService.getAll(), [])

  const isLoading = attendance.isLoading || subjects.isLoading
  const error = attendance.error || subjects.error

  const rows = useMemo(() => {
    if (!attendance.data || !subjects.data) return []
    const subjectsById = new Map(subjects.data.map((s) => [s.id, s]))
    const key = filterBy.studentId ? 'studentId' : 'teacherId'
    const value = filterBy.studentId ?? filterBy.teacherId

    return attendance.data
      .filter((a) => a[key] === value)
      .map((a) => ({
        id: a.id,
        subject: subjectsById.get(a.subjectId)?.name ?? '—',
        status: STATUS_LABELS[a.status] ?? a.status,
        date: a.date,
        studentId: a.studentId,
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [attendance.data, subjects.data, filterBy])

  const columns = filterBy.studentId
    ? [
        { key: 'subject', label: 'Fan' },
        { key: 'status', label: 'Holati' },
        { key: 'date', label: 'Sana' },
      ]
    : [
        { key: 'studentId', label: 'O‘quvchi ID' },
        { key: 'subject', label: 'Fan' },
        { key: 'status', label: 'Holati' },
        { key: 'date', label: 'Sana' },
      ]

  if (isLoading) return <Loader />
  if (error) return <ErrorState />
  if (rows.length === 0) return <EmptyState message="Hali davomat ma’lumotlari mavjud emas." />

  return <Table columns={columns} rows={rows} />
}

export default AttendanceList
