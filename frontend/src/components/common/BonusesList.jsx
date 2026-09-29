import { useMemo } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { bonusService } from '../../services/bonus.service'
import Table from '../ui/Table'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

function BonusesList({ filterBy }) {
  const { data, isLoading, error } = useFetch(() => bonusService.getAll(), [])

  const rows = useMemo(() => {
    if (!data) return []
    const key = filterBy.studentId ? 'studentId' : 'awardedById'
    const value = filterBy.studentId ?? filterBy.awardedById
    return data
      .filter((b) => b[key] === value)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [data, filterBy])

  const columns = [
    { key: 'points', label: 'Ball' },
    { key: 'reason', label: 'Sababi' },
    { key: 'date', label: 'Sana' },
  ]

  if (isLoading) return <Loader />
  if (error) return <ErrorState />
  if (rows.length === 0) return <EmptyState message="Hali bonuslar mavjud emas." />

  return <Table columns={columns} rows={rows} />
}

export default BonusesList
