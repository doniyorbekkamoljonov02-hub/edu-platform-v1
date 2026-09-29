import { useFetch } from '../../hooks/useFetch'
import PageHeader from '../ui/PageHeader'
import Table from '../ui/Table'
import Loader from '../ui/Loader'
import EmptyState from '../ui/EmptyState'
import ErrorState from '../ui/ErrorState'

/**
 * Fetches a real list from `service.getAll()` and renders it as a table.
 * Used by the simple CRUD-list admin/director pages (Students, Teachers,
 * Subjects, Groups, ...). Create/edit/delete UI is intentionally not wired
 * up yet — that will be added page by page once the forms are designed.
 */
function ResourceListPage({ title, description, service, columns, emptyMessage }) {
  const { data, isLoading, error } = useFetch(() => service.getAll(), [service])

  return (
    <div>
      <PageHeader title={title} description={description} />

      {isLoading && <Loader />}
      {!isLoading && error && <ErrorState />}
      {!isLoading && !error && (!data || data.length === 0) && (
        <EmptyState message={emptyMessage} />
      )}
      {!isLoading && !error && data && data.length > 0 && (
        <Table columns={columns} rows={data} />
      )}
    </div>
  )
}

export default ResourceListPage
