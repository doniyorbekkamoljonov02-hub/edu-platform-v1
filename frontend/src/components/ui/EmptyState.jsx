import { Inbox } from 'lucide-react'

function EmptyState({ message = 'Ma’lumot topilmadi.' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-16 text-gray-400">
      <Inbox size={28} />
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default EmptyState
