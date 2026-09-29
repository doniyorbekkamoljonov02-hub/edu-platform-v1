import { Settings as SettingsIcon } from 'lucide-react'
import PageHeader from '../../components/ui/PageHeader'

/**
 * Platform-level settings (school name, academic year, etc.) don't have a
 * backend module yet. Rather than ship controls that save nothing, this
 * page is left as an honest placeholder until that module exists.
 */
function Settings() {
  return (
    <div>
      <PageHeader title="Sozlamalar" description="Platforma sozlamalari." />
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-16 text-gray-400">
        <SettingsIcon size={28} />
        <p className="text-sm">Bu bo‘lim hali ishlab chiqilmoqda.</p>
      </div>
    </div>
  )
}

export default Settings
