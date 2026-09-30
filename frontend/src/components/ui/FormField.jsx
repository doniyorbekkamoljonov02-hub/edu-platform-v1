function FormField({ label, error, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-base sm:text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

export default FormField
