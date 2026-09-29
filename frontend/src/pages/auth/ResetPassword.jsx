import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { GraduationCap, Loader2 } from 'lucide-react'
import { authService } from '../../services/auth.service'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)
    setIsSubmitting(true)
    try {
      await authService.resetPassword(token, newPassword)
      setMessage({ type: 'success', text: 'Parolingiz muvaffaqiyatli yangilandi.' })
    } catch (err) {
      const text =
        err?.response?.status === 501
          ? 'Parolni tiklash xizmati hali ishga tushirilmagan. Administratorga murojaat qiling.'
          : err?.response?.data?.message || 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.'
      setMessage({ type: 'error', text: Array.isArray(text) ? text[0] : text })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Yangi parol</h1>
        </div>

        {!token && (
          <p className="mb-4 text-sm text-amber-600">
            Havola yaroqsiz. Iltimos, parolni tiklash so‘rovini qaytadan yuboring.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-gray-700">
              Yangi parol
            </label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Kamida 8 ta belgi"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !token}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Parolni yangilash
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Kirish sahifasiga qaytish
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
