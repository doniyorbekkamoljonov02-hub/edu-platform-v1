import { AlertTriangle } from 'lucide-react'

function ErrorState({ message = 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-16 text-red-600">
      <AlertTriangle size={28} />
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default ErrorState
