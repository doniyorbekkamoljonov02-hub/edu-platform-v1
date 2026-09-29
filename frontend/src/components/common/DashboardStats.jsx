import { useFetch } from '../../hooks/useFetch'

function StatCard({ label, service }) {
  const { data, isLoading, error } = useFetch(() => service.getAll(), [service])
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">
        {isLoading ? '…' : error ? '—' : data?.length ?? 0}
      </p>
    </div>
  )
}

/**
 * items: [{ label, service }] — each card fetches a real count via
 * service.getAll().length. No numbers are ever hard-coded.
 */
function DashboardStats({ items }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  )
}

export default DashboardStats
