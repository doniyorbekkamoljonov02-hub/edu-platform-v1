import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ROLE_HOME_PATH } from '../../constants/roleLabels'
import { ROLES } from '../../constants/roles'

const ROLE_OPTIONS = [
  { value: ROLES.STUDENT, label: 'O‘quvchi' },
  { value: ROLES.PARENT, label: 'Ota-ona' },
]

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: ROLES.STUDENT,
}

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      const user = await register(form)
      navigate(ROLE_HOME_PATH[user.role], { replace: true })
    } catch (err) {
      const message = err?.response?.data?.message || 'Xatolik yuz berdi. Qaytadan urinib ko‘ring.'
      setError(Array.isArray(message) ? message[0] : message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FCF9EA] px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-[#DB9558]/30 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#DB9558] text-[#FCF9EA] shadow-sm">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Ro‘yxatdan o‘tish</h1>
          <p className="mt-1 text-sm text-[#DB9558] font-medium">EDU PLATFORM</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
                Ism
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#DB9558] focus:outline-none focus:ring-1 focus:ring-[#DB9558]"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
                Familiya
              </label>
              <input
                id="lastName"
                name="lastName"
                required
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#DB9558] focus:outline-none focus:ring-1 focus:ring-[#DB9558]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#DB9558] focus:outline-none focus:ring-1 focus:ring-[#DB9558]"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#DB9558] focus:outline-none focus:ring-1 focus:ring-[#DB9558]"
              placeholder="+998 90 123 45 67"
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#DB9558] focus:outline-none focus:ring-1 focus:ring-[#DB9558]"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Parol
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#DB9558] focus:outline-none focus:ring-1 focus:ring-[#DB9558]"
              placeholder="Kamida 8 ta belgi"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#DB9558] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c68246] disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Ro‘yxatdan o‘tish
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-[#DB9558] hover:underline">
            Kirish sahifasiga qaytish
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
