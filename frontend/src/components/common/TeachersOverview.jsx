import { useMemo } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { teacherService } from '../../services/teacher.service'
import { userService } from '../../services/user.service'
import { subjectService } from '../../services/subject.service'
import PageHeader from '../ui/PageHeader'
import Table from '../ui/Table'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

/**
 * Shows each teacher together with their subject and account status —
 * the "Palonchayev Paloncha — Kimyo o'qituvchisi" view. Joined on the
 * client from three real endpoints (teachers, users, subjects), since
 * there is no dedicated joined endpoint yet.
 */
function TeachersOverview() {
  const teachers = useFetch(() => teacherService.getAll(), [])
  const users = useFetch(() => userService.getAll(), [])
  const subjects = useFetch(() => subjectService.getAll(), [])

  const isLoading = teachers.isLoading || users.isLoading || subjects.isLoading
  const error = teachers.error || users.error || subjects.error

  const rows = useMemo(() => {
    if (!teachers.data || !users.data || !subjects.data) return []
    const usersById = new Map(users.data.map((u) => [u.id, u]))
    const subjectsById = new Map(subjects.data.map((s) => [s.id, s]))

    return teachers.data.map((t) => {
      const account = usersById.get(t.userId)
      const subject = subjectsById.get(t.subjectId)
      return {
        id: t.id,
        fullName: `${t.firstName} ${t.lastName}`,
        subjectName: subject?.name ?? '—',
        phone: t.phone ?? '—',
        status: account?.isActive ? 'Faol' : 'Bloklangan',
      }
    })
  }, [teachers.data, users.data, subjects.data])

  const columns = [
    { key: 'fullName', label: 'F.I.Sh.' },
    { key: 'subjectName', label: 'Fan' },
    { key: 'phone', label: 'Telefon' },
    { key: 'status', label: 'Holati' },
  ]

  return (
    <div>
      <PageHeader title="O‘qituvchilar" description="Har bir o‘qituvchi va u o‘qitadigan fan." />
      {isLoading && <Loader />}
      {!isLoading && error && <ErrorState />}
      {!isLoading && !error && rows.length === 0 && (
        <EmptyState message="Hali o‘qituvchilar qo‘shilmagan." />
      )}
      {!isLoading && !error && rows.length > 0 && <Table columns={columns} rows={rows} />}
    </div>
  )
}

export default TeachersOverview
