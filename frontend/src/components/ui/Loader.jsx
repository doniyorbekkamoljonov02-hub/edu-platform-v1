import { Loader2 } from 'lucide-react'

function Loader({ label = 'Yuklanmoqda...' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-gray-500">
      <Loader2 size={18} className="animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export default Loader
