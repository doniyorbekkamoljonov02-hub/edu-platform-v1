import { useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useFetch } from '../../hooks/useFetch'
import { notificationService } from '../../services/notification.service'
import Table from '../ui/Table'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

const columns = [
  { key: 'title', label: 'Sarlavha' },
  { key: 'message', label: 'Xabar' },
  { key: 'isRead', label: 'Holati', render: (row) => (row.isRead ? 'O‘qilgan' : 'O‘qilmagan') },
  { key: 'createdAt', label: 'Sana' },
]

/**
 * There's no GET /notifications?userId= filter yet, so this fetches all
 * and filters client-side to the logged-in user's own notifications.
 */
function MyNotificationsList() {
  const { user } = useAuth()
  const { data, isLoading, error } = useFetch(() => notificationService.getAll(), [])

  const rows = useMemo(
    () => (data ?? []).filter((n) => n.userId === user?.userId),
    [data, user],
  )

  if (isLoading) return <Loader />
  if (error) return <ErrorState />
  if (rows.length === 0) return <EmptyState message="Hali xabarlar mavjud emas." />

  return <Table columns={columns} rows={rows} />
}

export default MyNotificationsList
